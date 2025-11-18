// Mock for @sendgrid/mail
// This mock is used by Jest tests only
const mockFn = typeof jest !== 'undefined' ? jest.fn() : () => {};

module.exports = {
  setApiKey: mockFn,
  send: mockFn,
};

