/* eslint-disable no-undef, import/no-extraneous-dependencies, global-require */
import '@testing-library/jest-native/extend-expect';
// @ts-ignore
import MockAsyncStorage from 'mock-async-storage';

// @ts-ignore
global.fetch = require('node-fetch');

const mockImpl = new MockAsyncStorage();
jest.mock('@react-native-community/async-storage', () => mockImpl);
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

export default undefined;
