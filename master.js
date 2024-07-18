class Master {
  constructor(learnedWords, mistakenWords, wordsToLearn) {
    this.learnedWords = learnedWords;
    this.mistakenWords = mistakenWords;
    this.wordsToLearn = wordsToLearn;
    this.exerciseIndex = 0;
  }

  getExercise() {
    return this.wordsToLearn[this.exerciseIndex];
  }
}

function test() {
  const master = new Master(
    ['apple', 'banana'],
    ['orange'],
    ['grape', 'kiwi', 'pear']
  );

  console.log(master.getExercise()); // grape
}

test();