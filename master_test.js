function getMockedMaster() {
    return new Master(
        [{
            "word": "and", "translation": "e", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 1,
        }],
        [{
            "word": "a", "translation": "um", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 2,
        }],
        [
            {
                "word": "the", "translation": "o", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0,
            }]
    );
}

tests.set("should return to learn", () => {
    const master = getMockedMaster();

    const expected = { "word": "the", "translation": "o", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0 };
    const got = master.getWord();
    assert(expected, got, 'should return to learn');
    assert(true, master.toLearn, 'should set to learn as true');
});

tests.set("should return learned when index equels three", () => {
    const master = getMockedMaster();

    master.exerciseIndex = 3;

    const expected = { "word": "and", "translation": "e", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 1 };
    const got = master.getWord();
    assert(expected, got, 'should return learned when index equels three');
    assert(false, master.toLearn, 'should set to learn as false');
});

tests.set("should return mistaken when index equals four", () => {
    const master = getMockedMaster();

    master.exerciseIndex = 4;

    const expected = { "word": "a", "translation": "um", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 2 };
    const got = master.getWord();
    assert(expected, got, 'should return mistaken when index equals four');
    assert(false, master.toLearn, 'should set to learn as false');
});

tests.set("should return to learn when index equels three and learned is empty", () => {
    const master = getMockedMaster();
    master.learnedWords = [];

    master.exerciseIndex = 3;

    const expected = { "word": "the", "translation": "o", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0 };
    const got = master.getWord();
    assert(expected, got, 'should return to learn when index equels three and learned is empty');
    assert(true, master.toLearn, 'should set to learn as true');
});

tests.set("should return to learn when index equels four and mistaken is empty", () => {
    const master = getMockedMaster();
    master.mistakenWords = [];

    master.exerciseIndex = 4;

    const expected = { "word": "the", "translation": "o", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0 };
    const got = master.getWord();
    assert(expected, got, 'should return to learn when index equels four and mistaken is empty');
    assert(true, master.toLearn, 'should set to learn as true');
});