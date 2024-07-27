const SortBy = {
    NEXT: 1,
    LONGEST_STUDIED: 2,
}
class Cards {
    init() {
        if (localStorage.getItem('wordsToLearn') === null) {
            localStorage.setItem('wordsToLearn', JSON.stringify(words));
        }
    }

    getOneWordByStatus(status, sortBy = SortBy.NEXT) {
        return JSON.parse(localStorage.getItem('wordsToLearn'))
            .sort((a, b) => sortBy === SortBy.LONGEST_STUDIED
                ? new Date(a.practiceDate).getTime() - new Date(b.practiceDate).getTime()
                : a.index - b.index)
            .find(word => word.status === status);
    }

    getWordsByStatus(status, skip = 0, limit = 1, sortBy = SortBy.NEXT) {
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'))
            .sort((a, b) => sortBy === SortBy.LONGEST_STUDIED
                ? new Date(a.practiceDate).getTime() - new Date(b.practiceDate).getTime()
                : a.index - b.index)
        let words = wordsToLearn.filter(word => word.status === status);
        return words.slice(skip, skip + limit);
    }

    updateWord(word) {
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
        let index = wordsToLearn.findIndex(w => w.index === word.index);
        wordsToLearn[index] = word;
        localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));
    }
}