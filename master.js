//  for each 5
// 5 mistaken
// 4 mistaken 1 learning
// 3 mistaken 1 learning 1 learned
// 2 mistaken 1 learning 1 learned 1 expert
// 1 mistaken 1 learning 1 learned 1 expert 1 not learned

// status
// -1 not learned
// 0 mistaken
// 1 learning
// 2 learned
// 3 expert


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
        this.cards = new Cards();
        this.deck = deck;
        this.words = [];
    }

    loadDeck() {
        this.loadWords();
        const otherOptions = this.getOtherWords();

        this.deck.setCards(this.words[this.exerciseIndex], otherOptions);
    }

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
        if (this.exerciseIndex > 0) {
            return;
        }
        this.words = this.cards.getWordsByStatus(WordStatus.MISTAKEN, 0, 5, SortBy.LONGEST_STUDIED);
        if (this.words.length < 5) {
            for (let status of [WordStatus.LEARNING, WordStatus.LEARNED, WordStatus.EXPERT]) {
                this.words = this.words.concat(this.cards.getWordsByStatus(status, 0, 1, SortBy.LONGEST_STUDIED));
                if (this.words.length === 5) {
                    break;
                }
            }
        }
        if (this.words.length < 5) {
            this.words = this.words.concat(this.cards.getWordsByStatus(WordStatus.NOT_LEARNED, 0, 5 - this.words.length, SortBy.NEXT));
        }
    }
}
