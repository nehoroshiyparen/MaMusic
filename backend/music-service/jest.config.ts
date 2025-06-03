import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/tests/**/*.test.ts'],
  modulePaths: ['<rootDir>'],
  clearMocks: true,
  moduleNameMapper: {
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    '^src/(.*)$': '<rootDir>/src/$1'
  },
}

export default config