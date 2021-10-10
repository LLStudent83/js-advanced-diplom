/* eslint-disable consistent-return */
export default class GameState {
  static from(object) {
    if (object === null) return;
    this.level = object.level;
    this.step = object.step; // чей ход игрока user или компьютера PC
    this.charPl = object.charPl;
    this.charPC = object.charPC;
    this.state = object.state; // при состоянии activ считается что игра в процессе. если new то нужно начать заново
    this.scores = object.scores;
    this.maxLevel = object.maxLevel; // максимальный уровень игрока при создании команды
    localStorage.setItem('state', JSON.stringify(object));
    return null;
  }
}
