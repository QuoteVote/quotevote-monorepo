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
  // Importing the resolver barrel drags in dependencies that leave ~400 open
  // handles (signal-exit and friends), so Jest hangs after a run instead of
  // exiting — most visibly when running a single file. The leak is in
  // third-party code and predates these tests; results are fully reported
  // before this takes effect.
  forceExit: true,
};

