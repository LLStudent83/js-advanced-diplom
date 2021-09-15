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
    this.playerTurnParameters = {
      swordsman: 4,
      bowman: 2,
      magician: 1,
      daemon: 1,
      undead: 4,
      vampire: 2,
    };
    this.playerAttacParameters = {
      swordsman: 1,
      bowman: 2,
      magician: 4,
      daemon: 4,
      undead: 1,
      vampire: 2,
    };
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
    // блок установки курсора
    for (const char of GameState.charPl) {
      if (char.position === index) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
    // блок выделения ячейки перед перемещением персонажа
    const numActivSell = Array.from(this.gamePlay.cells) // номер активной ячейки персонажа
      .findIndex((element) => element.classList.contains('selected') && element.firstChild);
      // номер ячейки активного персонажа найденное по названию класса
    if (numActivSell !== -1) { // если есть активный игрок .....
      let dist;
      const nameActivChar = GameState.charPl.find((char) => char.position === numActivSell).character.type;
      // eslint-disable-next-line guard-for-in
      for (const key in this.playerTurnParameters) {
        if (key === nameActivChar) { // определяем дальность хода фигур
          dist = this.playerTurnParameters[key];
        }
      }
      const indexSellWithoutChar = Array.from(this.gamePlay.cells).findIndex((element) => element.classList
        .contains('selected') && !element.firstChild);
      if (indexSellWithoutChar !== -1) {
        this.gamePlay.deselectCell(indexSellWithoutChar);
      }
      if (calcСruisingRange(numActivSell, index, dist) !== -1
       && !(this.gamePlay.cells[index].firstChild)) {
        // эта формула возвращает индекс клетки хода или -1
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      }
    }

    // и номер клетки равен ..... условию выделить его зеленым пунктиром
    // this.playerTurnParameters;

    // if (игрок выделен зеленым кругом и курсор в поле зоны перемещения) {
    //  выделить клетку штрихпунктирным кругои и курсор палец green
    //  }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    // TODO: react to mouse leave
  }
}
// Ход
// Мечники/Скелеты - 4 клетки в любом направлении
// Лучники/Вампиры - 2 клетки в любом направлении
// Маги/Демоны - 1 клетка в любом направлении
// Атака
// Мечники/Скелеты - могут атаковать только соседнюю клетку
// Лучники/Вампиры - на ближайшие 2 клетки
// Маги/Демоны - на ближайшие 4 клетки
