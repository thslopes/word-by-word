class Deck {
    constructor() {
        this.currentWord = document.getElementById("current-word");
        this.currentWordStatus = document.getElementById("current-word-status");
        this.phrase = document.getElementById("phrase");
        this.options = document.getElementsByClassName("option");
        this.nextButton = document.getElementById("next-button");
        this.rightAnswerIndex = -1;
        this.onAssertListener = async () => { };
        this.answer = document.getElementById("answer");
        this.validateAnswerBtn = document.getElementById("validate-answer");
        this.multipleChoice = document.getElementById("multiple-choice");
        this.discursive = document.getElementById("discursive");
    }

    setCards(word, otherOptions, isDiscursive) {
        this.resetOptionsBackground();
        this.setCurrentWord(word);
        this.setOtherWords(otherOptions);
        this.nextButton.hidden = true;
        if (isDiscursive) {
            this.setChildrenHidden(this.multipleChoice);
            this.setChildrenHidden(this.discursive, false);
        } else {
            this.setChildrenHidden(this.discursive);
            this.setChildrenHidden(this.multipleChoice, false);
        }
    }

    setChildrenHidden(item, hvalue = true) {
        for (let option of item.children) {
            option.hidden = hvalue;
        }
        
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

    async validateAnswer() {
        if (this.answer.translation !== this.answer.value) {
            // set border-color red
            this.validateAnswerBtn.classList.add("bg-danger");
            await this.onAssertListener.onAssert(false);
        } else {
            this.validateAnswerBtn.classList.add("bg-success");
            await this.onAssertListener.onAssert(true);
        }
    }

    setCurrentWord(word) {
        this.currentWord.textContent = word.word
        this.currentWordStatus.textContent = this.getSymbolByStatus(word.status);
        this.phrase.textContent = word.phrase;
        this.rightAnswerIndex = Math.floor(Math.random() * this.options.length);
        this.options[this.rightAnswerIndex].textContent = word.translation;
        this.answer.translation = word.translation;
    }

    getSymbolByStatus(status) {
        switch (status) {
            case WordStatus.NOT_LEARNED:
                return "(não estudado)";
            case WordStatus.MISTAKEN:
                return "(erro)";
            case WordStatus.LEARNING:
                return "(aprendendo)";
            case WordStatus.LEARNED:
                return "(aprendido)";
            case WordStatus.EXPERT:
                return "(expert)";
            default:
                return "";
        }
    }

    resetOptionsBackground() {
        for (let option of this.options) {
            option.classList.remove("bg-success");
            option.classList.remove("bg-danger");
            option.textContent = "";
        }
        this.validateAnswerBtn.classList.remove("bg-success");
        this.validateAnswerBtn.classList.remove("bg-danger");
    }

    async assert(optionIndex) {
        this.options[this.rightAnswerIndex].classList.add("bg-success");
        if (optionIndex === this.rightAnswerIndex) {
            await this.onAssertListener.onAssert(true);
        } else {
            this.options[optionIndex].classList.add("bg-danger");
            await this.onAssertListener.onAssert(false);
        }
    }
}