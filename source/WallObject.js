class WallObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {	
		console.log("Creating Wall!");
		super(scene, x, y, 'wall');
		this.setActive(false);
		this.setVisible(false);
		scene.add.existing(this);
    }
	
	spawn(spawnX, spawnY, shouldRotate)
	{				
		console.log("Wall Spawned at: (" + spawnX + ", " + spawnY + ")");
		
		this.x = spawnX;
		this.y = spawnY;
		this.setActive(true);
		this.setVisible(true);
		this.body.enable = true;
		
		if (shouldRotate === true)
		{
			this.angle = 90
		}
	}
}