import Deck from "./deck/deck";


const currentWord = { "word": "the", "translation": "o" };
const otherWords = [
    { "word": "a", "translation": "um" },
    { "word": "is", "translation": "é" },
    { "word": "apple", "translation": "maçã" }
];

const deck = new Deck();
deck.setCards(currentWord as any, otherWords as any);