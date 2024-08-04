class Deck {
    constructor() {
        this.currentWord = document.getElementById("current-word");
        this.options = document.getElementsByClassName("option");
        this.nextButton = document.getElementById("next-button");
        this.rightAnswerIndex = -1;
        this.onAssertListener = async () => {};
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

    async assert(optionIndex) {
        this.options[this.rightAnswerIndex].classList.add("bg-success");
        if (optionIndex === this.rightAnswerIndex) {
            await this.onAssertListener.onAssert(true);
        } else {
            this.options[optionIndex].classList.add("bg-danger");
            await this.onAssertListener.onAssert(false);
        }
        // this.nextButton.hidden = false;
    }
}