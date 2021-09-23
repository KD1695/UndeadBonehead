const bugStates = 
	{
		IDLE : 0,
		MOVING : 1,
		TARGETING : 2,
		PUSHING : 3,
		DEAD : 4
	};

class BugObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {			
		super(scene, x, y, 'bug');	
		this.setActive(false);
		this.setVisible(false);
		this.currentState = bugStates.IDLE;
		this.minStateDuration = 0.5;
		this.maxStateDuration = 1.5;
		this.randomMoveDirection = {x: 0, y: 0}
		this.moveSpeed = 400;
		this.currentPushDelayTime = 0;
		this.pushDelay = 1;
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		scene.add.existing(this);
		scene.sys.arcadePhysics.world.enableBody(this, 0);	
    }
	
	spawn(spawnX, spawnY, bombsPhysicsGroup, spawnManager, bonusesPhysicsGroup)
	{		
		this.x = spawnX;
		this.y = spawnY;
		this.bombs = bombsPhysicsGroup;
		this.spawnManager = spawnManager
		this.bonuses = bonusesPhysicsGroup
		this.setActive(true);
		this.setVisible(true);
		this.body.enable = true;
		
		//this.setScale(1.5);
		
		var walkingFrameRate = 60;
		
		this.anims.create({
			key: 'idle',
			frames: [
				{key: 'bug', frame: "ENEMY_1.png"},
 			],
			frameRate: 1,
			repeat: -1	
		});
		
		this.anims.create({
			key: 'walkS',
			frames: [
				{key: 'bug', frame: "ENEMY_2.png"},
				{key: 'bug', frame: "ENEMY_1.png"},
				{key: 'bug', frame: "ENEMY_3.png"},
 			],
			frameRate: 20,
			repeat: -1	
		});
		
		this.anims.create({
			key: 'walkE',
			frames: [
				{key: 'bug', frame: "ENEMY_5.png"},
				{key: 'bug', frame: "ENEMY_4.png"},
				{key: 'bug', frame: "ENEMY_6.png"},
 			],
			frameRate: 20,
			repeat: -1	
		});
		
		this.anims.create({
			key: 'walkN',
			frames: [
				{key: 'bug', frame: "ENEMY_8.png"},
				{key: 'bug', frame: "ENEMY_7.png"},
				{key: 'bug', frame: "ENEMY_9.png"},
 			],
			frameRate: 20,
			repeat: -1	
		});
		
		this.anims.create({
			key: 'walkW',
			frames: [
				{key: 'bug', frame: "ENEMY_11.png"},
				{key: 'bug', frame: "ENEMY_10.png"},
				{key: 'bug', frame: "ENEMY_12.png"},
 			],
			frameRate: 20,
			repeat: -1	
		});
	}
	
	preUpdate(timestep, dt)
	{	
		super.preUpdate(timestep, dt);
		
		if (this.name === "dead")
		{
			this.scene.bugKillSound.play();
			this.bonuses.spawnBonus(this.x, this.y);
			this.destroy();
			return;
		}
		
		if (this.name === "trapped")
		{
			this.moveSpeed = 100;
		}
		else if (this.name === "uncollided")
		{
			this.moveSpeed = 400;
		}
		
		switch (this.currentState)
		{
			case bugStates.IDLE:
				this.name = "uncollided";
				this.idleUpdate(dt / 1000);
				break;
			case bugStates.MOVING:
				this.name = "uncollided";
				this.movingUpdate(dt / 1000);
				break;
			case bugStates.TARGETING:
				this.name = "uncollided";
				this.targetingUpdate();
				break;
			case bugStates.PUSHING:
				this.pushingUpdate(dt / 1000);
				break;
			default:
				break;
		}
	}
	
	idleUpdate(timestep)
	{		
		//console.log("IDLE");
		
		this.anims.play("idle", true);
		
		if (this.currentStateTime < this.stateDuration)
		{
			this.currentStateTime += timestep;
			return;
		}
		
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		
		this.currentState = bugStates.TARGETING;
		
		this.getRandomTargetBomb();
		
		//Retry a maximum of 20 times to find an untargeted bomb
		for (let i = 0; i < 20; i++)
		{
			if (this.targetBomb.targeted === false)
			{
				break;
			}
			
			this.getRandomTargetBomb();
		}
		
		//Return to idle if no targeted bomb was found
		if (this.targetBomb.targeted === true)
		{
			this.currentState = bugStates.IDLE;
		}
	}
	
	getRandomTargetBomb()
	{
		var targetBombIndex = Phaser.Math.Between(0, this.bombs.totalActiveBombs);
		
		if (targetBombIndex === 0)
		{
			this.targetBomb = this.bombs.getFirstAlive();
		}
		else
		{
			this.targetBomb = this.bombs.getFirstNth(targetBombIndex, true);	
		}
	}
	
	movingUpdate(timestep)
	{
		//console.log("MOVING");
		
		if (Math.abs(this.x - this.moveDestination.x) < 5 && Math.abs(this.y - this.moveDestination.y) < 5)
		{
			this.x = this.moveDestination.x;
			this.y = this.moveDestination.y;
			this.scene.physics.moveToObject(this, this, 0);
			this.currentState = bugStates.IDLE;
			this.currentStateTime = 0;
		}
		else
		{
			this.updateAnimation(this.moveDestination.x, this.moveDestination.y);
			
			this.scene.physics.moveTo(this, this.moveDestination.x, this.moveDestination.y, this.moveSpeed);
		}
	}
	
	targetingUpdate()
	{
		if (this.targetBomb.active === true)
		{
			this.targetBomb.targeted = true;
			
			if (Math.abs(this.x - this.targetBomb.x) < 5 && Math.abs(this.y - this.targetBomb.y) < 5)
			{
				this.x = this.targetBomb.x;
				this.y = this.targetBomb.y;
				this.scene.physics.moveToObject(this, this, 0);
				this.currentState = bugStates.PUSHING;
			}
			else
			{
				this.moveTowardsBomb();
			}
		}
		else
		{
			this.scene.physics.moveToObject(this, this, 0);
			this.currentState = bugStates.IDLE;
		}
	}
	
	moveTowardsBomb()
	{
		var moveDirection = {x: this.targetBomb.x - this.x, y: this.targetBomb.y - this.y };
		
		var horizontalCollision = false;
		var verticalCollision = false;
		
		//Check for horizontal dead zone collision
		if (Math.abs(this.y - this.targetBomb.y) > 5)
		{
			if (moveDirection.x < 0)
			{
				for (let i = this.x; i > this.targetBomb.x; i--)
				{
					if (i < this.spawnManager.maxDeadZoneX + this.spawnManager.spawnZoneBuffer)
					{
						if (this.y > this.spawnManager.minDeadZoneY && this.y < this.spawnManager.maxDeadZoneY)
						{
							horizontalCollision = true;
							break;
						}
					}
				}	
			}
			else
			{
				for (let i = this.x; i < this.targetBomb.x; i++)
				{
					if (i > this.spawnManager.minDeadZoneX - this.spawnManager.spawnZoneBuffer)
					{
						if (this.y > this.spawnManager.minDeadZoneY && this.y < this.spawnManager.maxDeadZoneY)
						{
							horizontalCollision = true;
							break;
						}
					}
				}
			}
		}
		
		//Check for vertical dead zone collision
		if (Math.abs(this.x - this.targetBomb.x) > 5)
		{
			if (moveDirection.y < 0)
			{
				for (let i = this.y; i > this.targetBomb.y; i--)
				{
					if (i < (this.spawnManager.maxDeadZoneY + this.spawnManager.spawnZoneBuffer))
					{
						if (this.x > this.spawnManager.minDeadZoneX && this.x < this.spawnManager.maxDeadZoneX)
						{
							verticalCollision = true;
							break;
						}
					}
				}	
			}
			else
			{
				for (let i = this.y; i < this.targetBomb.y; i++)
				{
					if (i > this.spawnManager.minDeadZoneY - this.spawnManager.spawnZoneBuffer)
					{
						if (this.x > this.spawnManager.minDeadZoneX && this.x < this.spawnManager.maxDeadZoneX)
						{
							verticalCollision = true;
							break;
						}
					}
				}
			}
		}
		
		this.updateAnimation(this.targetBomb.x, this.targetBomb.y);
		
		//Prioritize horizontal collisions first (picked arbitrarily)
		if (horizontalCollision === true)
		{
			//console.log("Horizontal Collision! Bug Position: (" + this.x + ", " + this.y + ") Bomb Position: (" + this.targetBomb.x + ", " + this.targetBomb.y + ")");
			this.scene.physics.moveTo(this, this.x, this.targetBomb.y, this.moveSpeed);	
		}
		else if (verticalCollision === true)
		{
			//console.log("Vertical Collision! Bug Position: (" + this.x + ", " + this.y + ") Bomb Position: (" + this.targetBomb.x + ", " + this.targetBomb.y + ")");
			this.scene.physics.moveTo(this, this.targetBomb.x, this.y, this.moveSpeed);	
		}
		else
		{
			//console.log("No Collision");
			this.scene.physics.moveTo(this, this.targetBomb.x, this.targetBomb.y, this.moveSpeed);	
		}
	}
	
	pushingUpdate(timestep)
	{
		//console.log("PUSHING");
		
		if (this.currentPushDelayTime < this.pushDelay)
		{
			this.currentPushDelayTime += timestep;
			this.updateAnimation(this.x, this.y);
			return;
		}
		
		if (this.targetBomb.active === true && this.targetBomb.targeted === true)
		{
			if (this.name === "collided")
			{
				this.visible = true;
				this.scene.physics.moveToObject(this, this, 0);
				this.scene.physics.moveToObject(this.targetBomb, this.targetBomb, 0);
				this.currentPushDelayTime = 0;
				this.currentState = bugStates.MOVING;
				var moveDirection = {x: this.x - this.spawnManager.screenCenter.x, y: this.y - this.spawnManager.screenCenter.y };
				this.moveDestination = {x: this.x + moveDirection.x, y: this.y + moveDirection.y };
				return;	
			}
			
			if (this.hasEnteredDeadZone() === true)
			{
				this.currentState = bugStates.MOVING;
				this.currentPushDelayTime = 0;
				this.scene.physics.moveToObject(this, this, 0);
				this.scene.physics.moveToObject(this.targetBomb, this.targetBomb, 0);
				var moveDirection = {x: this.x - this.spawnManager.screenCenter.x, y: this.y - this.spawnManager.screenCenter.y };
				this.moveDestination = {x: this.x + moveDirection.x, y: this.y + moveDirection.y };
			}
			else
			{
				this.updateAnimation(this.spawnManager.screenCenter.x, this.spawnManager.screenCenter.y);
				this.scene.physics.moveTo(this, this.spawnManager.screenCenter.x, this.spawnManager.screenCenter.y, this.moveSpeed);
				this.scene.physics.moveTo(this.targetBomb, this.spawnManager.screenCenter.x, this.spawnManager.screenCenter.y, this.moveSpeed);
			}	
		}
		else
		{
			this.scene.physics.moveToObject(this, this, 0);
			this.currentPushDelayTime = 0;
			this.currentState = bugStates.IDLE;
		}
	}
	
	hasEnteredDeadZone()
	{
		//Left border
		if (Math.abs(this.x - this.spawnManager.minDeadZoneX) < 5 && this.y > this.spawnManager.minDeadZoneY && this.y < this.spawnManager.maxDeadZoneY)
		{
			return true;
		}
		//Right border
		if (Math.abs(this.x - this.spawnManager.maxDeadZoneX) < 5 && this.y > this.spawnManager.minDeadZoneY && this.y < this.spawnManager.maxDeadZoneY)
		{
			return true;
		}
		//Top border
		if (Math.abs(this.y - this.spawnManager.minDeadZoneY) < 5 && this.x > this.spawnManager.minDeadZoneX && this.x < this.spawnManager.maxDeadZoneX)
		{
			return true;
		}
		//Bottom border
		if (Math.abs(this.y - this.spawnManager.maxDeadZoneY) < 5 && this.x > this.spawnManager.minDeadZoneX && this.x < this.spawnManager.maxDeadZoneX)
		{
			return true;
		}
		
		return false;
	}
	
	updateAnimation(destinationX, destinationY)
	{
		var horizontalMoveDirection = destinationX - this.x;
		var verticalMoveDirection = destinationY - this.y;
				
		if (this.currentState === bugStates.PUSHING && this.currentPushDelayTime < this.pushDelay)
		{
			this.anims.play("walkS", true);
			return;
		}
		
		if (Math.abs(horizontalMoveDirection) > Math.abs(verticalMoveDirection))
		{
			if (horizontalMoveDirection > 0)
			{
				this.anims.play("walkE", true);
			}
			else
			{
				this.anims.play("walkW", true);
			}
		}
		else
		{
			if (verticalMoveDirection > 0)
			{
				this.anims.play("walkS", true);
			}
			else
			{
				this.anims.play("walkN", true);
			}
		}
	}
}