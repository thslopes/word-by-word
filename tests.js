let failed = 0;
let failedTests = [];
let failedAsserts = [];

async function runTests() {
    let usp = new URLSearchParams(window.location.search);

    if (!usp.has('test')) {
        return;
    }
    for (const [testName, test] of tests) {
        try {
            const t = test();
            if (t instanceof Promise) {
                await t;
            }
        } catch (e) {
            console.log(`\u001b[31mFAILED\u001b[0m ${testName}`);
            console.log(e);
            failedTests.push(testName);
            failed++;
        }
        if (failedAsserts.length > 0) {
            failedTests.push(testName);
            failed++;
            console.log(`\u001b[31mFAILED\u001b[0m ${testName}`);
            for (const failedAssert of failedAsserts) {
                console.log(`\u001b[31m${failedAssert.message}\u001b[0m`)
                console.log("  expected: ", failedAssert.expected)
                console.log("       got:", failedAssert.got);
            }
        } else {
            console.log(`\u001b[32mPASSED\u001b[0m ${testName}`);
        }
        failedAsserts = [];
    }
    console.log(`\n\n${tests.size - failed}/${tests.size} tests passed`);
    if (failed > 0) {
        printFailedTests();
    }

    for (const [afterName, after] of afterTests) {
        try {
            const t = after();
            if (t instanceof Promise) {
                await t;
            }
            console.log(`\n${afterName}`);
        } catch (e) {
            console.log(`\u001b[31mFAILED\u001b[0m ${afterName}`);
            console.log(e);
        }
    }
}

function printFailedTests() {
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

function assert(expected, got, message) {
    if (deepEqual(expected, got)) {
        return;
    }
    failedAsserts.push({ message: message, expected: expected, got: got });
}

runTests();