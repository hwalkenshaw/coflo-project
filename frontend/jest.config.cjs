/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          isolatedModules: true,
          jsx: 'react-jsx',
          target: 'ES2019',
          module: 'commonjs'
        }
      }
    ]
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts']
}

