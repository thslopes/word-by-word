enum WordStatus {
    REMOVED= -2,
    NOT_LEARNED= -1,
    MISTAKEN= 0,
    LEARNING= 1,
    LEARNED= 2,
    EXPERT= 3,
};


interface Card {
    word: string;
    translation: string;
    status: WordStatus
}

export { Card, WordStatus }