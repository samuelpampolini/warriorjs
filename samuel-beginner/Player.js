class Player {
	constructor() {
		this._health = 0;
		this._actualHealth = 0;
		this._direction = 'forward';
		this._directionShoot = 'forward';
		this._lookingDirection = 'forward';
		this._walk = true;
		this._warrior = null;
	}

	directiontoShoot(direction) {
		var look = this._warrior.look(direction);
		var index;
		var dameged = this.hasBeenDameged();

		for(index in look) {
			var attack = (index > 0 && !dameged) || (index > 1);
			if(look[index].isCaptive()) {
				return null;
			}
			else if(look[index].isEnemy() && attack) {
				return direction;
			}
		}

		return null;
	}

	fullBack() {
		return this._actualHealth < 7;
	}

	hasBeenDameged() {
		return this._health > this._actualHealth;
	}

	hasToFire() {
		var direction = this.directiontoShoot(this._direction);

		if(direction == null) {
			direction = this.directiontoShoot('left');
		}

		if(direction == null) {
			direction = this.directiontoShoot('right');
		}

		if(direction == null) {
			direction = this.directiontoShoot('backward');
		}

		return direction;
	}

	lookForCaptive(direction) {
		var look = this._warrior.look(direction);
		var index;

		for(index in look) {
			if(look[index].isCaptive()) {
				return direction;
			}
			else if(!look[index].isEmpty()) {
				return null;
			}
		}

		return null;
	}

	move(feel, direction) {
		if(direction == null || direction == undefined) {
			direction = this._direction;
		}

		if (feel.isWall()) {
			this._warrior.pivot();
		} else if(feel.isEmpty() && !this.hasBeenDameged() && this.shouldRest()) {
			this._warrior.rest();
		}
		else {
			this._warrior.walk(direction);
		}
	}

	moveToCaptive(direction) {
		var feel = this._warrior.feel(direction);

		if(feel.isCaptive()) {
			this._warrior.rescue(direction);
		} else {
			this._warrior.walk(direction);
		}
	}

	shouldRest() {
		return this._actualHealth < 12;
	}

	shouldChangeDirectionWall(direction) {
		var look = this._warrior.look(direction);
		var index;

		for(index in look) {
			if(index == 0 && look[index].isStairs()) {
				return null;
			}
			else if(index == 0 && look[index].isEmpty()) {
				continue;
			}
			else if(look[index].isWall()) {
				return direction === 'backward' ? 'forward' : 'backward';
			}
			else {
				return null;
			}
		}

		return null;
	}

	playTurn(warrior) {
		this._warrior = warrior;
		this._actualHealth = warrior.health();
		var feel = warrior.feel(this._direction);
		var directionToShoot = this.hasToFire();
		var directionForCaptiveForward = this.lookForCaptive('forward');
		var directionForCaptiveBackward = this.lookForCaptive('backward');
		var direction = this._direction;
		var oppositeDirection = direction === 'backward' ? 'forward' : 'backward';
		var directionToCaptive = directionForCaptiveForward || directionForCaptiveBackward;
		var newDirectionBecauseWall = this.shouldChangeDirectionWall(this._lookingDirection);
		
		this._walk = false;

		if(feel.isCaptive()) {
			warrior.rescue(this._direction);
		} else if(directionToCaptive != null) {
			this.moveToCaptive(directionToCaptive);		
		} else if(this.fullBack()) {
			this._walk = true;
			direction = oppositeDirection;
		}
		else if(newDirectionBecauseWall) {
			warrior.pivot(newDirectionBecauseWall);
		} else if(directionToShoot != null) {
			warrior.shoot(directionToShoot);
		} else if (feel.isWall()) {
			warrior.pivot();
		} else if(feel.isEmpty()) {
			this._walk = true;
		} else {
			warrior.attack(this._direction);
		}

		if(this._walk) {
			this.move(feel, direction);
		}

		this._health = this._actualHealth;
	}
}

global.Player = Player;
