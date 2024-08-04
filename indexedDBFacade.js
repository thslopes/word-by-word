const Indexes = {
    LONGEST_STUDIED: "practiceDateIndex",
    PRACTICE_COUNT: "practiceCount",
}

class Database {
    constructor() {
        this.db = null;
        this.databaseName = 'words';
        this.objectStoreName = 'wordsToLearn';
    }

    async connect() {
        const self = this;
        this.db = await idb.openDB(this.databaseName, 1, {
            upgrade(db) {
                const objectStore = db.createObjectStore(self.objectStoreName, { keyPath: 'id' });
                objectStore.createIndex(Indexes.LONGEST_STUDIED, "practiceDate", { unique: false });
                objectStore.createIndex(Indexes.PRACTICE_COUNT, "practiceCount", { unique: false });
            },
        });
    }

    async dropDatabase() {
        await idb.deleteDB(this.databaseName, {
            blocked() {
                console.log('blocked');
            },
        });
    }

    async getAllFromIndex(indexName) {
        return this.db.getAllFromIndex(this.objectStoreName, indexName);
    }

    async get(key) {
        return this.db.get(this.objectStoreName, key);
    }
    async set(val) {
        return this.db.put(this.objectStoreName, val);
    }
    async del(key) {
        return this.db.delete(this.objectStoreName, key);
    }
    async clear() {
        return this.db.clear(this.objectStoreName);
    }
    async keys() {
        return this.db.getAllKeys(this.objectStoreName);
    }
}