import { calcTileType } from '../utils';

test.each([
  ['top-left', 1, 'top-left'],
  ['top-right', 8, 'top-right'],
  ['bottom-right', 64, 'bottom-right'],
  ['center', 43, 'center'],
  ['bottom-left', 57, 'bottom-left'],
  ['top', 3, 'top'],
  ['bottom', 62, 'bottom'],
  ['right', 16, 'right'],
  ['left', 41, 'left'],
])(
  ('checking the calculation of the tile type for %s checkName with %s amount'),
  (checkName, amount, expected) => {
    const boardSize = 8;
    const result = calcTileType(amount, boardSize);
    expect(result).toBe(expected);
  },
);
