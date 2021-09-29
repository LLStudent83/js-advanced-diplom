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

        // levelUp() {
        //   this.level += 1;
        //   const attackAfter = Math.max(this.attack, (this.attack * (1.8 - this.health)) / 100);
        //   this.attack = attackAfter;
        //   const defenseAfter = Math.max(this.defence, (this.defence * (1.8 - (this.health / 100))));
        //   this.defence = defenseAfter;

        //   if (this.health >= 20) {
        //     this.health = 100;
        //   } else {
        //     this.health += 80;
        //   }
        // }
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
