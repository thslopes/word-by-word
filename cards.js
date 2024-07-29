const SortBy = {
    NEXT: 1,
    LONGEST_STUDIED: 2,
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