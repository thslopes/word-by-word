class Deck {
    constructor() {
        this.currentWord = document.getElementById("current-word");
        this.options = document.getElementsByClassName("option");
        this.nextButton = document.getElementById("next-button");
        this.rightAnswerIndex = -1;
        this.onAssertListener = () => {};
    }
    setCards(word, otherOptions) {
        this.resetOptionsBackground();
        this.setCurrentWord(word);
        this.setOtherWords(otherOptions);
        this.nextButton.hidden = true;
    }
    setOtherWords(otherOptions) {
        let i = 0;
        for (let otherWord of otherOptions) {
            if (i === this.rightAnswerIndex) {
                i++;
            }
            this.options[i].textContent = otherWord.translation;
            i++;
        }
    }

    setCurrentWord(word) {
        this.currentWord.textContent = word.word;
        this.rightAnswerIndex = Math.floor(Math.random() * this.options.length);
        this.options[this.rightAnswerIndex].textContent = word.translation;
    }

    resetOptionsBackground() {
        for (let option of this.options) {
            option.classList.remove("bg-success");
            option.classList.remove("bg-danger");
        }
    }

    assert(optionIndex) {
        if (optionIndex === this.rightAnswerIndex) {
            this.options[this.rightAnswerIndex].classList.add("bg-success");
            this.onAssertListener.onAssert(true);
        } else {
            this.options[optionIndex].classList.add("bg-danger");
            this.onAssertListener.onAssert(false);
        }
        this.nextButton.hidden = false;
    }
}