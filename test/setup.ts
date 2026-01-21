/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Jest test setup
 */

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console.warn to suppress licensing notices during tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (!message.includes('Velocity BPA Licensing Notice')) {
      originalWarn.apply(console, args);
    }
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
