import themes from './themes';
import { generateTeam } from './generators';
import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import { calcСruisingRange } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.arrPositionsPlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49];
    this.arrPositionsPC = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 62, 63];
  }

  init() {
    if (!GameState.state) {
      this.gamePlay.drawUi(themes.prairie);
      const arrObjCharRendomPlayer = generateTeam(new Team().arrObjChar, 1, 2, this.arrPositionsPlayer);
      const arrObjCharRendomPC = generateTeam(new Team().arrObjChar, 1, 2, this.arrPositionsPC);
      this.arrSummCharPosition = [...arrObjCharRendomPlayer, ...arrObjCharRendomPC];
      this.gamePlay.redrawPositions(this.arrSummCharPosition);
      GameState.from(
        {
          level: 1,
          charPl: arrObjCharRendomPlayer,
          charPC: arrObjCharRendomPC,
          step: 'user',
          state: 'activ',
          scores: 0,
          maxLevel: 1,
        },
      );
    } else {
      const { level } = GameState;
      let theme;
      if (level === 1) {
        theme = themes.prairie;
      } if (level === 2) {
        theme = themes.desert;
      } if (level === 3) {
        theme = themes.arctic;
      } if (level === 3) {
        theme = themes.mountain;
      }

      this.gamePlay.drawUi(theme);

      this.arrSummCharPosition = [...GameState.charPC, ...GameState.charPl];
      // массив персонажей находящихся на поле
      this.gamePlay.redrawPositions(this.arrSummCharPosition);
    }

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.gamePlay.addNewGameListener(() => {
      GameState.from({ state: null });
      this.init();
    });
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    const activCharPl = GameState.charPl.find((element) => element.position === index);

    // активный персонаж игрока
    const activCharPC = GameState.charPC.find((element) => element.position === index);
    // активный персонаж ПК
    if (!(activCharPl || activCharPC)) {
      return;
    }
    if (activCharPC) {
      GamePlay.showError('Выберите своего персонажа');
      return;
    }
    const noomCellActivChar = Array.from(this.gamePlay.cells)
      .findIndex((element) => element.classList.contains('selected'));
    // номер клетки активного персонажа
    if (noomCellActivChar === -1) {
      this.gamePlay.selectCell(activCharPl.position);
      return;
    }
    if (!(noomCellActivChar === activCharPl.position)) {
      this.gamePlay.deselectCell(noomCellActivChar);
      this.gamePlay.selectCell(activCharPl.position);
    }
    // TODO: react to click
  }

  onCellEnter(index) {
    // блок отобоажения тулбара
    const activSellChar = this.arrSummCharPosition.find((element) => element.position === index);
    // активный игрок
    if (activSellChar) {
      const message = `🎖${activSellChar.character.level} ⚔${activSellChar.character.attack} 
      🛡${activSellChar.character.defence} ❤${activSellChar.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }

    // блок выделения ячейки перед перемещением персонажа
    const numActivSell = Array.from(this.gamePlay.cells)
      .findIndex((element) => element.classList.contains('selected') && element.firstChild);
      // номер ячейки активного персонажа найденное по названию класса
    if (numActivSell !== -1) { // если есть активный игрок .....
      // let dist;
      const nameActivChar = GameState.charPl.find((char) => char.position === numActivSell).character.type;

      if (calcСruisingRange(numActivSell, index, nameActivChar, 'move') !== -1
       && !this.gamePlay.cells[index].firstChild) { // если номер ячейки находится в диапазоне разрешонных для хода и это не персонаж то ...
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      // блок выделения ячейки с противником
      if ((calcСruisingRange(numActivSell, index, nameActivChar, 'attack') !== -1)
      && GameState.charPC.find((char) => char.position === index)) {
        // если номер ячейки находится в диапазоне разрешонных для атаки и это персонаж ПК то .
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
      }
    }
    // блок установки курсора
    for (const char of GameState.charPl) {
      if (char.position === index) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    const indexSellWithoutChar = Array.from(this.gamePlay.cells).findIndex((element) => element.classList
      .contains('selected') && !element.firstChild);
    // номер выделенной ячейки пустой без персонажей

    if (indexSellWithoutChar !== -1) { // если есть выделенная ячейка без персонажа то ...
      this.gamePlay.deselectCell(indexSellWithoutChar);
    }
    const activCharPC = GameState.charPC.find((charPC) => this.gamePlay.cells[charPC.position].classList.contains('selected'));
    // активный персонаж ПК
    if (activCharPC) {
      this.gamePlay.deselectCell(activCharPC.position);
    // TODO: react to mouse leave
    }
  }
}
