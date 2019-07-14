module.exports = {
  setupFiles: [
    '<rootDir>/setupTests.js'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
  ],
};