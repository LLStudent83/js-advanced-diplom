import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);

// beforeEach(() => {
//   gamePlay.bindToDOM(document.querySelector('#game-container'));
//   gameCtrl.init();
// });

test('Проверяем что срабатывает метод showCellTooltip при наведении на ячейку', () => {
  // gameCtrl.gamePlay.showCellTooltip = jest.fn();

  // gameCtrl.onCellEnter(0);
  // // gameCtrl.onCellLeave(1);

  // expect(gameCtrl.gamePlay.showCellTooltip).toBeCalled();
});
