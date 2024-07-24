words =
    [
        {
            "word": "the", "translation": "o", "status": 1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0,
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
            "word": "of", "translation": "de", "status": 1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 4,
        },
        {
            "word": "in", "translation": "em", "status": 1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 5,
        }
    ];

tests.set("should create local storage database test", () => {
    // Arrange
    localStorage.clear();
    let cards = new Cards();

    // Act
    cards.init();

    // Assert
    const got = localStorage.getItem('wordsToLearn')
    assert(JSON.stringify(words), got, 'database not created');
});

tests.set("should not create local storage database when it already exists test", () => {
    // Arrange
    const fake = [{ word: 'test', translation: 'test', status: -1, practiceDate: '2024-01-25T00:00:00.000Z', index: 0 }];
    localStorage.setItem('wordsToLearn', JSON.stringify(fake));
    let cards = new Cards();

    // Act
    cards.init();

    // Assert
    const got = localStorage.getItem('wordsToLearn')
    assert(JSON.stringify(fake), got, 'database created');
});

tests.set("should get word by status", () => {
    // Arrange
    let cards = new Cards();
    localStorage.setItem('wordsToLearn', JSON.stringify(words));

    // Act
    const got = cards.getOneWordByStatus(-1);

    // Assert
    assert(JSON.stringify(words[2]), JSON.stringify(got), 'word not found');
});

tests.set("should get word by status and limit", () => {
    // Arrange
    let cards = new Cards();
    localStorage.setItem('wordsToLearn', JSON.stringify(words));

    // Act
    const got = cards.getWordByStatus(-1, 2);

    // Assert
    assert(JSON.stringify(words.slice(2, 3)), JSON.stringify(got), 'word not found');
});

tests.set("should update word", () => {
    // Arrange
    let cards = new Cards();
    localStorage.setItem('wordsToLearn', JSON.stringify(words));

    // Act
    cards.updateWord({"word": "a", "translation": "um", "status": 1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 2});

    // Assert
    const got = JSON.parse(localStorage.getItem('wordsToLearn')).find(word => word.word === 'a');
    assert(1, got.status, 'word not updated');
});
