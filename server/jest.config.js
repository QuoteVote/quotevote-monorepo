module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', {
      configFile: false,
      babelrc: true,
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@babel)/)',
  ],
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/app/data$1',
    '^@sendgrid/mail$': '<rootDir>/app/tests/__mocks__/sendgrid-mail.js',
  },
  testMatch: ['**/tests/**/*.test.js', '**/app/tests/**/*.test.js'],
  collectCoverageFrom: [
    'app/**/*.js',
    '!app/tests/**',
    '!app/server.js',
  ],
  setupFilesAfterEnv: [],
};

