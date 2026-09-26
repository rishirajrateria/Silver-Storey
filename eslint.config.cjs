module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      // Agent worktrees checked out during sessions carry their own .next
      // output; they are not part of this project.
      '.claude/**',
      'commitlint.config.js',
      'package-lock.json',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
