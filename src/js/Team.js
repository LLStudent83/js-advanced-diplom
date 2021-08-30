/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import Character from './Character';

export default class Team {
  constructor() {
    this.arrObjChar = [
      class Swordsman extends Character {
        constructor(level, type = 'generic') {
          super(level, 'swordsman');
          this.attack = 40;
          this.defence = 10;
        }
      },
      class Bowman extends Character {
        constructor(level, type = 'generic') {
          super(level, 'bowman');
          this.attack = 25;
          this.defence = 25;
        }
      },
      class Magician extends Character {
        constructor(level, type = 'generic') {
          super(level, 'magician');
          this.attack = 10;
          this.defence = 40;
        }
      },
      class Daemon extends Character {
        constructor(level, type = 'generic') {
          super(level, 'daemon');
          this.attack = 10;
          this.defence = 40;
        }
      },
      class Undead extends Character {
        constructor(level, type = 'generic') {
          super(level, 'undead');
          this.attack = 40;
          this.defence = 10;
        }
      },
      class Vampire extends Character {
        constructor(level, type = 'generic') {
          super(level, 'vampire');
          this.attack = 25;
          this.defence = 25;
        }
      },
    ];
  }
}

console.log(new Team().arrObjChar);
// Стартовые характеристики (атака/защита)
// Bowman - 25/25
// Swordsman - 40/10
// Magician - 10/40
// Vampire - 25/25
// Undead - 40/10
// Daemon - 10/40
//   static getObjChar() {
//     class Swordsman extends Character {
//       constructor(level, type = 'swordsman') {
//         super(level, type = 'swordsman');
//       }
//     }
//     class Bowman extends Character {
//       constructor(level, type = 'bowman') {
//         super(level, type = 'bowman');
//       }
//     }
//     const arrObjChar = [
//       new Swordsman(1, 'swordsman'),
//       new Bowman(1, 'bowman'),
//     ];
//     // console.log(new Swordsman(1, 'swordsman'));
//   }
// }
// Team.getObjChar();

// new Daemon(level), где class Daemon extends Character


// class Rabbit extends Animal {
//     // генерируется для классов-потомков, у которых нет своего конструктора
//     constructor(...args) {
//       super(...args);
//     }
//   }
