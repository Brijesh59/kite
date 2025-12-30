module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/testing"],
  testMatch: [
    "<rootDir>/testing/**/__tests__/**/*.test.ts",
    "<rootDir>/testing/**/*.test.ts",
  ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/generated/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/testing/e2e/setup/jest-setup.ts"],
  globalSetup: "<rootDir>/testing/e2e/setup/global-setup.ts",
  globalTeardown: "<rootDir>/testing/e2e/setup/global-teardown.ts",
  testTimeout: 30000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  clearMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@testing/(.*)$": "<rootDir>/testing/$1",
  },
};
