class cardsMock {
    constructor(mockWords) {
        this.params = [];
        this.words = mockWords;
        this.callIndex = 0;
        this.updatedWord = {};
    }
    getWordsByStatus(status, skip = 0, limit = 1, sortBy = SortBy.NEXT) {
        this.params.push([status, skip, limit, sortBy]);
        return this.words[this.callIndex++];
    }
    getOneWordByStatus(status, sortBy = SortBy.NEXT) {
        this.params.push([status, sortBy]);
        return this.words[this.callIndex++];
    }
    updateWord(word) {
        this.updatedWord = word;
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

tests.set("should register for onAssert event", () => {
    // Arrange
    let master = new Master();
    master.cards = new cardsMock([]);
    master.deck = new deckMock();

    // Act

    // Assert
    assert(master, deck.onAssertListener, 'option index');
});

for (const test of [
    {currentStatus: -1, isRight: true, expectedStatus: 1},
    {currentStatus: 1, isRight: true, expectedStatus: 2},
    {currentStatus: 2, isRight: true, expectedStatus: 3},
    {currentStatus: 3, isRight: true, expectedStatus: 3},
    {currentStatus: -1, isRight: false, expectedStatus: 0},
    {currentStatus: 1, isRight: false, expectedStatus: 0},
    {currentStatus: 2, isRight: false, expectedStatus: 0},
    {currentStatus: 3, isRight: false, expectedStatus: 0},
]) {
    tests.set(`should save ${test.expectedStatus} on onAssert ${test.isRight} for ${test.currentStatus}`, () => {
        // Arrange
        let master = new Master();
        const cards = new cardsMock([]);
        master.cards = cards;
        master.exerciseIndex = 0;
        master.words = [{word: 'mistaken', status: test.currentStatus}];
        master.getNow = () => new Date('2020-01-01');

        // Act
        master.onAssert(test.isRight);

        // Assert
        assert({word: 'mistaken', status: test.expectedStatus, practiceDate: new Date('2020-01-01')}, cards.updatedWord, 'status');
    });
}