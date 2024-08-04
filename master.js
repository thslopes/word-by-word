const WordStatus = {
    REMOVED: -2,
    NOT_LEARNED: -1,
    MISTAKEN: 0,
    LEARNING: 1,
    LEARNED: 2,
    EXPERT: 3,
};

const exerciseConfig = [
    { status: WordStatus.MISTAKEN, count: 10, sortBy: SortBy.LONGEST_STUDIED },
    { status: WordStatus.LEARNING, count: 3, sortBy: SortBy.LONGEST_STUDIED },
    { status: WordStatus.LEARNED, count: 2, sortBy: SortBy.LONGEST_STUDIED },
    { status: WordStatus.EXPERT, count: 1, sortBy: SortBy.PRACTICE_COUNT },
    { status: WordStatus.NOT_LEARNED, count: 10, sortBy: SortBy.NEXT },
    { status: WordStatus.EXPERT, count: 10, sortBy: SortBy.PRACTICE_COUNT },
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
        setTimeout(() => {
            this.loadDeck();
        }, 500);
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

        this.deck.setCards(this.words[this.exerciseIndex], otherOptions);
    }

    // remove the current word and randomly select 3 other words
    getOtherWords() {
        let otherWords = this.words.slice();
        otherWords.splice(this.exerciseIndex, 1);

        const otherOptions = [];
        for (let i = 0; i < 3; i++) {
            const idxToAdd = Math.floor(Math.random() * otherWords.length);
            otherOptions.push(otherWords[idxToAdd]);
            otherWords.splice(idxToAdd, 1);
        }
        return otherOptions;
    }

    async loadWords() {
        // only reload words if exerciseIndex is 0
        this.exerciseIndex = this.exerciseIndex % 10;
        if (this.exerciseIndex > 0) {
            return;
        }
        this.words = [];

        for (let config of exerciseConfig) {
            const words = await this.cards.getWordsByStatus(
                config.status,
                config.count + this.words.length > 10 ? 10 - this.words.length : config.count,
                config.sortBy);

            this.words = this.words.concat(words);
            if (this.words.length >= 10) {
                break;
            }
        }

        // if still less than 5, get not learned words
        if (this.words.length < 10) {
            this.words = this.words.concat(await this.cards.getWordsByStatus(WordStatus.NOT_LEARNED, 0, 10 - this.words.length, SortBy.NEXT));
        }
    }

    async loadItWords() {
        await this.cards.loadItWords();
        this.exerciseIndex = 0;
        this.loadDeck();
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
        this.exerciseIndex++;
        this.loadDeck();
    }
}
