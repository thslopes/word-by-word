class Master {
  constructor(learnedWords, mistakenWords, wordsToLearn) {
    this.learnedWords = learnedWords;
    this.mistakenWords = mistakenWords;
    this.wordsToLearn = wordsToLearn;
    this.exerciseIndex = 0;
  }

  getWord() {
    this.toLearn = false;
    if (this.exerciseIndex === 3 && this.learnedWords.length > 0) {
      return this.learnedWords[0];
    } else if (this.exerciseIndex === 4 && this.mistakenWords.length > 0) {
      return this.mistakenWords[0];
    }
    this.toLearn = true;
    return this.wordsToLearn[0];
  }
}
