export default class GameState {
  static from(object) {
    const state = object;

    localStorage.setItem('state', JSON.stringify(state));
    return null;
  }
}
