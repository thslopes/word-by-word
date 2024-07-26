//  for each 5
// 5 mistaken
// 4 mistaken 1 learning
// 3 mistaken 1 learning 1 learned
// 2 mistaken 1 learning 1 learned 1 expert
// 1 mistaken 1 learning 1 learned 1 expert 1 not learned

// status
// -1 not learned
// 1 mistaken
// 2 learning
// 3 learned
// 4 expert

class Master {
    constructor() {
        this.exerciseIndex = 0;
        this.cards = new Cards();
    }

    getWord() {
    }
}
