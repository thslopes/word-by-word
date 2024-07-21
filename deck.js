class Deck {
    constructor() {
        this.currentWord = document.getElementById("current-word");
        this.options = document.getElementsByClassName("option");
        this.rightAnswerIndex = -1;
    }
    setCards(word, otherOptions) {
        this.currentWord.textContent = word.word;
        this.rightAnswerIndex = Math.floor(Math.random() * this.options.length);
        this.options[this.rightAnswerIndex].textContent = word.translation;
        let i = 0;
        for(let otherWord of otherOptions) {
            if (i === this.rightAnswerIndex) {
                i++;
            }
            this.options[i].textContent = otherWord.translation;
            i++;
        }
    }
}

