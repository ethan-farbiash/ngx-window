const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
    ...createCjsPreset(),
    setupFilesAfterEnv: [
        '<rootDir>/setup-jest.ts'
    ],
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/src/test.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95
        }
    }
};