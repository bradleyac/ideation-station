import gremlin from 'gremlin';
import { type Category, type CategoryFull, type Idea } from "./types.js";
import { env } from '$env/dynamic/private';

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

  public async createIdea(userid: string, idea: Idea): Promise<void> {
    // TODO: Transaction?
    const createIdeaQuery = `g.addV('idea')
      .property('id', prop_id)
      .property('userid', prop_userid)
      .property('name', prop_name)
      .property('desc', prop_desc)`

    const linkCategoriesQuery = `g
      .V([prop_userid, prop_categoryid]).as('cat')
      .V([prop_userid, prop_id]).as('idea')
      .addE('belongsTo').from('idea').to('cat')
      .addE('contains').from('cat').to('idea')`;

    let results = await this.submitWithRetry(createIdeaQuery, {
      prop_id: idea.id,
      prop_userid: userid,
      prop_name: idea.name,
      prop_desc: idea.desc,
    });

    idea.categoryIds.forEach(async (categoryId) => {
      await this.submitWithRetry(linkCategoriesQuery, {
        prop_id: idea.id,
        prop_userid: userid,
        prop_categoryid: categoryId,
      });
    });
  }

  public async updateIdea(userid: string, idea: Idea): Promise<void> {
    // TODO: Transaction?
    const adjustIdeaAndDropAllEdgesToCategoriesQuery = `g.V([prop_userid, prop_id])
      .property('name', prop_name)
      .property('desc', prop_desc)
      .union(
        g.V([prop_userid, prop_id]).outE('belongsTo'),
        g.V().hasLabel('category').has('userid', prop_userid).outE('contains').where(inV().hasId(prop_id))
      ).drop();`

    const linkCategoriesQuery = `g.V([prop_userid, prop_categoryid]).as('cat')
      .V([prop_userid, prop_id]).as('idea')
      .addE('belongsTo').from('idea').to('cat')
      .addE('contains').from('cat').to('idea')`;

    let results = await this.submitWithRetry(adjustIdeaAndDropAllEdgesToCategoriesQuery, {
      prop_id: idea.id,
      prop_userid: userid,
      prop_name: idea.name,
      prop_desc: idea.desc,
    });

    idea.categoryIds.forEach(async (categoryId) => {
      await this.submitWithRetry(linkCategoriesQuery, {
        prop_id: idea.id,
        prop_userid: userid,
        prop_categoryid: categoryId,
      });
    });
  }

  public async createCategory(userid: string, category: CategoryFull): Promise<void> {
    const createCategoryQuery = `g.addV('category')
      .property('id', prop_id)
      .property('userid', prop_userid)
      .property('name', prop_name)
      .property('desc', prop_desc)`

    let results = await this.submitWithRetry(createCategoryQuery, {
      prop_id: category.id,
      prop_userid: userid,
      prop_name: category.name,
      prop_desc: category.desc,
    });
  }

  public async updateCategory(userid: string, category: CategoryFull): Promise<void> {
    const updateCategoryQuery = `g.V([prop_userid, prop_id])
      .property('name', prop_name)
      .property('desc', prop_desc)`;

    let results = await this.submitWithRetry(updateCategoryQuery, {
      prop_id: category.id,
      prop_userid: userid,
      prop_name: category.name,
      prop_desc: category.desc,
    });
  }

  public async deleteCategory(userid: string, categoryid: string): Promise<void> {
    const deleteCategoryQuery = `g.V([prop_userid, prop_id]).hasLabel('category').drop()`;

    let results = await this.submitWithRetry(deleteCategoryQuery, {
      prop_id: categoryid,
      prop_userid: userid
    });
  }

  public async getAllCategories(userid: string): Promise<Category[]> {
    const getAllCategoriesQuery = `g.V().hasLabel('category').has('userid', prop_userid)
      .project('id','name','count')
      .by('id')
      .by('name')
      .by(outE('contains').count())`;

    const getUncategorizedCountQuery = `g.V().hasLabel('idea').has('userid', prop_userid)
      .where(__.outE('belongsTo').count().is(0))
      .count()`;

    let getAllCategoriesResult = await this.submitWithRetry(getAllCategoriesQuery, {
      prop_userid: userid
    });

    let uncategorizedCountResult = await this.submitWithRetry(getUncategorizedCountQuery, {
      prop_userid: userid
    });

    const uncategorizedCount = uncategorizedCountResult._items[0] || 0;
    return [...getAllCategoriesResult._items, { id: 'Uncategorized', name: 'Uncategorized', count: uncategorizedCount }];
  }

  public async getCategoryById(userid: string, categoryId: string): Promise<Category | null> {
    const getCategoryByIdQuery = `g.V([prop_userid, prop_id])
      .project('id','name','count')
      .by('id')
      .by('name')
      .by(outE('contains').count())`;

    let result = await this.submitWithRetry(getCategoryByIdQuery, {
      prop_userid: userid,
      prop_id: categoryId,
    });

    return result._items[0] || null;
  }

  // TODO: This works, but poorly. It takes forever now (a few seconds) to get all ideas.
  // Need to optimize this, perhaps by caching category -> idea ids mapping somewhere.
  public async getAllIdeas(userid: string): Promise<Idea[]> {
    const getAllIdeasQuery = `g.V().hasLabel('idea').has('userid', prop_userid)
      .project('id', 'name', 'desc')
      .by('id')
      .by('name')
      .by('desc')`;

    const getIdeaToCategoryMappingQuery = `g.E().hasLabel('belongsTo')
      .where(outV().hasLabel('idea').has('userid', prop_userid))
      .where(inV().hasLabel('category').has('userid', prop_userid))
      .project('ideaId','categoryId').by(outV().values('id')).by(inV().values('id'))`

    let ideasResults = await this.submitWithRetry(getAllIdeasQuery, {
      prop_userid: userid
    });

    let ideaToCategoryMappingResults = await this.submitWithRetry(getIdeaToCategoryMappingQuery, {
      prop_userid: userid
    });

    const resultsArray = ideaToCategoryMappingResults._items as Array<{ ideaId: string, categoryId: string }>;

    const ideaToCategoryIds: Record<string, string[]> = resultsArray.reduce((acc, mapping) => {
      if (!acc[mapping.ideaId]) {
        acc[mapping.ideaId] = [];
      }
      acc[mapping.ideaId].push(mapping.categoryId);
      return acc;
    }, {} as Record<string, string[]>);

    return ideasResults._items.map((item: any) => {
      return { ...item, categoryIds: (ideaToCategoryIds[item.id] || []) };
    });
  }

  public async getIdeaIdsByCategory(userid: string, categoryId: string): Promise<string[]> {
    const getAllIdeasQuery = `g.V([prop_userid, prop_categoryid])
      .outE('contains').inV().values('id')`;
    let results = await this.submitWithRetry(getAllIdeasQuery, {
      prop_userid: userid,
      prop_categoryid: categoryId,
    });
    return results._items;
  }

  public async getUncategorizedIdeaIds(userid: string): Promise<string[]> {
    const getAllUncategorizedIdeasQuery = `g.V().hasLabel('idea').has('userid', prop_userid).where(__.outE('belongsTo').count().is(0)).values('id')`;
    let results = await this.submitWithRetry(getAllUncategorizedIdeasQuery, {
      prop_userid: userid,
    });
    return results._items;
  }

  public async getIdea(userid: string, id: string): Promise<Idea> {
    const getIdeaQuery = `g.V([prop_partition_key, prop_id])
      .project('id', 'name', 'desc', 'categoryIds')
      .by('id')
      .by('name')
      .by('desc')
      .by(outE('belongsTo').inV().values('id').fold())`;
    let result = await this.submitWithRetry(getIdeaQuery, {
      prop_partition_key: userid,
      prop_id: id
    });
    return result._items[0];
  }

  public async getRelatedIdeas(userid: string, id: string): Promise<Idea[]> {
    const getRelatedIdeasQuery = `g.V([prop_partition_key, prop_id]).out('relatesTo')
      .project('id', 'name', 'desc')
      .by('id')
      .by('name')
      .by('desc')`;
    let results = await this.submitWithRetry(getRelatedIdeasQuery, {
      prop_partition_key: userid,
      prop_id: id
    });
    return results._items;
  }

  public async deleteIdea(userid: string, id: string): Promise<void> {
    const deleteIdeaQuery = `g.V([prop_partition_key, prop_id]).drop()`;
    let result = await this.submitWithRetry(deleteIdeaQuery, {
      prop_partition_key: userid,
      prop_id: id
    });
  }

  public async addRelation(userid: string, id: string, relatedIdeaId: string) {
    const addRelationQuery = `g.V([prop_partition_key, prop_id]).as('a')
      .V(prop_related_id).as('b')
      .addE('relatesTo').from('a').to('b')
      .addE('relatesTo').from('b').to('a')`;
    let result = await this.submitWithRetry(addRelationQuery, {
      prop_partition_key: userid,
      prop_id: id,
      prop_related_id: relatedIdeaId
    });
  }

  public async removeRelation(userid: string, id: string, relatedIdeaId: string) {
    const removeRelationQuery = `g.V([prop_partition_key, prop_id])
      .outE('relatesTo')
      .where(inV().has('id', prop_related_id))
      .drop()`;
    let result = await this.submitWithRetry(removeRelationQuery, {
      prop_partition_key: userid,
      prop_id: id,
      prop_related_id: relatedIdeaId
    });
  }

  public async addCategoryToIdea(userid: string, id: string, categoryId: string) {
    const addCategoryToIdeaQuery = `g.V([prop_partition_key, prop_categoryid]).as('cat')
      .V([prop_partition_key, prop_id]).as('idea')
      .addE('belongsTo').from('idea').to('cat')
      .addE('contains').from('cat').to('idea')`;
    let result = await this.submitWithRetry(addCategoryToIdeaQuery, {
      prop_partition_key: userid,
      prop_id: id,
      prop_categoryid: categoryId
    });
  }

  public async removeCategoryFromIdea(userid: string, id: string, categoryId: string) {
    const removeCategoryFromIdeaQuery = `g.inject(0).union(
      g.V([prop_partition_key, prop_id])
        .outE('belongsTo')
        .where(inV().hasLabel('category').hasId(prop_categoryid)),
      g.V([prop_partition_key, prop_categoryid])
        .outE('contains')
        .where(inV().hasId(prop_id))
      ).drop()`;
    let result = await this.submitWithRetry(removeCategoryFromIdeaQuery, {
      prop_partition_key: userid,
      prop_id: id,
      prop_categoryid: categoryId
    });
  }
}

const db = new Db();
export { type Db, db };