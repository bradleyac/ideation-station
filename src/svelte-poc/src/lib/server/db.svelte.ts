import gremlin from 'gremlin';
import { type Category, type CategoryFull, type Idea, type Catalog } from "../types.js";
import { env } from '$env/dynamic/private';

// Azure CosmosDB doesn't support gremlin bytecode, so all queries must be submitted as text!
class Db {
  private hostname: string = env.COSMOSDB_HOST || "ideation-station";
  private primaryKey: string = env.COSMOSDB_KEY || "insertkeyhere";
  private client: gremlin.driver.Client;
  constructor() {
    this.client = this.createClient();
  }

  private createClient() {
    const { Client, auth } = gremlin.driver;
    const { PlainTextSaslAuthenticator } = auth;

    const authenticator = new PlainTextSaslAuthenticator(
      '/dbs/ideationstation/colls/ideas',
      this.primaryKey
    );

    return new Client(
      `wss://${this.hostname}.gremlin.cosmos.azure.com:443/`,
      {
        authenticator,
        traversalsource: 'g',
        rejectUnauthorized: true,
        mimeType: 'application/vnd.gremlin-v2.0+json',
        maxWaitForConnection: 3000,
      });
  }

  private async submitWithRetry(query: string, args: any, retries: number = 2): Promise<any> {
    try {
      return await this.client.submit(query, args);
    }
    catch (error) {
      if (retries > 0) {
        this.client = this.createClient();
        return this.submitWithRetry(query, args, retries--)
      }
      throw error;
    }
  }

  public async createCatalog(userId: string, catalog: Catalog): Promise<void> {
    const createCatalogQuery = `g.addV('catalog')
      .property('id',prop_id)
      .property('userid', prop_userId)
      .property('name', prop_name)
      .property('desc', prop_desc)`;

    let results = this.submitWithRetry(createCatalogQuery, {
      prop_id: catalog.id,
      prop_userId: userId,
      prop_name: catalog.name,
      prop_desc: catalog.desc
    })
  }

  public async updateCatalog(userId: string, catalog: Catalog): Promise<void> {
    const createCatalogQuery = `g.V(prop_userId, prop_id)
      .property('name', prop_name)
      .property('desc', prop_desc)`;

    let results = this.submitWithRetry(createCatalogQuery, {
      prop_id: catalog.id,
      prop_userId: userId,
      prop_name: catalog.name,
      prop_desc: catalog.desc
    })
  }

  // TODO: Test
  public async deleteCatalog(userId: string, catalogId: string): Promise<void> {
    const deleteContentQuery = `g.V(prop_userId, prop_id).outE('contains').inV().drop()`;

    const deleteCatalogQuery = `g.V(prop_userId, prop_id).hasLabel('catalog').drop()`;

    let contextResults = await this.submitWithRetry(deleteContentQuery, {
      prop_id: catalogId,
      prop_userId: userId
    });

    let results = await this.submitWithRetry(deleteCatalogQuery, {
      prop_id: catalogId,
      prop_userId: userId
    });
  }

  public async getAllCatalogs(userId: string): Promise<Catalog[]> {
    const getAllCatalogsQuery = `g.V().has('userid',prop_userId).hasLabel('catalog').project('id','name','desc')
    .by('id')
    .by('name')
    .by('desc')`

    let results = await this.submitWithRetry(getAllCatalogsQuery, {
      prop_userId: userId
    });

    return results._items;
  }

  public async getCatalog(userId: string, catalogId: string): Promise<Catalog> {
    const getCatalogQuery = `g.V(prop_userId, prop_catalogId).project('id','name','desc')
      .by('id')
      .by('name')
      .by('desc')`

    let results = await this.submitWithRetry(getCatalogQuery, {
      prop_userId: userId,
      prop_catalogId: catalogId
    })

    return results._items[0];
  }

