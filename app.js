let debug = false;

function debugLog(message) {
  if (debug) {
    console.log(message);
  }
}

let mistakes = false;

function getLearnedWordCount() {
  return words.filter((word) => word.status === 1).length;
}

function getRandomNotLearnedWord() {
  let availableWords = words.filter((word) => word.status === 0);

  if (!availableWords.length) {
    availableWords = words.filter((word) => word.status === -1);
    if (availableWords.length) {
      return availableWords[0];
    }
  }

  if (!availableWords.length) {
    availableWords = words.filter((word) => word.status === 1);
  }

  return getRandomWord(availableWords);
}

function getLearnedWordOrRandom() {
  let availableWords = words
    .filter((word) => word.status === 1)
    .sort((a, b) => a.practiceDate - b.practiceDate);

  if (!availableWords.length) {
    return getRandomNotLearnedWord();
  }

  if (availableWords.length < 5) {
    return availableWords[0];
  }

  return getRandomWord(availableWords.slice(0, 4));
}

function getRandomWord(availableWords, usedIndexes = []) {
  for (; ;) {
    // Randomly pick a word from the filtered list
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    if (!usedIndexes.includes(randomIndex)) {
      const word = availableWords[randomIndex];
      return word;
    }
  }
}

function setWord(word, id, currentIdx, correct = false) {
  // Set the current word to the DOM
  const wordElement = document.getElementById(id);
  wordElement.innerText = word;
  wordElement.correct = correct;
  wordElement.currentIdx = currentIdx;
}

function loadDash() {
  clearDash();
  const currentWord = loadCurrentWord();
  setCards(currentWord);
}

function setCards(currentWord) {
  let usedWords = [currentWord.index];
  if (currentWord.index >= 61) {
    usedWords = usedWords.concat(wordsIdx)
  }
  else {
    usedWords = usedWords.concat(phrasesIdx)
  }
  for (let i = 0; i < 4; i++) {
    const randomWord = getRandomWord(words, usedWords);
    setWord(randomWord.translation, `option-${i}`, currentWord.index)
    usedWords.push(randomWord.index)
  }
  const roghtWord = Math.floor(Math.random() * 4);
  setWord(currentWord.translation, `option-${roghtWord}`, currentWord.index, true)
}

function loadCurrentWord() {
  idx++;
  let currentWord = {};
  debugLog(idx, mistakes)
  if (idx % 3 === 0 || !mistakes) {
    debugLog("getRandomNotLearnedWord")
    currentWord = getRandomNotLearnedWord();
    idx = 0;
  } else {
    debugLog("getLearnedWordOrRandom")
    currentWord = getLearnedWordOrRandom();
  }
  setWord(currentWord.word, "current-word", currentWord.index);
  return currentWord;
}

function clearDash() {
  const learned = document.getElementById("learned");
  learned.innerText = `${getLearnedWordCount()} palavras aprendidas`;
  for (let elem of document.getElementsByClassName("option")) {
    elem.classList.remove("others");
    elem.classList.remove("wrong");
    elem.classList.remove("correct");
    elem.classList.add("default");
  }
  const next = document.getElementById("next");
  next.hidden = true;
}

function assert(id) {
  const next = document.getElementById("next");
  next.hidden = false;
  const wordElement = document.getElementById(id);
  let currentWord = words[wordElement.currentIdx];
  if (wordElement.correct) {
    words[currentWord.index].status = 1;
    words[currentWord.index].practiceDate = new Date();
    wordElement.classList.add("correct");
  } else {
    words[currentWord.index].status = 0;
    wordElement.classList.add("wrong");
    mistakes = true;
  }
  saveData();
  for (let elem of document.getElementsByClassName("option")) {
    if (elem.id === id || elem.correct) {
      continue;
    }
    elem.classList.add("others");
  }
}

function loadData() {
  const data = localStorage.getItem("words");
  if (data) {
    words = JSON.parse(data);
  }
}

function loadItWords() {
  words = itWords;
  saveData();
}

function saveData() {
  localStorage.setItem("words", JSON.stringify(words));
}

let idx = 0;
loadData();
loadDash();
