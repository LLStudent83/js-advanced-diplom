export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error('class Character вызван через new');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 10;
    this.type = type;
  }

  levelUp() {
    this.level += 1;
    const attackAfter = Math.max(this.attack, (this.attack * (1.8 - this.health)) / 100);
    this.attack = attackAfter;
    const defenseAfter = Math.max(this.defence, (this.defence * (1.8 - (this.health / 100))));
    this.defence = defenseAfter;

    if (this.health >= 20) {
      this.health = 100;
    } else {
      this.health += 80;
    }
    return this;
  }
}
