// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Mock environment variables for tests
process.env.NODE_ENV = 'test'
process.env.LOG_LEVEL = 'error' // Reduce log noise in tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-characters!'

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

// Suppress console logs in tests unless there's an error
const originalConsole = global.console
global.console = {
  ...originalConsole,
  log: jest.fn(), // Mock console.log
  info: jest.fn(), // Mock console.info
  warn: jest.fn(), // Mock console.warn
  error: originalConsole.error, // Keep console.error for debugging
}