  public async createIdea(userId: string, catalogId: string, idea: Idea): Promise<void> {
    // TODO: Transaction?
    const createIdeaQuery = `g.addV('idea')
      .property('id', prop_id)
      .property('userid', prop_userId)
      .property('name', prop_name)
      .property('desc', prop_desc).as('node')
      .V(prop_userId, prop_catalogId).as('catalog')
      .addE('contains').from('catalog').to('node')
      .addE('belongsTo').from('node').to('catalog')`

    const linkCategoriesQuery = `g
      .V(prop_userId, prop_categoryId).as('cat')
      .V(prop_userId, prop_id).as('idea')
      .addE('belongsTo').from('idea').to('cat')
      .addE('contains').from('cat').to('idea')`;

    await this.submitWithRetry(createIdeaQuery, {
      prop_id: idea.id,
      prop_catalogId: catalogId,
      prop_userId: userId,
      prop_name: idea.name,
      prop_desc: idea.desc,
    });

    if (idea.categoryId) {
      await this.submitWithRetry(linkCategoriesQuery, {
        prop_id: idea.id,
        prop_userId: userId,
        prop_categoryId: idea.categoryId,
      });
    }
  }

  public async updateIdea(userId: string, idea: Idea): Promise<void> {
    // TODO: Transaction?
    const adjustIdeaAndDropAllEdgesToCategoriesQuery = `g.V(prop_userId, prop_id)
      .property('name', prop_name)
      .property('desc', prop_desc)
      .union(
        g.V(prop_userId, prop_id).outE('belongsTo').where(inV().hasLabel('category')),
        g.V().hasLabel('category').has('userid', prop_userId).outE('contains').where(inV().hasId(prop_id))
      ).drop();`

    const linkCategoriesQuery = `g.V(prop_userId, prop_categoryId).as('cat')
      .V(prop_userId, prop_id).as('idea')
      .addE('belongsTo').from('idea').to('cat')
      .addE('contains').from('cat').to('idea')`;

    let results = await this.submitWithRetry(adjustIdeaAndDropAllEdgesToCategoriesQuery, {
      prop_id: idea.id,
      prop_userId: userId,
      prop_name: idea.name,
      prop_desc: idea.desc,
    });

    if (idea.categoryId) {
      await this.submitWithRetry(linkCategoriesQuery, {
        prop_id: idea.id,
        prop_userId: userId,
        prop_categoryId: idea.categoryId,
      });
    }
  }

  public async changeIdeaCategory(userId: string, ideaId: string, categoryId: string): Promise<void> {
    const adjustIdeaAndDropAllEdgesToCategoriesQuery = `g.V(prop_userId, prop_id)
      .union(
        g.V(prop_userId, prop_id).outE('belongsTo').where(inV().hasLabel('category')),
        g.V().hasLabel('category').has('userid', prop_userId).outE('contains').where(inV().hasId(prop_id))
      ).drop();`

    const linkCategoriesQuery = `g.V(prop_userId, prop_categoryId).as('cat')
      .V(prop_userId, prop_id).as('idea')
      .addE('belongsTo').from('idea').to('cat')
      .addE('contains').from('cat').to('idea')`;

    let results = await this.submitWithRetry(adjustIdeaAndDropAllEdgesToCategoriesQuery, {
      prop_id: ideaId,
      prop_userId: userId,
    });

    await this.submitWithRetry(linkCategoriesQuery, {
      prop_id: ideaId,
      prop_userId: userId,
      prop_categoryId: categoryId,
    });
  }

  public async createCategory(userId: string, catalogId: string, category: CategoryFull): Promise<void> {
    const createCategoryQuery = `g.addV('category')
      .property('id', prop_id)
      .property('userid', prop_userId)
      .property('name', prop_name)
      .property('desc', prop_desc)
      .as('node')
      .V(prop_userId, prop_catalogId).as('catalog')
      .addE('contains').from('catalog').to('node')
      .addE('belongsTo').from('node').to('catalog')`

    let results = await this.submitWithRetry(createCategoryQuery, {
      prop_id: category.id,
      prop_catalogId: catalogId,
      prop_userId: userId,
      prop_name: category.name,
      prop_desc: category.desc,
    });
  }

