module.exports = {
  extends: ['.eslintrc.cjs'],
  overrides: [
    {
      files: ['src/features/chat/**/*.ts', 'src/features/chat/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-empty': 'off',
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-unused-expressions': 'off'
      }
    }
  ]
};
