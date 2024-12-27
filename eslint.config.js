module.exports = {
    files: ['**/*.{js,ts}'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        parserOptions: {
            project: './tsconfig.json',
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'prettier/prettier': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
    },
};
