class cardsMock {
    constructor(mockWords) {
        this.params = [];
        this.words = mockWords;
        this.callIndex = 0;
        this.updatedWord = {};
    }
    getWordsByStatus(status, skip = 0, limit = 1, sortBy = SortBy.NEXT) {
        this.params.push([status, skip, limit, sortBy]);
        const returnValue = this.words[this.callIndex++]
        return new Promise((resolve) => resolve(returnValue));
    }
    updateWord(word) {
        this.updatedWord = word;
        return new Promise((resolve) => resolve());
    }
    loadItWords() {
        this.loadItWordsCalled = true;
        return new Promise((resolve) => resolve());
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

tests.set("should return mistaken for index 0", async () => {
    // Arrange
    let master = new Master();
    const deck = new deckMock();
    const cards = new cardsMock([
        [{ word: 'mistaken', translation: "mistaken" }, { word: 'one', translation: "one" }, { word: 'two', translation: "two" }, { word: 'three', translation: "three" }, { word: 'four', translation: "four" }],
        [{ word: 'mistaken', translation: "mistaken" }, { word: 'one', translation: "one" }, { word: 'two', translation: "two" }, { word: 'three', translation: "three" }, { word: 'four', translation: "four" }],
        [{ word: 'mistaken', translation: "mistaken" }, { word: 'one', translation: "one" }, { word: 'two', translation: "two" }, { word: 'three', translation: "three" }, { word: 'four', translation: "four" }],
        [{ word: 'mistaken', translation: "mistaken" }, { word: 'one', translation: "one" }, { word: 'two', translation: "two" }, { word: 'three', translation: "three" }, { word: 'four', translation: "four" }],
        [{ word: 'mistaken', translation: "mistaken" }, { word: 'one', translation: "one" }, { word: 'two', translation: "two" }, { word: 'three', translation: "three" }, { word: 'four', translation: "four" }],
        [{ word: 'mistaken', translation: "mistaken" }, { word: 'one', translation: "one" }, { word: 'two', translation: "two" }, { word: 'three', translation: "three" }, { word: 'four', translation: "four" }],
    ]);
    master.deck = deck;
    master.cards = cards;
    master.exerciseIndex = 10;

    // Act
    await master.loadDeck();

    // Assert
    assert([0, 0, 10, SortBy.LONGEST_STUDIED], cards.params[0], 'status');
    assert([{ word: 'mistaken', translation: "mistaken" }], [deck.word], 'mistaken');
    assert(0, master.exerciseIndex, 'reset index');
});

tests.set("should add learning words", async () => {
    // Arrange
    let master = new Master();
    const deck = new deckMock();
    const cards = new cardsMock([
        [{ word: 'mistaken', translation: "mistaken" }, { word: 'one', translation: "one" }, { word: 'two', translation: "two" }, { word: 'three', translation: "three" }, { word: 'four', translation: "four" }],
        [],[],[],[],[],[]]);
    master.deck = deck;
    master.cards = cards;
    master.exerciseIndex = 0;

    // Act
    await master.loadDeck(0);

    // Assert
    assert([WordStatus.MISTAKEN, 0, 10, SortBy.LONGEST_STUDIED], cards.params[0], 'mistaken 5');
    assert([WordStatus.LEARNING, 0, 3, SortBy.LONGEST_STUDIED], cards.params[1], 'learning 1');
    assert([WordStatus.LEARNED, 0, 3, SortBy.LONGEST_STUDIED], cards.params[2], 'learned 1');
    assert([WordStatus.EXPERT, 0, 4, SortBy.PRACTICE_COUNT], cards.params[3], 'expert 1');
    assert([WordStatus.NOT_LEARNED, 0, 2, SortBy.NEXT], cards.params[4], 'not learned 1');
    assert([WordStatus.EXPERT, 4, 5, SortBy.PRACTICE_COUNT], cards.params[5], 'expert 2');
    assert([{ word: 'mistaken', translation: "mistaken" }], [deck.word], 'mistaken');
});

tests.set("should not reload words for index > 0", async () => {
    // Arrange
    let master = new Master();
    const deck = new deckMock();
    const cards = new cardsMock([]);
    master.deck = deck;
    master.cards = cards;
    master.exerciseIndex = 1;
    master.words = [{ word: 'mistaken', translation: "mistaken" }, { word: 'one', translation: "one" }, { word: 'two', translation: "two" }, { word: 'three', translation: "three" }, { word: 'four', translation: "four" }];

    // Act
    await master.loadDeck();

    // Assert
    assert(0, cards.params.length, 'cards called');
    assert([{ word: 'one', translation: "one" }], [deck.word], 'one');
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
    { currentStatus: -1, isRight: true, expectedStatus: 1, practiceCount: 0 },
    { currentStatus: 1, isRight: true, expectedStatus: 2, practiceCount: 0 },
    { currentStatus: 2, isRight: true, expectedStatus: 3, practiceCount: 1 },
    { currentStatus: 3, isRight: true, expectedStatus: 3, practiceCount: 2, actualPracticeCount: 1 },
    { currentStatus: -1, isRight: false, expectedStatus: 0, practiceCount: 0 },
    { currentStatus: 1, isRight: false, expectedStatus: 0, practiceCount: 0 },
    { currentStatus: 2, isRight: false, expectedStatus: 0, practiceCount: 0 },
    { currentStatus: 3, isRight: false, expectedStatus: 0, practiceCount: 0 },
]) {
    tests.set(`should save ${test.expectedStatus} on onAssert ${test.isRight} for ${test.currentStatus}`, async () => {
        // Arrange
        let master = new Master();
        const cards = new cardsMock([]);
        master.cards = cards;
        master.exerciseIndex = 0;
        const mockWord = { word: 'mistaken', status: test.currentStatus };
        if (test.actualPracticeCount) {
            mockWord.practiceCount = test.actualPracticeCount;
        }
        master.words = [mockWord];
        master.getNow = () => new Date('2020-01-01');
        const expectedWord = {
            word: 'mistaken',
            status: test.expectedStatus,
            practiceDate: new Date('2020-01-01'),
            practiceCount: test.practiceCount,
        };
        master.loadDeck = () => loadDeckCalled = true;

        // Act
        await master.onAssert(test.isRight);

        // Assert
        assert(expectedWord, cards.updatedWord, 'status');
        assert(1, master.exerciseIndex, 'index');
    });
}

tests.set("should load it words", async () => {
    // Arrange
    let master = new Master();
    master.exerciseIndex = 2;
    let loadDeckCalled = false;
    master.loadDeck = () => loadDeckCalled = true;
    const cards = new cardsMock([]);
    master.cards = cards;

    // Act
    await master.loadItWords();

    // Assert
    assert(true, cards.loadItWordsCalled, 'it words');
    assert(0, master.exerciseIndex, 'index');
    assert(true, loadDeckCalled, 'load deck');
});

tests.set("should update word with status WordStatus.REMOVED", async () => {
    // Arrange
    let master = new Master();
    const cards = new cardsMock([]);
    master.cards = cards;
    master.exerciseIndex = 0;
    master.words = [{ word: 'mistaken', status: WordStatus.NOT_LEARNED }];
    let called = false;
    master.loadDeck = () => called = true;
    master.deck.validateRemove = () => true;

    // Act
    await master.removeWord();

    // Assert
    assert(0, master.exerciseIndex, 'index');
    assert(true, called, 'load deck');
    assert(WordStatus.REMOVED, cards.updatedWord.status, 'status');
});

tests.set("should not update word when validateRemove return false", async () => {
    // Arrange
    let master = new Master();
    let updateCalled = false;
    master.cards.updateWord = () => { updateCalled = true; };
    let called = false;
    master.loadDeck = () => called = true;
    master.deck.validateRemove = () => false;

    // Act
    await master.removeWord();

    // Assert
    assert(false, called, 'load deck');
    assert(false, updateCalled, 'update word');
});