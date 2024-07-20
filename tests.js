function runTests() {
    let usp = new URLSearchParams(window.location.search);

    if (!usp.has('test')) {
        return;
    }
    
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

runTests();