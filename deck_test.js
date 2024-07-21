let deck = {};
function should_set_current_word() {
    deck = new Deck();
    const expected = { "word": "the", "translation": "o" };
    deck.setCards(expected, [{}, {}, {}]);
    const got = deck.currentWord.textContent
    if (got !== expected.word) {
        testFailed('should_set_current_word', expected.word, got);
        return;
    }
    console.log(' \u001b[32mPASSED\u001b[0m should_set_current_word ');
}

tests.push(should_set_current_word);

function should_set_one_option_as_right_answer() {
    deck = new Deck();
    const expected = { "word": "the", "translation": "o" };
    deck.setCards(expected, [{}, {}, {}]);
    const got = deck.options[deck.rightAnswerIndex].textContent;
    if (got !== expected.translation) {
        testFailed('should_set_current_word', expected.word, got);
        return;
    }
    console.log(' \u001b[32mPASSED\u001b[0m should_set_one_option_as_right_answer ');
}

tests.push(should_set_one_option_as_right_answer);

function should_set_other_options() {
    deck = new Deck();
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

function should_assert_right_answer() {
    deck = new Deck();
    const currentWord = { "word": "the", "translation": "o" };
    const otherWords = [
        { "word": "a", "translation": "um" },
        { "word": "is", "translation": "é" },
        { "word": "apple", "translation": "maçã" }
    ]
    deck.setCards(currentWord, otherWords);
    deck.options[deck.rightAnswerIndex].click();
    if (!deck.options[deck.rightAnswerIndex].classList.contains('bg-success')) {
        testFailed('should_have_correct_answer_class', 'bg-success', 'Class not found');
        return;
    }
    console.log(' \u001b[32mPASSED\u001b[0m should_assert_right_answer ');
}

tests.push(should_assert_right_answer);

function should_not_assert_wrong_answer() {
    deck = new Deck();
    const currentWord = { "word": "the", "translation": "o" };
    const otherWords = [
        { "word": "a", "translation": "um" },
        { "word": "is", "translation": "é" },
        { "word": "apple", "translation": "maçã" }
    ]
    deck.setCards(currentWord, otherWords);
    const clickIndex = (deck.rightAnswerIndex + 1) % 3;
    console.log(clickIndex);
    deck.options[clickIndex].click();
    if (!deck.options[clickIndex].classList.contains('bg-danger')) {
        testFailed('should_not_assert_wrong_answer', 'bg-danger', 'Class not found');
        return;
    }
    console.log(' \u001b[32mPASSED\u001b[0m should_not_assert_wrong_answer ');
}

tests.push(should_not_assert_wrong_answer);