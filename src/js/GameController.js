import themes from './themes';
import { generateTeam } from './generators';
import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import { calcAreaAction, getMoveSellForPC } from './utils';

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
    const noomCellActivCharPl = Array.from(this.gamePlay.cells)
      .findIndex((element) => element.classList.contains('selected-yellow') && element.firstChild);
      // выше номер клетки активного персонажа игрока
    const CharPl = GameState.charPl.find((element) => element.position === index);
    // выше персонаж игрока если есть в клетке куда кликнул
    const CharPC = GameState.charPC.find((element) => element.position === index);
    // выше персонаж ПК если есть в клетке куда кликнул

    // ____________________ниже логика перемещения_______________________________
    if (!(CharPl || CharPC)) { // если попал в клетку где нет персонажей
      if (this.gamePlay.cells[index].classList.contains('selected-green')) {
        //  ниже формируем массив позиционированны персонажей игрока с новой позицией
        const newArrCharePl = GameState.charPl.map((char) => {
          if (this.gamePlay.cells[char.position].classList.contains('selected')) {
            char.position = index;
            return char;
          } return char;
        });
        GameState.charPl = newArrCharePl;
        GameState.step = 'PC';
        this.arrSummCharPosition = [...GameState.charPC, ...GameState.charPl];
        // выше массив персонажей находящихся на поле
        this.gamePlay.redrawPositions(this.arrSummCharPosition);

        this.gamePlay.deselectCell(noomCellActivCharPl);
        this.gamePlay.selectCell(index);
        this.strokePC();
      }
      return;
    }
    if (CharPC && !this.gamePlay.cells[index].classList.contains('selected-red')
    && noomCellActivCharPl === -1) {
      GamePlay.showError('Выберите своего персонажа');
      return;
    }
    if (CharPC && !this.gamePlay.cells[index].classList.contains('selected-red')
    && noomCellActivCharPl !== -1) {
      GamePlay.showError('Ваш персонаж не дотянулся до противника. Подберитесь по ближе :-)');
      return;
    }
    // _______________________ниже логика проведения атаки____________________
    if (CharPC && this.gamePlay.cells[index].classList.contains('selected-red')) {
      const activCharPl = GameState.charPl.find((char) => char.position === noomCellActivCharPl);
      const damageSize = Math.max(activCharPl.character.attack - CharPC.character.defence, activCharPl.character.attack * 0.1);
      console.log(damageSize);
      const promise = this.gamePlay.showDamage(index, damageSize);
      promise.then(() => {
        //  ниже формируем массив позиционированны персонажей игрока с новым уровнем здоровья
        const newArrCharePC = GameState.charPC.map((char) => {
          if (this.gamePlay.cells[char.position].classList.contains('selected-red')) {
            char.character.health -= damageSize;
            return char;
          } return char;
        }).filter((char) => char.character.health > 0);

        GameState.charPC = newArrCharePC;
        GameState.step = 'PC';
        this.arrSummCharPosition = [...GameState.charPC, ...GameState.charPl];
        // выше массив персонажей находящихся на поле
        this.gamePlay.redrawPositions(this.arrSummCharPosition);
        this.strokePC();
      });

      return;
    }
    // если кликнул по клетке и там есть персонаж игрока то .....
    if (noomCellActivCharPl === -1) { // если активного персонажа нет то ....
      this.gamePlay.selectCell(CharPl.position);
      return;
    }
    if (!(noomCellActivCharPl === CharPl.position)) { // если клинтул по не активному персонажу игрока ...
      this.gamePlay.deselectCell(noomCellActivCharPl);
      this.gamePlay.selectCell(CharPl.position);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  strokePC() { // логика ответного хода PC
    // рандомно выбираем персонажа PC.
    const activCharPC = GameState.charPC[Math.floor(Math.random() * GameState.charPC.length)];
    // берем персонажи игрока и проверяем номера позиций находятся в зоне удара или нет
    const attackCharPl = GameState.charPl.find((char) => calcAreaAction(activCharPC.position, char.position, activCharPC.character.type, 'attack'));
    // _____________________ ниже логика атаки PC __________________________
    if (attackCharPl) { // если в зоне удара есть игрок то .....
      console.log(`сейчас ударит ${activCharPC} по ${attackCharPl}`);

      const damageSize = Math.max(activCharPC.character.attack - attackCharPl.character.defence, activCharPC.character.attack * 0.1);
      console.log(damageSize);
      const promise = this.gamePlay.showDamage(attackCharPl.position, damageSize);
      promise.then(() => {
      //  ниже формируем массив позиционированныx персонажей игрока с новым уровнем здоровья
        const newArrCharePL = GameState.charPl.map((char) => {
          if (char.position === attackCharPl.position) {
            char.character.health -= damageSize;
            return char;
          } return char;
        }).filter((char) => char.character.health > 0);
        GameState.charPl = newArrCharePL;
        GameState.step = 'Pl';
        this.arrSummCharPosition = [...GameState.charPC, ...GameState.charPl];
        // выше массив персонажей находящихся на поле
        this.gamePlay.redrawPositions(this.arrSummCharPosition);
      });
      // _____________________ ниже логика хода PC __________________________
    } else {
      const moveSell = getMoveSellForPC(activCharPC, this.gamePlay.cells);
      const newArrCharePC = GameState.charPC.map((char) => {
        if (char.position === activCharPC.position) {
          char.position = moveSell;
          return char;
        } return char;
      });
      GameState.charPC = newArrCharePC;
      GameState.step = 'Pl';
      this.arrSummCharPosition = [...GameState.charPC, ...GameState.charPl];
      // выше массив персонажей находящихся на поле
      this.gamePlay.redrawPositions(this.arrSummCharPosition);

    }
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
      // номер ячейки активного персонажа найденного по названию класса
    if (numActivSell !== -1) { // если есть активный игрок .....
      // let dist;
      const nameActivChar = GameState.charPl.find((char) => this.gamePlay.cells[char.position].classList.contains('selected-yellow')).character.type;

      if (calcAreaAction(numActivSell, index, nameActivChar, 'move')
       && !this.gamePlay.cells[index].firstChild) { // если номер ячейки находится в диапазоне разрешонных для хода и это не персонаж то ...
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      // блок выделения ячейки с противником
      if ((calcAreaAction(numActivSell, index, nameActivChar, 'attack'))
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
