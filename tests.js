let failed = 0;
let failedTests = [];

function runTests() {
    let usp = new URLSearchParams(window.location.search);

    if (!usp.has('test')) {
        return;
    }
    for (const test of tests) {
        test();
    }
    console.log(`\n${tests.length - failed}/${tests.length} tests passed`);
    console.log(`\nFailed tests:`);
    for (const test of failedTests) {
        console.log(`- ${test}`);
    }
}

function deepEqual(x, y) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
}

function testFailed(testName, expected, got) {
    console.log(` \u001b[31mFAILED\u001b[0m ${testName}`);
    console.log("expected: ",expected)
    console.log("     got:",got);
    failed++;
    failedTests.push(testName);
}

runTests();