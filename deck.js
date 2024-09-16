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
        this.answer.value = "";
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
        if (this.checkTranslation(this.answer.translation, this.answer.value)) {
            this.validateAnswerBtn.classList.add("bg-success");
            await this.onAssertListener.onAssert(true);
        } else {
            this.validateAnswerBtn.classList.add("bg-danger");
            await this.onAssertListener.onAssert(false);
        }
    }

    checkTranslation(expected, answer) {
        if (expected.indexOf("/") === -1) {
            return this.compareWordsIgnoreCaseTrim(expected, answer);
        }
        let words = expected.split("/");
        for (let word of words) {
            if (this.compareWordsIgnoreCaseTrim(word, answer)) {
                return true;
            }
        }
        return false;
    }

    compareWordsIgnoreCaseTrim(word1, word2) {
        return word1.trim().toLowerCase() === word2.trim().toLowerCase();
    }

    setCurrentWord(word) {
        this.currentWord.textContent = word.word
        this.currentWordStatus.textContent = this.getSymbolByStatus(word.status);
        this.phrase.textContent = this.resumePhrase(word);
        this.rightAnswerIndex = Math.floor(Math.random() * this.options.length);
        this.options[this.rightAnswerIndex].textContent = word.translation;
        this.answer.translation = word.translation;
    }

    resumePhrase(word) {
        if (word.phrase === undefined) {
            return "";
        }
        const phraseMargin = 40;
        let wordIndex = this.getWordIndexByRegexCaseInsensitive(word.word, word.phrase);
        let phrase = word.phrase;
        console.log(phrase);
        console.log(phrase.length);
        if (wordIndex > phraseMargin) {
            phrase = "..." + phrase.substring(wordIndex - phraseMargin);
            wordIndex = phraseMargin;
        }
        let wordLength = word.word.length;
        let wordEndIndex = wordIndex + wordLength;
        if (wordEndIndex < phrase.length - phraseMargin) {
            phrase = phrase.substring(0, wordEndIndex + phraseMargin) + "...";
        }
        return phrase;
    }

    getWordIndexByRegexCaseInsensitive(word, phrase) {
        let regex = new RegExp(`\\b${word}\\b`, "i");
        return phrase.search(regex);
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