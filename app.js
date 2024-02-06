let debug = false;

function debugLog(message) {
  if (debug) {
    console.log(message);
  }
}

let mistakes = false;

function getNextWord() {
  idx = idx + 1;
  const mistakesCount = words.filter((word) => word.status === 0).length;
  if(idx < 4 && mistakesCount && idx <= mistakesCount) {
    idx = 0;
    return getLearnedWordOrRandom();
  }
  return getNextNotLearnedWord();
  
}

function getLearnedWordCount() {
  return words.filter((word) => word.status === 1).length;
}

function getNextNotLearnedWord() {
  
    let availableWords = words.filter((word) => word.status === -1);
    if (availableWords.length) {
      return availableWords[0];
    }
  
  return getRandomWord(words);
}

function getLearnedWordOrRandom() {
  let availableWords = words
    .filter((word) => word.status === 0)
    .sort((a, b) => a.practiceDate - b.practiceDate);

  if (!availableWords.length) {
    return getNextNotLearnedWord();
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
  let currentWord = getNextWord();
  setWord(currentWord.word, "current-word", currentWord.index);
  return currentWord;
}

function clearDash() {
  // const learned = document.getElementById("learned");
  // learned.innerText = `${getLearnedWordCount()} palavras aprendidas`;
  for (let elem of document.getElementsByClassName("option")) {
    elem.classList.remove("others");
    elem.classList.remove("bg-danger");
    elem.classList.remove("bg-success");
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
    if (words[currentWord.index].status == 0){
      words[currentWord.index].status = 1;
    }
    words[currentWord.index].practiceDate = new Date();
    wordElement.classList.add("bg-success");
  } else {
    words[currentWord.index].status = 0;
    wordElement.classList.add("bg-danger");
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

document.documentElement.requestFullscreen();

window.onerror = function(message, source, lineno, colno, error) {
  const formattedStack = error.stack.replace(/\n/g, '<br/>'); // Format stack trace for alert
  alert(`Error: ${message}\n\nStack trace:\n${formattedStack}`);
};
