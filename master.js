const WordStatus = {
    REMOVED: -2,
    NOT_LEARNED: -1,
    MISTAKEN: 0,
    LEARNING: 1,
    LEARNED: 2,
    EXPERT: 3,
};

const discursiveStatus = [WordStatus.LEARNED, WordStatus.EXPERT];

const exerciseConfig = [
    { status: WordStatus.MISTAKEN, skip: 0, count: 10, sortBy: SortBy.LONGEST_STUDIED },
    { status: WordStatus.LEARNING, skip: 0, count: 3, sortBy: SortBy.LONGEST_STUDIED },
    { status: WordStatus.LEARNED, skip: 0, count: 3, sortBy: SortBy.LONGEST_STUDIED },
    { status: WordStatus.EXPERT, skip: 0, count: 4, sortBy: SortBy.PRACTICE_COUNT },
    { status: WordStatus.NOT_LEARNED, skip: 0, count: 2, sortBy: SortBy.NEXT },
    { status: WordStatus.EXPERT, skip: 4, count: 10, sortBy: SortBy.PRACTICE_COUNT },
];

class Master {
    constructor() {
        this.exerciseIndex = 0;
        this.cards = cards;
        this.deck = deck;
        this.deck.onAssertListener = this;
        this.words = [];
    }

    async onAssert(isRight) {
        return new Promise(async (resolve) => {
            const currentWord = this.words[this.exerciseIndex];
            let status = this.getNextStatus(currentWord, isRight);
            let practiceCount = 0;
            if (status === WordStatus.EXPERT) {
                practiceCount = currentWord.practiceCount ? currentWord.practiceCount + 1 : 1;
            }
            await this.cards.updateWord({
                ...currentWord,
                status: status,
                practiceDate: this.getNow(),
                practiceCount: practiceCount,
            });
            this.exerciseIndex++;
            setTimeout(async () => {
                await this.loadDeck();
                resolve();
            }, 500);
        });
    }

    getNextStatus(word, isRight) {
        if (!isRight) {
            return WordStatus.MISTAKEN;
        }
        if (word.status === WordStatus.EXPERT) {
            return WordStatus.EXPERT;
        }
        return word.status === WordStatus.NOT_LEARNED
            ? WordStatus.LEARNING
            : word.status + 1;
    }

    async loadDeck() {
        await this.loadWords();
        const otherOptions = this.getOtherWords();

        const currentWord = this.words[this.exerciseIndex];
        const isDiscursive = discursiveStatus.includes(currentWord.status);
        this.deck.setCards(currentWord, otherOptions, isDiscursive);
    }

    // remove the current word and randomly select 3 other words
    getOtherWords() {
        let otherWords = this.words.slice();
        otherWords.splice(this.exerciseIndex, 1);

        if (otherWords.length <= 3) {
            return otherWords;
        }

        const otherOptions = [];
        for (let i = 0; otherOptions.length < 3; i++) {
            const idxToAdd = Math.floor(Math.random() * otherWords.length);
            if (otherWords[idxToAdd].translation === this.words[this.exerciseIndex].translation) {
                continue;
            }
            otherOptions.push(otherWords[idxToAdd]);
            otherWords.splice(idxToAdd, 1);
            if (i > 9) {
                break;
            }
        }
        return otherOptions;
    }

    async loadWords() {
        // only reload words if exerciseIndex is 0
        this.exerciseIndex = this.words.length ? this.exerciseIndex % this.words.length : 0;
        if (this.exerciseIndex > 0) {
            return;
        }
        this.words = [];

        for (let config of exerciseConfig) {
            const words = await this.cards.getWordsByStatus(
                config.status,
                config.skip,
                config.count + this.words.length > 10 ? 10 - this.words.length : config.count,
                config.sortBy);

            this.words = this.words.concat(words);
            if (this.words.length >= 10) {
                break;
            }
        }
    }

    async loadItWords() {
        await this.cards.loadItWords();
        this.exerciseIndex = 0;
        await this.loadDeck();
    }

    // just for tests
    getNow() {
        return new Date().toISOString();
    }

    async removeWord() {
        await this.cards.updateWord({
            ...this.words[this.exerciseIndex],
            status: WordStatus.REMOVED,
            practiceDate: null,
            practiceCount: 0,
        });
        this.words.splice(this.exerciseIndex, 1);
        const notLearnedCount = this.words.filter(word => word.status === WordStatus.NOT_LEARNED).length;
        this.words = this.words.concat(await this.cards.getWordsByStatus(WordStatus.NOT_LEARNED, notLearnedCount, 1, SortBy.NEXT));
        await this.loadDeck();
    }

    async editWord(translation) {
        this.words[this.exerciseIndex].translation = translation;
        await this.onAssert(true);
    }
}
