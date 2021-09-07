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
    if (!this.stateService.load()) {
      this.gamePlay.drawUi(themes.prairie);
      const arrObjCharRendomPlayer = generateTeam(new Team().arrObjChar, 1, 2, this.arrPositionsPlayer);
      const arrObjCharRendomPC = generateTeam(new Team().arrObjChar, 1, 2, this.arrPositionsPC);
      this.arrSummCarPosition = [...arrObjCharRendomPlayer, ...arrObjCharRendomPC];
      this.gamePlay.redrawPositions(this.arrSummCarPosition);
      this.stateService.save(
        {
          level: 1,
          charPl: arrObjCharRendomPlayer,
          charPC: arrObjCharRendomPC,
          step: 'user',
          state: null,
          scores: 0,
          maxLevel: 1,
        },
      );
    } else {
      const state = this.stateService.load();
      let theme;
      if (state.level === 1) {
        theme = themes.prairie;
      } if (state.level === 2) {
        theme = themes.desert;
      } if (state.level === 3) {
        theme = themes.arctic;
      } if (state.level === 3) {
        theme = themes.mountain;
      }

      this.gamePlay.drawUi(theme);

      console.log([...state.charPC, ...state.charPl]);
      this.arrSummCarPosition = [...state.charPC, ...state.charPl];
      this.gamePlay.redrawPositions(this.arrSummCarPosition);
    }

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.gamePlay.addNewGameListener(() => {
    });
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    this.gamePlay.selectCell(index);
    // TODO: react to click
  }

  onCellEnter(index) {
    const activSell = this.arrSummCarPosition.find((element) => element.position === index);
    if (activSell) {
      const message = `🎖${activSell.character.level} ⚔${activSell.character.attack} 🛡${activSell.character.defence} ❤${activSell.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }// TODO: react to mouse enter
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    // TODO: react to mouse leave
  }
}
