const SortBy = {
    NEXT: 1,
    LONGEST_STUDIED: 2,
    PRACTICE_COUNT: 3,
}

const Indexes = {
    LONGEST_STUDIED: "practiceDateIndex",
    PRACTICE_COUNT: "practiceCount",
}

class Cards {
    constructor() {
        this.db = null;
        this.databaseName = 'words';
        this.wordsObjectStore = 'wordsToLearn';
        this.currentBook = "currentBook";
        this.statuses = [];
    }

    async init() {
        const self = this;
        this.db = await idb.openDB(this.databaseName, 1, {
            upgrade(db) {
                const objectStore = db.createObjectStore(self.wordsObjectStore, { keyPath: 'index' });
                objectStore.createIndex(Indexes.LONGEST_STUDIED, "practiceDate", { unique: false });
                objectStore.createIndex(Indexes.PRACTICE_COUNT, "practiceCount", { unique: false });
                db.createObjectStore(self.currentBook, { keyPath: 'id' });
            },
        });

        const currentBook = await this.db.get(this.currentBook, 1);
        if (!currentBook) {
            await this.saveWordsToDatabase(words, "default");
        }

        await this.updateLearnedWordStatus();
    }

    async updateLearnedWordStatus() {
        const allWords = await this.db.getAll(this.wordsObjectStore);
        this.statuses = [];;
        for (let word of allWords) {
            this.statuses[word.index] = word.status;
        }
        for (let word of allWords) {
            if (this.statuses[word.index] !== word.status) {
                document.getElementById('learnedWords').innerText = "DEU RUIM!";
            }
        }
    }

    async getWordsByStatus(status, skip = 0, limit = 1, sortBy = SortBy.NEXT) {
        let wordsToLearn = await this.getCursor(sortBy);
        const words = [];
        for await (const cursor of wordsToLearn) {
            if (cursor.value.status === status) {
                if (skip > 0) {
                    skip--;
                    continue;
                }
                words.push(cursor.value);
                if (words.length >= limit) {
                    break;
                }
            }
        }
        return words;
    }

    getCursor(sortBy) {
        switch (sortBy) {
            case SortBy.LONGEST_STUDIED:
                return this.db.transaction(this.wordsObjectStore).store.index(Indexes.LONGEST_STUDIED);
            case SortBy.PRACTICE_COUNT:
                return this.db.transaction(this.wordsObjectStore).store.index(Indexes.PRACTICE_COUNT);
            default:
                return this.db.transaction(this.wordsObjectStore).store;
        }
    }

    async updateWord(word, reload = true) {
        await this.db.put(this.wordsObjectStore, word);
        if (!reload) {
            return;
        }
        const notStudiedCount = await this.notStudiedCount();
        const totalWordsCount = await this.db.count(this.wordsObjectStore);
        this.statuses[word.index] = word.status;
        const learnedPercent = Math.round((totalWordsCount - notStudiedCount) / totalWordsCount * 100);
        const mistakenCount = this.statuses.filter(status => status === WordStatus.MISTAKEN).length;
        const learningCount = this.statuses.filter(status => status === WordStatus.LEARNING).length;
        const learnedCount = this.statuses.filter(status => status === WordStatus.LEARNED).length;
        const expertCount = this.statuses.filter(status => status === WordStatus.EXPERT).length;
        let progressBar = "";
        for (let i = 0; i < learnedPercent; i++) {
            progressBar += "■";
        }
        for (let i = 0; i < 100 - learnedPercent; i++) {
            progressBar += "□";
        }
        document.getElementById('learnedWords').innerText =
            `Not studied words: ${notStudiedCount}` + ` / ${totalWordsCount} (${Math.round(notStudiedCount / totalWordsCount * 100)}%)\n` +
            `Mistaken: ${mistakenCount}` + ` / ${totalWordsCount} (${Math.round(mistakenCount / totalWordsCount * 100)}%)\n` +
            `Learning: ${learningCount}` + ` / ${totalWordsCount} (${Math.round(learningCount / totalWordsCount * 100)}%)\n` +
            `Learned: ${learnedCount}` + ` / ${totalWordsCount} (${Math.round(learnedCount / totalWordsCount * 100)}%)\n` +
            `Expert: ${expertCount}` + ` / ${totalWordsCount} (${Math.round(expertCount / totalWordsCount * 100)}%)\n`;
        document.getElementById('progressBar').innerText = progressBar
    }

    async notStudiedCount() {
        return await this.db.countFromIndex(this.wordsObjectStore, Indexes.LONGEST_STUDIED, "2024-01-25T00:00:00.000Z");
    }

    async loadItWords() {
        await this.saveWordsToDatabase(itWords, "it");
        this.updateLearnedWordStatus();
    }

    async saveWordsToDatabase(toadd, book) {
        await this.db.clear(this.wordsObjectStore);

        const tx = this.db.transaction(this.wordsObjectStore, 'readwrite');
        const updatedRecords = [];
        for (let word of toadd) {
            updatedRecords.push(tx.store.put(word));
        }

        updatedRecords.push(tx.done);

        await Promise.all(updatedRecords);

        await this.db.put(this.currentBook, { id: 1, book: book });
    }
}