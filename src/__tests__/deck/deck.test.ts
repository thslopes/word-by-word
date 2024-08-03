import Deck from '../../deck/deck';
jest.spyOn(document, 'getElementById').mockImplementation((elementId:string) => {
    const element = {} as HTMLElement;
    element.id = elementId;
    return element;
})
describe('Deck', () => {
    describe('constructor', () => {
        it('should create a new deck', () => {
            // Arrange
            // Act
            const deck = new Deck();

            // Assert
            expect(deck).toBeInstanceOf(Deck);
            expect(deck.currentWord.id).toBe('current-word');
        });
    });
});