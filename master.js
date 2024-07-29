const WordStatus = {
    NOT_LEARNED: -1,
    MISTAKEN: 0,
    LEARNING: 1,
    LEARNED: 2,
    EXPERT: 3,
};

class Master {
    constructor() {
        this.exerciseIndex = 0;
        this.cards = cards;
        this.deck = deck;
        this.deck.onAssertListener = this;
        this.words = [];
    }

    onAssert(isRight) {
        let status = this.getNextStatus(this.words[this.exerciseIndex], isRight);
        this.cards.updateWord({
            ...this.words[this.exerciseIndex],
            status: status,
            practiceDate: this.getNow(),
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

    loadDeck() {
        this.loadWords();
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

    loadWords() {
        // only reload words if exerciseIndex is 0
        if (this.exerciseIndex > 0) {
            return;
        }
        // try to get only mistaken words
        this.words = this.cards.getWordsByStatus(WordStatus.MISTAKEN, 0, 5, SortBy.LONGEST_STUDIED);

        //  for each 5
        // 5 mistaken
        // 4 mistaken 1 learning
        // 3 mistaken 1 learning 1 learned
        // 2 mistaken 1 learning 1 learned 1 expert
        // 1 mistaken 1 learning 1 learned 1 expert 1 not learned
        if (this.words.length < 5) {
            for (let status of [WordStatus.LEARNING, WordStatus.LEARNED, WordStatus.EXPERT]) {
                this.words = this.words.concat(this.cards.getWordsByStatus(status, 0, 1, SortBy.LONGEST_STUDIED));
                if (this.words.length === 5) {
                    break;
                }
            }
        }

        // if still less than 5, get not learned words
        if (this.words.length < 5) {
            this.words = this.words.concat(this.cards.getWordsByStatus(WordStatus.NOT_LEARNED, 0, 5 - this.words.length, SortBy.NEXT));
        }
    }

    // just for tests
    getNow() {
        return new Date().toISOString();
    }
}
