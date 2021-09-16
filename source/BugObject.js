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
		this.moveSpeed = 5;
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		scene.add.existing(this);
    }
	
	spawn(spawnX, spawnY, bombPhysicsGroup)
	{		
		this.x = spawnX;
		this.y = spawnY;
		this.bombs = bombPhysicsGroup;
		//bombPhysicsGroup.getFirst();
		this.setActive(true);
		this.setVisible(true);
	}
	
	preUpdate(timestep, dt)
	{	
		switch (this.currentState)
		{
			case bugStates.IDLE:
				this.idleUpdate(dt / 1000);
				break;
			case bugStates.MOVING:
				this.movingUpdate(dt / 1000);
				break;
			case bugStates.TARGETING:
				this.targetingUpdate(dt / 1000);
				break;
			default:
				break;
		}
	}
	
	idleUpdate(timestep)
	{
		console.log("IDLE");
		
		if (this.currentStateTime < this.stateDuration)
		{
			this.currentStateTime += timestep;
			return;
		}
		
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		
		this.currentState = bugStates.TARGETING;
		
		//var targetBombIndex = Phaser.Math.Between(0, this.bombs.getLength());
		
		this.targetBomb = this.bombs.getFirst();
		
		//10% chance bug goes into TARGETING mode from IDLE
		/*var targetingChance = Phaser.Math.Between(0, 100);
		if (targetingChance < 10)
		{
			this.currentState = bugStates.TARGETING;
		}
		else
		{
			this.currentState = bugStates.MOVING;	
		}*/
	}
	
	movingUpdate(timestep)
	{
		console.log("MOVING");
		
		if (this.currentStateTime < this.stateDuration)
		{
			this.currentStateTime += timestep;
			return;
		}
		
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		
		//30% chance bug goes into TARGETING mode from MOVING
		var targetingChance = Phaser.Math.Between(0, 100);
		if (targetingChance < 30)
		{
			this.currentState = bugStates.TARGETING;
		}
		else
		{
			this.currentState = bugStates.IDLE;	
		}
	}
	
	targetingUpdate(timestep)
	{
		console.log("TARGETING bomb at: " + "(" + this.targetBomb.x + ", " + this.targetBomb.y + ")");
		
		
	}
}