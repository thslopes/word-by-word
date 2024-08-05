let testWords =
    [
        {
            "word": "the", "translation": "o", "status": 1, "practiceDate": "2024-01-26T00:00:00.000Z", "index": 0,
        },
        {
            "word": "and", "translation": "e", "status": 0, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 1,
        },
        {
            "word": "a", "translation": "um", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 2,
        },
        {
            "word": "to", "translation": "para", "status": 1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 3,
        },
        {
            "word": "of", "translation": "de", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 4,
        },
        {
            "word": "in", "translation": "em", "status": -1, "practiceDate": "2024-01-24T00:00:00.000Z", "index": 5,
        },
        {
            "word": "is", "translation": "é", "status": 3, "practiceDate": "2024-01-23T00:00:00.000Z", "index": 6, "practiceCount": 4,
        },
        {
            "word": "it", "translation": "isso", "status": 3, "practiceDate": "2024-01-22T00:00:00.000Z", "index": 7, "practiceCount": 3,
        },
        {
            "word": "you", "translation": "você", "status": 3, "practiceDate": "2024-01-21T00:00:00.000Z", "index": 8, "practiceCount": 3,
        },
        {
            "word": "that", "translation": "aquele", "status": 3, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 9,
        }
    ];

tests.set("should create local storage database test", async () => {
    // Arrange
    let cards = new Cards();
    await cards.init();
    await cards.db.clear(cards.wordsObjectStore);
    await cards.db.clear(cards.currentBook);

    // Act
    await cards.init();

    // Assert
    const got = await cards.db.getAll(cards.wordsObjectStore);
    const book = await cards.db.get(cards.currentBook, 1);
    assert(words, got, 'database not created');
    assert("default", book.book, 'book not setted');
});

tests.set("should load it words db", async () => {
    // Arrange
    itWords = testWords.slice(0, 2);
    let cards = new Cards();
    await cards.init();

    // Act
    await cards.loadItWords();

    // Assert
    const got = await cards.db.getAll(cards.wordsObjectStore);
    const book = await cards.db.get(cards.currentBook, 1);

    assert(itWords, got, 'database not created');
    assert("it", book.book, 'book not setted');
});

tests.set("should not create local storage database when it already exists test", async () => {
    // Arrange
    let cards = new Cards();
    await cards.init();
    await cards.db.clear(cards.wordsObjectStore);
    const fake = { word: 'test', translation: 'test', status: -1, practiceDate: '2024-01-25T00:00:00.000Z', index: 0 };
    await cards.db.put(cards.wordsObjectStore, fake);
    await cards.db.put(cards.currentBook, { id: 1, book: 'default' });

    // Act
    await cards.init();

    // Assert
    const got = await cards.db.getAll(cards.wordsObjectStore);
    assert([fake], got, 'database created');
});

tests.set("should get word by status and limit", async () => {
    // Arrange
    let cards = new Cards();
    await cards.init();
    await cards.db.clear(cards.wordsObjectStore);
    await cards.db.clear(cards.currentBook);
    words = testWords;
    await cards.init();

    // Act
    const got = await cards.getWordsByStatus(-1, 2);

    // Assert
    assert([words[2],words[4]], got, 'status and limit');
});

tests.set("should get word by status, limit and sort", async () => {
    // Arrange
    let cards = new Cards();
    await cards.init();
    await cards.db.clear(cards.wordsObjectStore);
    await cards.db.clear(cards.currentBook);
    words = testWords;
    await cards.init();

    // Act
    const got = await cards.getWordsByStatus(-1, 2, SortBy.LONGEST_STUDIED);

    // Assert
    assert([words[5], words[2]], got, 'status limit and sort');
});

tests.set("should sort by practiceCount desc", async () => {
    // Arrange
    let cards = new Cards();
    await cards.init();
    await cards.db.clear(cards.wordsObjectStore);
    await cards.db.clear(cards.currentBook);
    words = testWords;
    await cards.init();

    // Act
    const got = await cards.getWordsByStatus(3, 2, SortBy.PRACTICE_COUNT);

    // Assert
    assert([words[7], words[8]], got, 'practice count desc');
});

tests.set("should update word", async () => {
    // Arrange
    let cards = new Cards();
    await cards.init();
    await cards.db.clear(cards.wordsObjectStore);
    await cards.db.clear(cards.currentBook);
    await cards.init();

    // Act
    await cards.updateWord({ "word": "a", "translation": "um", "status": 1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 2 });

    // Assert
    const got = await cards.db.get(cards.wordsObjectStore, 2);
    assert(1, got.status, 'word not updated');
});

afterTests.set("clear localStorage", () => {
    localStorage.clear();
});

afterTests.set('dropDb', async () => {
    await idb.deleteDB(cards.databaseName, {
        blocked() {
            console.log('blocked');
        },
    });

    console.log('db dropped');
});