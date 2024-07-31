const SortBy = {
    NEXT: 1,
    LONGEST_STUDIED: 2,
    PRACTICE_COUNT: 3,
}
class Cards {
    init() {
        if (localStorage.getItem('wordsToLearn') === null) {
            localStorage.setItem('wordsToLearn', JSON.stringify(words));
            localStorage.setItem('book', 'default');
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
            .sort(this.getSort(sortBy));
        let words = wordsToLearn.filter(word => word.status === status);
        return words.slice(skip, skip + limit);
    }

    getSort(sortBy = SortBy.NEXT) {
        switch (sortBy) {
            case SortBy.NEXT:
                return (a, b) => a.index - b.index;
            case SortBy.LONGEST_STUDIED:
                return (a, b) => new Date(a.practiceDate).getTime() - new Date(b.practiceDate).getTime();
            case SortBy.PRACTICE_COUNT:
                return (a, b) => b.practiceCount == a.practiceCount
                    ? new Date(a.practiceDate).getTime() - new Date(b.practiceDate).getTime()
                    : a.practiceCount - b.practiceCount;
        }
    }

    updateWord(word) {
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
        let index = wordsToLearn.findIndex(w => w.index === word.index);
        wordsToLearn[index] = word;
        localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));
        document.getElementById('learnedWords').innerText = `Learned words: ${wordsToLearn.filter(w => w.status === 3).length}`
            + ` / ${wordsToLearn.length} (${Math.round(wordsToLearn.filter(w => w.status === 3).length / wordsToLearn.length * 100)}%)`;
    }

    loadItWords() {
        if (localStorage.getItem('book') === 'it') {
            return;
        }
        localStorage.setItem('wordsToLearn', JSON.stringify(itWords));
        localStorage.setItem('book', 'it');
    }
}