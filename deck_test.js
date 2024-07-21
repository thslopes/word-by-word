const currentWord = { "word": "the", "translation": "o" };
const otherWords = [
    { "word": "a", "translation": "um" },
    { "word": "is", "translation": "é" },
    { "word": "apple", "translation": "maçã" }
]

tests.set("should set current word", () => {
    deck = new Deck();
    deck.setCards(currentWord, [{}, {}, {}]);
    const got = deck.currentWord.textContent
    assert(currentWord.word, got, 'should set current word');
});

tests.set("should set one option as right answer", () => {
    deck = new Deck();
    deck.setCards(currentWord, [{}, {}, {}]);
    const got = deck.options[deck.rightAnswerIndex].textContent;
    assert(currentWord.translation, got, 'should set right answer');
});

tests.set("should set other options", () => {
    deck = new Deck();
    deck.setCards(currentWord, otherWords);
    const got = Array.from(deck.options).map(option => option.textContent);
    for (word of otherWords) {
        assert(true, got.includes(word.translation), 'option not found');
    }
});

tests.set("should assert right answer", () => {
    deck = new Deck();
    deck.setCards(currentWord, otherWords);
    deck.options[deck.rightAnswerIndex].click();
    assert(true, deck.options[deck.rightAnswerIndex].classList.contains('bg-success'), 'shpuld set right answer background');
});

tests.set("should assert wrong answer", () => {
    deck = new Deck();
    deck.setCards(currentWord, otherWords);
    const clickIndex = (deck.rightAnswerIndex + 1) % 3;
    deck.options[clickIndex].click();
    assert(true, deck.options[clickIndex].classList.contains('bg-danger'), 'should set wrong answer background');
});

tests.set("should clear reset deck classes on set cards", () => {
    deck = new Deck();
    deck.setCards(currentWord, otherWords);
    deck.options[deck.rightAnswerIndex].click();
    deck.setCards(currentWord, otherWords);
    const got = Array.from(deck.options).map(option => option.classList);
    for (classes of got) {
        assert(
            false,
            classes.contains('bg-success') || classes.contains('bg-danger'),
            'should clear reset deck classes on set cards');
    }
});

tests.set("should remove hidden class from element next", () => {
    deck = new Deck();
    deck.setCards(currentWord, otherWords);
    deck.options[deck.rightAnswerIndex].click();
    assert(false, deck.nextButton.hasAttribute('hidden'), 'should remove hidden class from element next');
    return;
});

tests.set("should add hidden class from element next", () => {
    deck = new Deck();
    deck.nextButton.hidden = false;
    deck.setCards(currentWord, otherWords);
    assert(true, deck.nextButton.hasAttribute('hidden'), 'should add hidden class from element next');
});