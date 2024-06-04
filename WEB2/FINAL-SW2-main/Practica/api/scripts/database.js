require('dotenv').config();

const { MongoClient } = require('mongodb');

/**
 * Private class to implement Singleton Pattern.
 */
class PrivateDatabase {
  constructor(uri) {
    this.uri = uri
    this.client = new MongoClient(uri);
  }

  async initializeDatabase() {
    await this.client.connect(this.uri);
  }

  /**
   * Method that gets the mongo client.
   * 
   * @returns {MongoClient} mongo client to use in connections
   */
  getDatabase() {
    return this.client;
  }
};

/**
 * Class to manage database access.
 */
class Database {
  constructor() {
    throw new Error("Use Database.getInstance()");
  }

  /**
   * Method that gets the only existing instance of the database.
   * 
   * @returns {PrivateDatabase} Returns unique instance for database access.
   */
  static getInstance() {
    if(!Database.instance) {
      const uri = process.env.MONGO_URI;
      Database.instance = new PrivateDatabase(uri)
    }

    return Database.instance
  }
};

module.exports = {
  Database
}
