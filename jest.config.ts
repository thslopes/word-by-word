
import type { Config } from 'jest';

const config: Config = {
    globals: {
        "document": {
            getElementById: (elementId: string) => {},
            getElementsByClassName: (tagName: string) => []
        }
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
};

export default config;
