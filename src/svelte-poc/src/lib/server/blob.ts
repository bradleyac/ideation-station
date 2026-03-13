import { env } from '$env/dynamic/private';
import { BlobServiceClient } from '@azure/storage-blob';

class Blob {
  private accountName: string = env.AZURE_BLOB_STORAGE_ACCOUNT_NAME || '';
  private connectionString: string = env.AZURE_BLOB_STORAGE_CONNECTION_STRING || '';
  private containerName = 'idea-images';
  private client?: BlobServiceClient;
  constructor() {
    if (this.connectionString) {
      this.client = BlobServiceClient.fromConnectionString(this.connectionString);
    }
  }

  public async uploadImage(file: File): Promise<{ key: string, url: string }> {
    if (!this.client) throw new Error('Client not intialized');
    const id = crypto.randomUUID();
    const extension = file.name.substring(file.name.lastIndexOf('.')) || '.img';
    const blobKey = `${id}${extension}`;
    const containerClient = this.client.getContainerClient(this.containerName);
    await containerClient.createIfNotExists();
    const blobClient = containerClient.getBlockBlobClient(blobKey);
    await blobClient.uploadData(await file.arrayBuffer());
    return { key: blobKey, url: `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${blobKey}` };
  }
}

const blob = new Blob();
export { blob, type Blob };
