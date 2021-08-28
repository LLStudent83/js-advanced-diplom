/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import Character from './Character';

export default class Team {
  constructor() {
    this.arrNamesChar = ['swordsman', 'bowman', 'magician', 'daemon', 'undead', 'vampire'];
  }

  static getObjChar() {
    class Swordsman extends Character {
      constructor(level, type = 'generic') {
        super(level, type = 'generic');
      }
    }
    console.log(new Swordsman(1, 'swordsman'));
  }
}
Team.getObjChar();

// new Daemon(level), где class Daemon extends Character


// class Rabbit extends Animal {
//     // генерируется для классов-потомков, у которых нет своего конструктора
//     constructor(...args) {
//       super(...args);
//     }
//   }
