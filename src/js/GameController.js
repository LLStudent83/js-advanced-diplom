import themes from './themes';
import { generateTeam } from './generators';
import Team from './Team';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.arrPositionsPlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49];
    this.arrPositionsPC = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 62, 63];
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    const arrObjCharRendomPlayer = generateTeam(new Team().arrObjChar, 1, 2, this.arrPositionsPlayer);
    const arrObjCharRendomPC = generateTeam(new Team().arrObjChar, 1, 2, this.arrPositionsPC);


    this.gamePlay.redrawPositions([...arrObjCharRendomPlayer, ...arrObjCharRendomPC]);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
