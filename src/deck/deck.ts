export default class Deck {
    public currentWord: HTMLLabelElement;
    constructor() {
        this.currentWord = document.getElementById('current-word') as HTMLLabelElement;
    }
}