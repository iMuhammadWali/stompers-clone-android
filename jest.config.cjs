module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/test/*.spec.tsx'],
  moduleNameMapper: {'^expo-modules-core(.*)$':'<rootDir>/node_modules/expo/node_modules/expo-modules-core$1'},
};
