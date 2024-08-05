let deck = new Deck();
const cards = new Cards();
const master = new Master();

if (!new URLSearchParams(window.location.search).has('test')) {
    cards.init().then(() => {
        master.loadDeck();
    });
}