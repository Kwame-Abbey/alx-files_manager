const { MongoClient } = require('mongodb');
const mongo = require('mongodb');
const { passwdHashed } = require('./hashPassword');

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

  async createUser(email, password) {
    const hashedpasswd = passwdHashed(password);
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').insertOne({ email, password: hashedpasswd });
    return user;
  }

  async getUser(email) {
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').find({ email }).toArray();
    if (!user.length) {
      return null;
    }
    return user[0];
  }

  async getUserById(id) {
    const _id = new mongo.ObjectID(id);
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').find({ _id }).toArray();
    if (!user.length) {
      return null;
    }
    return user[0];
  }

  async userExist(email) {
    const user = await this.getUser(email);
    if (user) {
      return true;
    }
    return false;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
