export default class GameState {
  static from(object) {
    this.level = object.level;
    this.step = object.step;
    this.charPl = object.charPl;
    this.charPC = object.charPC;
    this.state = object.state; // при состоянии activ считается что игра в процессе. если нет то нужно начать заново
    this.scores = object.scores;
    this.maxLevel = object.maxLevel; // максимальный уровень игрока при создании команды
    return null;
  }
}
