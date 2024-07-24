class Cards{
    init(){
        if(localStorage.getItem('wordsToLearn') === null){
            localStorage.setItem('wordsToLearn', JSON.stringify(words));
        }
    }

    getOneWordByStatus(status){
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
        return wordsToLearn.find(word => word.status === status);
    }

    getWordByStatus(status, limit = 1){
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
        let words = wordsToLearn.filter(word => word.status === status);
        return words.slice(0, limit);
    }

    updateWord(word){
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
        let index = wordsToLearn.findIndex(w => w.index === word.index);
        wordsToLearn[index] = word;
        localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));
    }
}