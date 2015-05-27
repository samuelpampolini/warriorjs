class Player {
	constructor() {
		this._directionOfStairs = null;
		this._warrior = null;
		this._direction = 'forward';
		this._lastDirection = 'forward';
		this._actualHealth = 0;
		this._health = 0;
		this._ran = false;
		this._ranDirection = '';

		this._feel = [];
	}

	action() {
		var enemyDirection = this.getEnemyDirection();
		var emptyDirection = this.getEmptyDirection();
		var captiveDirection = this.getCaptiveDirection();
		var walkTo = null;
		var attack = this.getEnemyDirection();
		var rest = false;
		var rescue = null;

		if(this.shouldRest() && !this.damaged()) {
			rest = true;
		} else if(this.fullback()) {
			walkTo = emptyDirection;
			this._ran = true;
			this._ranDirection = emptyDirection;
		} else if(this._ran) {
			walkTo = this.getOppositionDirection(this._ranDirection);
			this._ran = false;
		} else if(enemyDirection) {
			attack = enemyDirection;
		} else if(captiveDirection) {
			rescue = captiveDirection;
		} else {
			walkTo = this._directionOfStairs;
			this._lastDirection = this._directionOfStairs;
			this._direction = this._directionOfStairs;
		}

		if(rest) {
			this._warrior.rest();
		}
		else if(walkTo) {
			this._warrior.walk(walkTo);
		} else if(attack) {
			this._warrior.attack(attack);
		} else if(rescue) {
			this._warrior.rescue();
		}
	}

	damaged() {
		return this._health > this._actualHealth;
	}

	feelDirections() {
		this._feel['forward'] = this._warrior.feel('forward');
		this._feel['left'] = this._warrior.feel('left');
		this._feel['right'] = this._warrior.feel('right');
		this._feel['backward'] = this._warrior.feel('backward');
	}

	fullback() {
		return this._actualHealth < 6;
	}

	getDirection(method) {
		var direction;

		if(this._feel['forward'][method]()) {
			direction = 'forward';
		} else if(this._feel['left'][method]()) {
			direction = 'left';
		} else if(this._feel['right'][method]()) {
			direction = 'right';
		} else if(this._feel['backward'][method]()) {
			direction = 'backward';
		}

		return direction;
	}

	getEmptyDirection() {
		return this.getDirection('isEmpty');
	}

	getEnemyDirection() {
		return this.getDirection('isEnemy');
	}

	getCaptiveDirection() {
		return this.getDirection('isCaptive');
	}

	getOppositionDirection(direction) {
		var op = null;

		switch(direction) {
			case 'forward': op = 'backward'; break;
			case 'backward': op = 'forward'; break;
			case 'left': op = 'right'; break;
			case 'right': op = 'left'; break;
		}

		return op;
	}

	init() {
		this._directionOfStairs = this._warrior.directionOfStairs();
		this._actualHealth = this._warrior.health();

		this.feelDirections();

		this.action();

		this._health = this._actualHealth;
	}

	move(direction) {
		var emptyDirection = this.getEmptyDirection();

		if(this.fullback()) {

		} else {
			this._warrior.walk(direction);
		}
	}

	shouldRest() {
		return this._actualHealth < 14;
	}

	playTurn(warrior) {
		this._warrior = warrior;

		this.init();

		
	}
}

global.Player = Player;
