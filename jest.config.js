module.exports = {
  setupFiles: [
    '<rootDir>/setupTests.js'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@storybook/.*\\.vue$))",
  ],
};