const { Database } = require("../scripts/database.js");

describe("Database", () => {
  beforeAll(() => {
    // Modify process.env.MONGO_URI to point to test database
    process.env.MONGO_URI = global.__MONGO_URI__;
  });

  describe("creation", () => {
    it("can not be initialized using constructor", () => {
      expect(() => { new Database() }).toThrow(Error("Use Database.getInstance()"))
    });

    it("is singleton", () => {
      const db1 = Database.getInstance();
      const db2 = Database.getInstance();
      expect(db1).toBe(db2);
    });
  });
});
