class ObjectSpawnManager
{
	constructor(config)
    {	
		this.timeSinceLastObject = 0;
		
		this.minXSpawnPoint = 50;
		this.minYSpawnPoint = 50;	
		this.maxXSpawnPoint = 550;
		this.maxYSpawnPoint = 550;
	
		this.deadZoneWidth = 50;

		this.minDelayBetweenObjects = config.minDelay;
		this.maxDelayBetweenObjects = config.maxDelay;
	
		this.objectKey = config.objectKey;
	
		this.screenCenter = {x: config.camera.centerX, y: config.camera.centerY };
	
		this.minDeadZoneX = config.camera.centerX - this.deadZoneWidth;
		this.minDeadZoneY = config.camera.centerY - this.deadZoneWidth;
		this.maxDeadZoneX = config.camera.centerX + this.deadZoneWidth;;
		this.maxDeadZoneY = config.camera.centerY + this.deadZoneWidth;;
		
		this.spawnZoneBuffer = config.spawnZoneBuffer;
		
		this.delayUntilNextObject = Phaser.Math.Between(this.minDelayBetweenObjects, this.maxDelayBetweenObjects);
    }
	
	shouldSpawnObject(timeScale)
	{		
		if (this.timeSinceLastObject < this.delayUntilNextObject)
		{
			this.timeSinceLastObject += timeScale;
			return false;
		}
		else
		{
			this.timeSinceLastObject = 0;
			this.delayUntilNextObject = Phaser.Math.Between(this.minDelayBetweenObjects, this.maxDelayBetweenObjects);
			return true;
		}
	}
	
    getObjectSpawnCoordinates()
	{		
		var xSpawnPoint =  Phaser.Math.Between(this.minXSpawnPoint, this.maxXSpawnPoint);
		var ySpawnPoint =  Phaser.Math.Between(this.minYSpawnPoint, this.maxYSpawnPoint);
		
		while (this.isInDeadZone({x:xSpawnPoint, y:ySpawnPoint}))
		{
			xSpawnPoint =  Phaser.Math.Between(this.minXSpawnPoint, this.maxXSpawnPoint);
			ySpawnPoint =  Phaser.Math.Between(this.minYSpawnPoint, this.maxYSpawnPoint);
		}
		
		return {x:xSpawnPoint, y:ySpawnPoint};
	}
	
	isInDeadZone(spawnPoint)
	{
		if (spawnPoint.x > (this.minDeadZoneX - this.spawnZoneBuffer) && spawnPoint.x < (this.maxDeadZoneX + this.spawnZoneBuffer) &&
		    spawnPoint.y > (this.minDeadZoneY - this.spawnZoneBuffer) && spawnPoint.y < (this.maxDeadZoneY + this.spawnZoneBuffer))
		{
			return true;
		}
		
		return false;
	}
}