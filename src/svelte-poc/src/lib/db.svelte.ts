import gremlin from 'gremlin';
import { type Idea } from "./data.svelte";
import { COSMOSDB_HOST, COSMOSDB_KEY } from '$env/static/private';

class Db {
  private userid: string = 'bradleyac';
  private hostname: string = COSMOSDB_HOST;
  private primaryKey: string = COSMOSDB_KEY;
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
        mimeType: 'application/vnd.gremlin-v2.0+json'
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

  public async createIdea(idea: Idea): Promise<void> {
    const createIdeaQuery = `g.addV('idea')
      .property('id', prop_id)
      .property('userid', prop_userid)
      .property('name', prop_name)
      .property('desc', prop_desc)`;

    let results = await this.submitWithRetry(createIdeaQuery, {
      prop_id: idea.id,
      prop_userid: this.userid,
      prop_name: idea.name,
      prop_desc: idea.desc
    });
  }

  public async getAllIdeas(): Promise<Idea[]> {
    const getAllIdeasQuery = `g.V().has('userid', prop_userid)`;
    let results = await this.submitWithRetry(getAllIdeasQuery, {
      prop_userid: this.userid
    });
    return results._items.map(mapToIdea);
  }

  public async getIdea(id: string): Promise<Idea> {
    const getIdeaQuery = `g.V([prop_partition_key, prop_id])`;
    let result = await this.submitWithRetry(getIdeaQuery, {
      prop_partition_key: this.userid,
      prop_id: id
    });
    return mapToIdea(result._items[0]);
  }

  public async getRelatedIdeas(id: string): Promise<Idea[]> {
    const getRelatedIdeasQuery = `g.V([prop_partition_key, prop_id]).out('relatesTo')`;
    let results = await this.submitWithRetry(getRelatedIdeasQuery, {
      prop_partition_key: this.userid,
      prop_id: id
    });
    return results._items.map(mapToIdea);
  }

  public async deleteIdea(id: string): Promise<void> {
    const deleteIdeaQuery = `g.V([prop_partition_key, prop_id]).drop()`;
    let result = await this.submitWithRetry(deleteIdeaQuery, {
      prop_partition_key: this.userid,
      prop_id: id
    });
  }

  public async addRelation(id: string, relatedIdeaId: string) {
    const removeRelatedIdeaQuery = `g.V([prop_partition_key, prop_id]).as('a')
      .V(prop_related_id).as('b')
      .addE('relatesTo').from('a').to('b')
      .addE('relatesTo').from('b').to('a')`;
    let result = await this.submitWithRetry(removeRelatedIdeaQuery, {
      prop_partition_key: this.userid,
      prop_id: id,
      prop_related_id: relatedIdeaId
    });
  }

  public async removeRelation(id: string, relatedIdeaId: string) {
    const removeRelatedIdeaQuery = `g.V([prop_partition_key, prop_id])
      .outE('relatesTo')
      .where(inV().has('id', prop_related_id))
      .drop()`;
    let result = await this.submitWithRetry(removeRelatedIdeaQuery, {
      prop_partition_key: this.userid,
      prop_id: id,
      prop_related_id: relatedIdeaId
    });
  }
}

const mapToIdea = (ideaVertex: any): Idea => ({ id: ideaVertex.id, name: ideaVertex.properties.name[0].value, desc: ideaVertex.properties.desc[0].value });
const db = new Db();
export { type Db, db };