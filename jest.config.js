module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/__tests__/**/*.property.test.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-typescript'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(fast-check)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
