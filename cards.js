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
        if (currentBook) {
            return;
        }

        await this.saveWordsToDatabase(words, "default");
    }

    async getWordsByStatus(status, limit = 1, sortBy = SortBy.NEXT) {
        let wordsToLearn = await this.getCursor(sortBy);
        const words = [];
        for await (const cursor of wordsToLearn) {
            if (cursor.value.status === status) {
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

    async updateWord(word) {
        await this.db.put(this.wordsObjectStore, word);
        // let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
        // let index = wordsToLearn.findIndex(w => w.index === word.index);
        // wordsToLearn[index] = word;
        // localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));
        // const expertWords = wordsToLearn.filter(w => w.status === 3).length;
        // const learnedWordsCount = wordsToLearn.filter(w => w.status === 2).length;
        // const learningWordsCount = wordsToLearn.filter(w => w.status === 1).length;
        // const mistakenWordsCount = wordsToLearn.filter(w => w.status === 0).length;
        // const notLearnedCount = wordsToLearn.filter(w => w.status === -1).length;
        // const removedWordsCount = wordsToLearn.filter(w => w.status === -2).length;
        // document.getElementById('learnedWords').innerText =
        //     `Expert words: ${expertWords}` + ` / ${notLearnedCount} (${Math.round(expertWords / notLearnedCount * 100)}%)\n` +
        //     'Learned words: ' + `${learnedWordsCount}` + ` / ${notLearnedCount} (${Math.round(learnedWordsCount / notLearnedCount * 100)}%)\n` +
        //     'Learning words: ' + `${learningWordsCount}` + ` / ${notLearnedCount} (${Math.round(learningWordsCount / notLearnedCount * 100)}%)\n` +
        //     'Mistaken words: ' + `${mistakenWordsCount}` + ` / ${notLearnedCount} (${Math.round(mistakenWordsCount / notLearnedCount * 100)}%)\n` +
        //     'Removed words: ' + `${removedWordsCount}` + ` / ${wordsToLearn.length} (${Math.round(removedWordsCount / wordsToLearn.length * 100)}%)\n`;
    }

    async loadItWords() {
        await this.saveWordsToDatabase(itWords, "it");
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