export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  saveGame(state) {
    this.storage.setItem('stateGame', JSON.stringify(state));
  }

  loadGame() {
    try {
      return JSON.parse(this.storage.getItem('stateGame'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
