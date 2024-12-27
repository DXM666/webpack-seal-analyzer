module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.{js,ts}', '**/test/**/*.spec.{js,ts}'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    roots: ['<rootDir>/test'],
};
