import themes from './themes';
import { generateTeam } from './generators';
import Team from './Team';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.arrPositionsPlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49];
    this.arrPositionsPC = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 62, 63];
  }

  init() {
    // GameState.from(object);
    // const state = this.stateService.load();
    // определяю тип темы
    const theme = undefined;
    // if (state.level === 1 || state.level === null) {
    //   theme = themes.prairie;
    // } if (state.level === 2) {
    //   theme = themes.desert;
    // } if (state.level === 3) {
    //   theme = themes.arctic;
    // } if (state.level === 3) {
    //   theme = themes.mountain;
    // }

    this.gamePlay.drawUi(themes.prairie); // theme

    // Собираю команду

    const arrObjCharRendomPlayer = generateTeam(new Team().arrObjChar, 1, 2, this.arrPositionsPlayer);
    const arrObjCharRendomPC = generateTeam(new Team().arrObjChar, 1, 2, this.arrPositionsPC);

    this.gamePlay.redrawPositions([...arrObjCharRendomPlayer, ...arrObjCharRendomPC]);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)); // добавляет обработчики события
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick);

    this.gamePlay.addNewGameListener(() => {
      // игрок ходит первым т.е. step: 'user'
      this.init();
    });
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  // level: 1,
  // char: new Team(2, 1, [new Bowman(), new Swordsman()]).ranking(),
  // step: 'user',
  // state: null,
  // scores: 0,
  // maxLevel: 1,

  onCellClick(index) {
    console.log('Вызвался onCellClick', this);
    // TODO: react to click
  }

  onCellEnter(index) { // обработчик события вход на ячейку
    if (true) {
      const message = `🎖${'уровень'} ⚔${'атака'} 🛡${'защита'} ❤${'жизнь'}`;
      this.gamePlay.showCellTooltip(message, index); // отображает информацию
    }// TODO: react to mouse enter
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index); // скрывает информацю
    // TODO: react to mouse leave
  }
}
