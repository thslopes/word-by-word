import { Card, WordStatus } from '../model/card'

interface assertListener {
    onAssert: (isRight: boolean) => void;
}

export default class Deck {
    private currentWord: HTMLLabelElement;
    private options: Array<HTMLAnchorElement>;
    private nextButton: HTMLAnchorElement;
    private rightAnswerIndex: number;
    private onAssertListeners: assertListener[];
    constructor() {
        this.currentWord = document.getElementById('current-word') as HTMLLabelElement;
        this.options = Array.from(document.getElementsByClassName('option') as HTMLCollectionOf<HTMLAnchorElement>);
        this.nextButton = document.getElementById('next-button') as HTMLAnchorElement;
        this.rightAnswerIndex = -1;
        this.onAssertListeners = [];
        this.options.forEach((option, index) => this.bindAssert(index));
    }

    public setCards(currentWord: Card, otherWords: Array<Card>): void {
        this.setCurrentWord(currentWord);
        this.setOtherWords(otherWords);
        this.resetOptionsBackground();
    }

    public assert(optionIndex: number) {
        this.options[this.rightAnswerIndex].classList.add("bg-success");
        if (optionIndex === this.rightAnswerIndex) {
            for(let listener of this.onAssertListeners) {
                listener.onAssert(true);
            }
        } else {
            this.options[optionIndex].classList.add("bg-danger");
            for(let listener of this.onAssertListeners) {
                listener.onAssert(false);
            }
        }
    }

    private bindAssert(optionIndex: number) {
        this.options[optionIndex].onclick = this.assert.bind(this, optionIndex);
    }

    private setCurrentWord(word: Card) {
        this.currentWord.textContent = word.word;
        this.rightAnswerIndex = Math.floor(Math.random() * this.options.length);
        this.options[this.rightAnswerIndex].textContent = word.translation;
    }

    private setOtherWords(otherOptions: Array<Card>) {
        let i = 0;
        for (let otherWord of otherOptions) {
            if (i === this.rightAnswerIndex) {
                i++;
            }
            this.options[i].textContent = otherWord.translation;
            i++;
        }
    }

    private resetOptionsBackground() {
        for (let option of this.options) {
            option.classList.remove("bg-success");
            option.classList.remove("bg-danger");
        }
    }



    public fakeInit() {
        this.currentWord.innerText = 'fake word';
        this.options.forEach((option, a) => option.innerText = `fake option${a}`);
    }
}