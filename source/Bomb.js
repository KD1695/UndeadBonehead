class Bomb extends Phaser.GameObjects.Sprite
{
	constructor(config)
    {	
		var minXSpawnPoint = 0;
		var minYSpawnPoint = 0;
	
		var maxXSpawnPoint = 800;
		var maxYSpawnPoint = 600;
		
		var xSpawnPoint =  Phaser.Math.Between(minXSpawnPoint, maxXSpawnPoint);
		var ySpawnPoint =  Phaser.Math.Between(minYSpawnPoint, maxYSpawnPoint);
		
		super(config.scene, xSpawnPoint, ySpawnPoint, "bomb");
        config.scene.add.existing(this);
    }
}