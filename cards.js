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
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
        if (sortBy === SortBy.LONGEST_STUDIED) {
            const sorted = wordsToLearn.sort((a, b) => new Date(a.practiceDate).getTime() - new Date(b.practiceDate).getTime());
            console.log(sorted);
            return sorted
                .find(word => word.status === status);
        }
        return wordsToLearn
            .find(word => word.status === status);
    }

    getWordByStatus(status, skip = 0, limit = 1) {
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
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