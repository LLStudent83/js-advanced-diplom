export default class GameState {
  static from(object) {
    this.level = object.level;
    this.step = object.step;
    this.charPl = object.charPl;
    this.charPC = object.charPC;
    this.state = object.state;
    this.scores = object.scores;
    this.maxLevel = object.maxLevel;
    return null;
  }
}
