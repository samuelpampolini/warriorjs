class Player {
	constructor() {
		this._health = 0;
		this._actualHealth = 0;
		this._direction = 'forward';
		this._walk = true;

		this._warrior = null;
	}

	healthIsGood() {
		return this._actualHealth > 8;
	}

	isUnderAttack() {
		return this._health > this._actualHealth;
	}

	shouldGoBack() {
		return this.isUnderAttack() === true && this.healthIsGood() === false;
	}

	whatDirection() {
		var units = this._warrior.listen();
		var indexNear = null;
		var lastPosition = null;
		var stairs = null;
		var data = { direction: null, spaces: null, kind: null };

		for(index in units) {
			if(units[index].isStairs()) {
				stairs = index;
			} else if(indexNear === null || this._warrior.distanceOf(units[index]) < lastPosition) {
				indexNear = index;
				lastPosition = this._warrior.distanceOf(units[index]);
			}
		}

		if(indexNear !== null) {
			data.direction = this._warrior.directionOf(units[indexNear]);
			data.spaces = lastPosition;
			data.kind = units[index].isEnemy() ? 'enemy' : 'captive';
		} else {
			data.direction = this._warrior.directionOf(units[stairs]);
			data.spaces = stairs;
			data.kind = 'stairs';
		}

		return data;
	}

	attack(direction, spaces) {
		if(spaces > 1) {
			this._warrior.shoot(direction);
		} else {
			this._warrior.attack(direction);
		}
	}

	walk(direction) {
		if(direction != this_direction) {
			this_direction = direction;
			this._warrior.pivot(this._direction);
		} else {
			this._warrior.walk(this._direction);
		}
	}

  playTurn(warrior) {
  	this._didAction = false; //reset action
  	this._warrior = warrior;
  	this._actualHealth = this._warrior.health();

  	if(this.shouldGoBack()) {
  		this._warrior.walk(this._direction === 'backward' ? 'forward' : 'backward');
  		return;
  	} else if(this.healthIsGood() === false && this._actualHealth != 20) {
		this._warrior.rest();
  		return;
  	}

  	var data = this.whatDirection();

  	if(data.kind == 'enemy' && data.spaces <= 2) {
  		this.attack(data.direction, data.spaces);
  	} else if(data.kind == 'captive' && data.spaces == 1) {
  		this._warrior.rescue(data.direction);
  	} else {
  		this._warrior.walk(data.direction);
  	}

	this._health = health;
  }
}

global.Player = Player;

