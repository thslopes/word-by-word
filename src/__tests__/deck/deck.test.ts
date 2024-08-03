import { on } from 'events';
import Deck from '../../deck/deck';
jest.spyOn(document, 'getElementById').mockImplementation((elementId: string) => {
    const element = {} as HTMLElement;
    element.id = elementId;
    return element;
})

class DTL {
    public classes: string[] = [];
    public add(className: string) {
        this.classes.push(className);
    }
    public remove(className: string) {
        this.classes = this.classes.filter(c => c !== className);
    }
    public includes(className: string) {
        return this.classes.includes(className);
    }
    public contains(className: string) {
        return this.includes(className);
    }
}

const htmlOptions = [
    { classList: new DTL(), onclick: () => { } },
    { classList: new DTL(), onclick: () => { } },
    { classList: new DTL(), onclick: () => { } },
    { classList: new DTL(), onclick: () => { } },];
jest.spyOn(document, 'getElementsByClassName').mockImplementation((className: string) => {
    const elements = htmlOptions.map(option => {
        const element = option as any;
        element.className = className;
        return element;
    });
    return elements as any;
})

const currentWord = { "word": "the", "translation": "o" };
const otherWords = [
    { "word": "a", "translation": "um" },
    { "word": "is", "translation": "é" },
    { "word": "apple", "translation": "maçã" }
];

describe('Deck', () => {
    describe('constructor', () => {
        it('should create a new deck', () => {
            // Arrange
            // Act
            const deck = new Deck();

            // Assert
            expect(deck).toBeInstanceOf(Deck);
            expect((deck as any).currentWord.id).toBe('current-word');
            expect(((deck as any).options[0] as any).className).toBe('option');
            expect((deck as any).nextButton.id).toBe('next-button');
            expect((deck as any).rightAnswerIndex).toBe(-1);
            expect((deck as any).onAssertListeners).toEqual([]);
        });
    });
    describe('setCards', () => {
        it('should set current word', () => {
            // Arrange
            const deck = new Deck();

            // Act
            deck.setCards(currentWord as any, otherWords as any);

            // Assert
            expect((deck as any).currentWord.textContent).toBe(currentWord.word);
            expect((deck as any).options[(deck as any).rightAnswerIndex].textContent).toBe(currentWord.translation);
        });
        it('should set other options', () => {
            // Arrange
            const deck = new Deck();

            // Act
            deck.setCards(currentWord as any, otherWords as any);

            // Assert
            const got = Array.from(((deck as any).options as any[])).map(option => option.textContent);
            for (let word of otherWords) {
                expect(got.includes(word.translation)).toBeTruthy();
            }
        });
        it('should clear reset deck classes', () => {
            // Arrange
            const deck = new Deck();
            (deck as any).options[0].classList.add('bg-success');
            (deck as any).options[1].classList.add('bg-danger');

            // Act
            deck.setCards(currentWord as any, otherWords as any);

            // Assert
            expect((deck as any).options[0].classList.classes).toEqual([]);
            expect((deck as any).options[1].classList.classes).toEqual([]);
        });
    });
    describe('assert', () => {
        it('should assert right answer', () => {
            // Arrange
            const deck = new Deck();
            const listener = { onAssert: jest.fn() };
            (deck as any).onAssertListeners.push(listener);
            deck.setCards(currentWord as any, otherWords as any);

            // Act
            deck.assert((deck as any).rightAnswerIndex);

            // Assert
            expect(listener.onAssert).toHaveBeenCalledWith(true);
            expect((deck as any).options[(deck as any).rightAnswerIndex].classList.classes).toEqual(['bg-success']);
        });
        it('should assert wrong answer', () => {
            // Arrange
            const deck = new Deck();
            const listener = { onAssert: jest.fn() };
            (deck as any).onAssertListeners.push(listener);
            deck.setCards(currentWord as any, otherWords as any);
            let answer = ((deck as any).rightAnswerIndex + 1) % 4;

            // Act
            deck.assert(answer);

            // Assert
            expect(listener.onAssert).toHaveBeenCalledWith(false);
            expect((deck as any).options[(deck as any).rightAnswerIndex].classList.classes).toEqual(['bg-success']);
            expect((deck as any).options[answer].classList.classes).toEqual(['bg-danger']);
        });
    });
});