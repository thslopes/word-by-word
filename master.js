//  for each 5
// 1 of each status

// status
// -1 not learned
// 1 mistaken
// 2 learning
// 3 learned
// 4 expert

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
