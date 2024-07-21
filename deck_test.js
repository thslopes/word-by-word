function should_set_current_word() {
    const deck = new Deck();
    const expected = { "word": "the", "translation": "o" };
    deck.setCards(expected, [{},{},{}]);
    const got = deck.currentWord.textContent
    if (got !== expected.word) {
        testFailed('should_set_current_word', expected.word, got);
        return;
    }
    console.log(' \u001b[32mPASSED\u001b[0m should_set_current_word ');
}

tests.push(should_set_current_word);

function should_set_one_option_as_right_answer() {
    const deck = new Deck();
    const expected = { "word": "the", "translation": "o" };
    deck.setCards(expected, [{},{},{}]);
    const got = deck.options[deck.rightAnswerIndex].textContent;
    if (got !== expected.translation) {
        testFailed('should_set_current_word', expected.word, got);
        return;
    }
    console.log(' \u001b[32mPASSED\u001b[0m should_set_one_option_as_right_answer ');
}

tests.push(should_set_one_option_as_right_answer);

function should_set_other_options() {    const deck = new Deck();
    const currentWord = { "word": "the", "translation": "o" };
    const otherWords = [
        { "word": "a", "translation": "um" },
        { "word": "is", "translation": "é" },
        { "word": "apple", "translation": "maçã" }
    ]
    deck.setCards(currentWord, otherWords);
    const got = Array.from(deck.options).map(option => option.textContent);
    for (word of otherWords) {
        if (!got.includes(word.translation)) {
            testFailed('should_set_other_options', word.translation, got);
            return;
        }
    }
    console.log(' \u001b[32mPASSED\u001b[0m should_set_other_options ');
}

tests.push(should_set_other_options);