  public async updateCategory(userId: string, category: CategoryFull): Promise<void> {
    const updateCategoryQuery = `g.V(prop_userId, prop_id)
      .property('name', prop_name)
      .property('desc', prop_desc)`;

    let results = await this.submitWithRetry(updateCategoryQuery, {
      prop_id: category.id,
      prop_userId: userId,
      prop_name: category.name,
      prop_desc: category.desc,
    });
  }

  public async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const deleteCategoryQuery = `g.V(prop_userId, prop_id).hasLabel('category').drop()`;

    let results = await this.submitWithRetry(deleteCategoryQuery, {
      prop_id: categoryId,
      prop_userId: userId
    });
  }

  public async deleteCategoryIdeas(userId: string, categoryId: string): Promise<void> {
    const deleteCategoryIdeasQuery = `g.V(prop_userId, prop_id).hasLabel('category').outE('contains').inV().drop()`;

    let results = await this.submitWithRetry(deleteCategoryIdeasQuery, {
      prop_id: categoryId,
      prop_userId: userId
    });
  }

  public async deleteUncategorizedIdeas(userId: string, catalogId: string): Promise<void> {
    const deleteUncategorizedIdeasQuery = `g.V(prop_userId, prop_catalogId).hasLabel('catalog').outE('contains').inV().hasLabel('idea').where(outE('belongsTo').inV().hasLabel('category').count().is(0)).drop()`;

    let results = await this.submitWithRetry(deleteUncategorizedIdeasQuery, {
      prop_catalogId: catalogId,
      prop_userId: userId
    });
  }

  public async getAllCategories(userId: string, catalogId: string): Promise<CategoryFull[]> {
    const getAllCategoriesInCatalogQuery = `g.V(prop_userId, prop_catalogId).outE('contains').inV().hasLabel('category').project('id','name','desc','ideaIds')
      .by('id')
      .by('name')
      .by('desc')
      .by(coalesce(outE('contains').inV().values('id').fold(), constant([])))`

    const getUncategorizedCountQuery = `g.V(prop_userId, prop_catalogId).outE('contains').inV().hasLabel('idea')
      .where(outE('belongsTo').inV().hasLabel('category').count().is(0)).values('id')`;

    let getAllCategoriesResult = await this.submitWithRetry(getAllCategoriesInCatalogQuery, {
      prop_userId: userId,
      prop_catalogId: catalogId,
    });

    let uncategorizedCountResult = await this.submitWithRetry(getUncategorizedCountQuery, {
      prop_userId: userId,
      prop_catalogId: catalogId,
    });

    return [...getAllCategoriesResult._items, { id: 'Uncategorized', name: 'Uncategorized', desc: 'Ideas without categories.', ideaIds: uncategorizedCountResult._items }];
  }

  public async getCategoryById(userId: string, categoryId: string): Promise<CategoryFull> {
    const getCategoryByIdQuery = `g.V(prop_userId, prop_id)
      .project('id','name','desc','ideaIds')
      .by('id')
      .by('name')
      .by('desc')
      .by(coalesce(outE('contains').inV().values('id').fold(), constant([])))`;

    let result = await this.submitWithRetry(getCategoryByIdQuery, {
      prop_userId: userId,
      prop_id: categoryId,
    });

    return result._items[0];
  }

  public async getAllIdeas(userId: string, catalogId: string): Promise<Idea[]> {
    // TODO: Revisit performance?
    const getAllIdeasInCatalogQuery = `g.V(prop_userId, prop_catalogId)
      .outE('contains').inV().hasLabel('idea')
      .project('id', 'name', 'desc','categoryId')
      .by('id')
      .by('name')
      .by('desc')
      .by(coalesce(outE('belongsTo').inV().hasLabel('category').values('id').limit(1), constant('')))`;

    let ideasResults = await this.submitWithRetry(getAllIdeasInCatalogQuery, {
      prop_userId: userId,
      prop_catalogId: catalogId,
    });

    return ideasResults._items;
  }

  public async getIdeaIdsByCategory(userId: string, categoryId: string): Promise<string[]> {
    const getAllIdeasQuery = `g.V(prop_userId, prop_categoryId)
      .outE('contains').inV().values('id')`;
    let results = await this.submitWithRetry(getAllIdeasQuery, {
      prop_userId: userId,
      prop_categoryId: categoryId,
    });
    return results._items;
  }

  public async getUncategorizedIdeaIds(userId: string, catalogId: string): Promise<string[]> {
    const getAllUncategorizedIdeasInCatalogQuery = `g.V(prop_userId, prop_catalogId).outE('contains').inV().hasLabel('idea').where(outE('belongsTo').inV().hasLabel('category').count().is(0)).values('id')`

    let results = await this.submitWithRetry(getAllUncategorizedIdeasInCatalogQuery, {
      prop_userId: userId,
      prop_catalogId: catalogId,
    });
    return results._items;
  }

  public async getIdea(userId: string, id: string): Promise<Idea> {
    const getIdeaQuery = `g.V(prop_partition_key, prop_id)
      .project('id', 'name', 'desc', 'categoryId')
      .by('id')
      .by('name')
      .by('desc')
      .by(coalesce(outE('belongsTo').inV().hasLabel('category').values('id').limit(1), constant('')))`;
    let result = await this.submitWithRetry(getIdeaQuery, {
      prop_partition_key: userId,
      prop_id: id
    });
    return result._items[0];
  }

  public async getRelatedIdeas(userId: string, id: string): Promise<Idea[]> {
    const getRelatedIdeasQuery = `g.V(prop_partition_key, prop_id).out('relatesTo')
      .project('id', 'name', 'desc','categoryId')
      .by('id')
      .by('name')
      .by('desc')
      .by(coalesce(outE('belongsTo').inV().hasLabel('category').values('id').limit(1), constant('')))`;
    let results = await this.submitWithRetry(getRelatedIdeasQuery, {
      prop_partition_key: userId,
      prop_id: id
    });
    return results._items;
  }

  public async deleteIdea(userId: string, id: string): Promise<void> {
    const deleteIdeaQuery = `g.V(prop_partition_key, prop_id).drop()`;
    let result = await this.submitWithRetry(deleteIdeaQuery, {
      prop_partition_key: userId,
      prop_id: id
    });
  }

  public async addRelation(userId: string, id: string, relatedIdeaId: string) {
    const addRelationQuery = `g.V(prop_partition_key, prop_id).as('a')
      .V(prop_related_id).as('b')
      .addE('relatesTo').from('a').to('b')
      .addE('relatesTo').from('b').to('a')`;
    let result = await this.submitWithRetry(addRelationQuery, {
      prop_partition_key: userId,
      prop_id: id,
      prop_related_id: relatedIdeaId
    });
  }

  public async removeRelation(userId: string, id: string, relatedIdeaId: string) {
    const removeRelationQuery = `g.V(prop_partition_key, prop_id)
      .outE('relatesTo')
      .where(inV().has('id', prop_related_id))
      .drop()`;
    let result = await this.submitWithRetry(removeRelationQuery, {
      prop_partition_key: userId,
      prop_id: id,
      prop_related_id: relatedIdeaId
    });
  }

  public async addCategoryToIdea(userId: string, id: string, categoryId: string) {
    const addCategoryToIdeaQuery = `g.V(prop_partition_key, prop_categoryId).as('cat')
      .V(prop_partition_key, prop_id).as('idea')
      .addE('belongsTo').from('idea').to('cat')
      .addE('contains').from('cat').to('idea')`;
    let result = await this.submitWithRetry(addCategoryToIdeaQuery, {
      prop_partition_key: userId,
      prop_id: id,
      prop_categoryId: categoryId
    });
  }

  public async removeCategoryFromIdea(userId: string, id: string, categoryId: string) {
    const removeCategoryFromIdeaQuery = `g.inject(0).union(
      g.V(prop_partition_key, prop_id)
        .outE('belongsTo')
        .where(inV().hasLabel('category').hasId(prop_categoryId)),
      g.V(prop_partition_key, prop_categoryId)
        .outE('contains')
        .where(inV().hasId(prop_id))
      ).drop()`;
    let result = await this.submitWithRetry(removeCategoryFromIdeaQuery, {
      prop_partition_key: userId,
      prop_id: id,
      prop_categoryId: categoryId
    });
  }
}

const db = new Db();
export { type Db, db };