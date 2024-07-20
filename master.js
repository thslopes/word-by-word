class Master {
  constructor(learnedWords, mistakenWords, wordsToLearn) {
    this.learnedWords = learnedWords;
    this.mistakenWords = mistakenWords;
    this.wordsToLearn = wordsToLearn;
    this.exerciseIndex = 0;
  }

  getWord() {
    this.toLearn = false;
    if (this.exerciseIndex === 3 && this.learnedWords.length > 0) {
      return this.learnedWords[0];
    } else if (this.exerciseIndex === 4 && this.mistakenWords.length > 0) {
      return this.mistakenWords[0];
    }
    this.toLearn = true;
    return this.wordsToLearn[0];
  }
}

function getMockedMaster() {
  return new Master(
    [{
      "word": "and", "translation": "e", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 1,
    }],
    [{
      "word": "a", "translation": "um", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 2,
    }],
    [
      {
        "word": "the", "translation": "o", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0,
      }]
  );
}

let tests = [];
function should_return_to_learn() {
  const master = getMockedMaster();

  const expected = { "word": "the", "translation": "o", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0 };
  const got = master.getWord();
  if (!deepEqual(got, expected)) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_to_learn');
    console.log(expected, got);
  }
  if (master.toLearn !== true) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_to_learn');
    console.log(`toLeanr is ${master.toLearn}`);
  }
  console.log(' \u001b[32mPASSED\u001b[0m should_return_to_learn ');
}

tests.push(should_return_to_learn);

function should_return_learned_when_index_equels_three() {
  const master = getMockedMaster();

  master.exerciseIndex = 3;

  const expected = { "word": "and", "translation": "e", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 1 };
  const got = master.getWord();
  if (!deepEqual(got, expected)) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_learned_when_index_equels_three');
    console.log(expected, got);
  }
  if (master.toLearn !== false) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_learned_when_index_equels_three');
    console.log(`toLeanr is ${master.toLearn}`);
  }
  console.log(' \u001b[32mPASSED\u001b[0m should_return_learned_when_index_equels_three ');
}

tests.push(should_return_learned_when_index_equels_three);

function should_return_mistaken_when_index_equals_four() {
  const master = getMockedMaster();

  master.exerciseIndex = 4;

  const expected = { "word": "a", "translation": "um", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 2 };
  const got = master.getWord();
  if (!deepEqual(got, expected)) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_mistaken_when_index_equals_four');
    console.log(expected, got);
  }
  if (master.toLearn !== false) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_mistaken_when_index_equals_four');
    console.log(`toLeanr is ${master.toLearn}`);
  }
  console.log(' \u001b[32mPASSED\u001b[0m should_return_mistaken_when_index_equals_four ');
}

tests.push(should_return_mistaken_when_index_equals_four);

function should_return_to_learn_when_index_equels_three_and_learned_is_empty() {
  const master = getMockedMaster();
  master.learnedWords = [];

  master.exerciseIndex = 3;

  const expected = { "word": "the", "translation": "o", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0 };
  const got = master.getWord();
  if (!deepEqual(got, expected)) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_to_learn_when_index_equels_three_and_learned_is_empty');
    console.log(expected, got);
  }
  if (master.toLearn !== true) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_to_learn_when_index_equels_three_and_learned_is_empty');
    console.log(`toLeanr is ${master.toLearn}`);
  }
  console.log(' \u001b[32mPASSED\u001b[0m should_return_to_learn_when_index_equels_three_and_learned_is_empty ');
}

tests.push(should_return_to_learn_when_index_equels_three_and_learned_is_empty);

function should_return_to_learn_when_index_equels_four_and_mistaken_is_empty() {
  const master = getMockedMaster();
  master.mistakenWords = [];

  master.exerciseIndex = 4;

  const expected = { "word": "the", "translation": "o", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": 0 };
  const got = master.getWord();
  if (!deepEqual(got, expected)) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_to_learn_when_index_equels_four_and_mistaken_is_empty');
    console.log(expected, got);
  }
  if (master.toLearn !== true) {
    console.log(' \u001b[31mFAILED\u001b[0m should_return_to_learn_when_index_equels_four_and_mistaken_is_empty');
    console.log(`toLeanr is ${master.toLearn}`);
  }
  console.log(' \u001b[32mPASSED\u001b[0m should_return_to_learn_when_index_equels_four_and_mistaken_is_empty ');
}

tests.push(should_return_to_learn_when_index_equels_four_and_mistaken_is_empty);

function runTests() {
  for (const test of tests) {
    test();
  }
}

function deepEqual(x, y) {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
    ok(x).every(key => deepEqual(x[key], y[key]))
  ) : (x === y);
}

let usp = typeof window !== 'undefined'  ? new URLSearchParams(window.location.search) : new URLSearchParams(process.argv.slice(2).join('&'));

if (usp.has('test')) {
  runTests();
}