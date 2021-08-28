import Character from '../Character';

test('check error when called from new', () => {
  // eslint-disable-next-line no-new
  expect(() => { new Character(1); }).toThrow();
});
