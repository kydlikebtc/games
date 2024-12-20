module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['@swc/jest', {
      sourceMaps: true,
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: false,
          decorators: true,
          dynamicImport: true
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true
        },
        target: "es2017",
        keepClassNames: true
      },
      module: {
        type: "commonjs",
        strict: false,
        noInterop: false
      }
    }]
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
  resolver: undefined,
  globals: {
    'ts-jest': {
      skipBabel: true
    }
  }
};
