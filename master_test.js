class cardsMock {
    constructor(mockWords) {
        this.params = [];
        this.words = mockWords;
        this.callIndex = 0;
    }
    getWordsByStatus(status, skip = 0, limit = 1, sortBy = SortBy.NEXT) {
        this.params.push([status, skip, limit, sortBy]);
        return this.words[this.callIndex++];
    }
    getOneWordByStatus(status, sortBy = SortBy.NEXT) {
        this.params.push([status, sortBy]);
        return this.words[this.callIndex++];
    }
}

class deckMock {
    constructor() {
        this.word = '';
        this.otherOptions = [];
        this.optionIndex = -1;
    }
    setCards(word, otherOptions) {
        this.word = word;
        this.otherOptions = otherOptions;
    }
    assert(optionIndex) {
        this.optionIndex = optionIndex;
    }
}

tests.set("should return mistaken for index 0", () => {
    // Arrange
    let master = new Master();
    const deck = new deckMock();
    const cards = new cardsMock([['mistaken', 'one', 'two', 'three', 'four']]);
    master.deck = deck;
    master.cards = cards;
    master.exerciseIndex = 0;

    // Act
    master.loadDeck();

    // Assert
    assert([0, 0, 5, SortBy.LONGEST_STUDIED], cards.params[0], 'status');
    assert(['mistaken'], [deck.word], 'mistaken');
});

tests.set("should add learning words", () => {
    // Arrange
    let master = new Master();
    const deck = new deckMock();
    const cards = new cardsMock([['mistaken'], ['one'], ['two'], ['three'], ['four']]);
    master.deck = deck;
    master.cards = cards;
    master.exerciseIndex = 0;

    // Act
    master.loadDeck(0);

    // Assert
    assert([0, 0, 5, SortBy.LONGEST_STUDIED], cards.params[0], 'mistaken 5');
    assert([1, 0, 1, SortBy.LONGEST_STUDIED], cards.params[1], 'learning 1');
    assert([2, 0, 1, SortBy.LONGEST_STUDIED], cards.params[2], 'learned 1');
    assert([3, 0, 1, SortBy.LONGEST_STUDIED], cards.params[3], 'expert 1');
    assert([-1, 0, 1, SortBy.NEXT], cards.params[4], 'not learned 1');
    assert(['mistaken'], [deck.word], 'mistaken');
});

tests.set("should not reload words for index > 0", () => {
    // Arrange
    let master = new Master();
    const deck = new deckMock();
    const cards = new cardsMock([]);
    master.deck = deck;
    master.cards = cards;
    master.exerciseIndex = 1;
    master.words = ['mistaken', 'one', 'two', 'three', 'four'];

    // Act
    master.loadDeck();

    // Assert
    assert(0, cards.params.length, 'cards called');
    assert(['one'], [deck.word], 'one');
});