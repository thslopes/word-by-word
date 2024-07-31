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
                    : (a.practiceCount ?? 0) - (b.practiceCount ?? 0);
        }
    }

    updateWord(word) {
        let wordsToLearn = JSON.parse(localStorage.getItem('wordsToLearn'));
        let index = wordsToLearn.findIndex(w => w.index === word.index);
        wordsToLearn[index] = word;
        localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));
        const expertWords = wordsToLearn.filter(w => w.status === 3).length;
        const learnedWordsCount = wordsToLearn.filter(w => w.status === 2).length;
        const learningWordsCount = wordsToLearn.filter(w => w.status === 1).length;
        const mistakenWordsCount = wordsToLearn.filter(w => w.status === 0).length;
        const notLearnedCount = wordsToLearn.filter(w => w.status === -1).length;
        const removedWordsCount = wordsToLearn.filter(w => w.status === -2).length;
        document.getElementById('learnedWords').innerText =
            `Expert words: ${expertWords}` + ` / ${notLearnedCount} (${Math.round(expertWords / notLearnedCount * 100)}%)\n` +
            'Learned words: ' + `${learnedWordsCount}` + ` / ${notLearnedCount} (${Math.round(learnedWordsCount / notLearnedCount * 100)}%)\n` +
            'Learning words: ' + `${learningWordsCount}` + ` / ${notLearnedCount} (${Math.round(learningWordsCount / notLearnedCount * 100)}%)\n` +
            'Mistaken words: ' + `${mistakenWordsCount}` + ` / ${notLearnedCount} (${Math.round(mistakenWordsCount / notLearnedCount * 100)}%)\n` +
            'Removed words: ' + `${removedWordsCount}` + ` / ${wordsToLearn.length} (${Math.round(removedWordsCount / wordsToLearn.length * 100)}%)\n`;
    }

    loadItWords() {
        if (localStorage.getItem('book') === 'it') {
            return;
        }
        localStorage.setItem('wordsToLearn', JSON.stringify(itWords));
        localStorage.setItem('book', 'it');
    }
}