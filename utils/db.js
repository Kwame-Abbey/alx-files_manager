import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const url = `mongodb://${host}:${port}`;

    // Connection URL
    this.isSuccess = false;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.isSuccess = true;
    }).catch((err) => console.log(err.message));
  }

  isAlive() {
    return this.isSuccess;
  }

  async nbUsers() {
    await this.client.connect();
    const count = await this.client
      .db(this.database)
      .collection('users')
      .countDocuments();
    return count;
  }

  async nbFiles() {
    await this.client.connect();
    const count = await this.client
      .db(this.database)
      .collection('files')
      .countDocuments();
    return count;
  }
}

const dbClient = new DBClient();
export default dbClient;
