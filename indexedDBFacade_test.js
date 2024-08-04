tests.set('create db', async () => {
    // Arrange
    const db = new Database();

    // Act
    await db.connect();

    // Assert
    assert(true, db.db instanceof IDBDatabase, 'db.db is not an instance of IDBDatabase');
});

tests.set('set', async () => {
    // Arrange
    const db = new Database();
    await db.connect();
    let word = { id: 1, practiceDate: new Date('2024-02-01'), status: -1, practiceCount: 1 };
    await db.set(word);

    // Act
    const got = await db.get(1);

    // Assert
    assert(word, got, 'word not found');
});

tests.set('get by index', async () => {
    // Arrange
    const db = new Database();
    await db.connect();
    const practiceDateWord = { id: 2, practiceDate: new Date('2024-01-01'), status: -1, practiceCount: 1 };
    await db.set(practiceDateWord);

    const practiceCountWord = { id: 3, practiceDate: new Date('2024-02-01'), status: -1, practiceCount: 0 };
    await db.set(practiceCountWord);

    // Act
    const gotLongestStudied = await db.getAllFromIndex(Indexes.LONGEST_STUDIED);
    const gotPracticeCount = await db.getAllFromIndex(Indexes.PRACTICE_COUNT);

    // Assert
    assert(practiceDateWord, gotLongestStudied[0], 'longest studied word not found');
    assert(practiceCountWord, gotPracticeCount[0], 'practice count word not found');
});

afterTests.set('dropDb', async () => {
    // Arrange
    const db = new Database();

    // Act
    await db.dropDatabase();

    console.log('db dropped');
});