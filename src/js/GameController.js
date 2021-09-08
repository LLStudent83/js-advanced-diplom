import themes from './themes';
import { generateTeam } from './generators';
import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';

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
      this.arrSummCarPosition = [...arrObjCharRendomPlayer, ...arrObjCharRendomPC];
      this.gamePlay.redrawPositions(this.arrSummCarPosition);
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

      this.arrSummCarPosition = [...GameState.charPC, ...GameState.charPl];
      this.gamePlay.redrawPositions(this.arrSummCarPosition);
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
    const activCharPC = GameState.charPC.find((element) => element.position === index);
    if (!(activCharPl || activCharPC)) {
      return;
    }
    if (activCharPC) {
      GamePlay.showError('Выберите своего персонажа');
      return;
    }
    const noomCellActivChar = Array.from(this.gamePlay.cells)
      .findIndex((element) => element.classList.contains('selected'));

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
    const activSell = this.arrSummCarPosition.find((element) => element.position === index);
    if (activSell) {
      const message = `🎖${activSell.character.level} ⚔${activSell.character.attack} 
      🛡${activSell.character.defence} ❤${activSell.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
    // const activCharPlIndex = GameState.charPl.findIndex((element) => element.position === index);
    for (const char of GameState.charPl) {
      if (char.position === index) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
    // if (игрок выделен зеленым кругом и курсор в поле зоны перемещения) {
    //  выделить клетку штрихпунктирным кругои и курсор палец
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
