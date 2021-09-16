class Player extends Phaser.GameObjects.Sprite
{
    constructor(config)
    {
        super(config.scene, config.x, config.y, "player");
        this.speed = 50;
        this.direction = config.direction;
        config.scene.add.existing(this);
        this.bounds = { x : config.scene.world.bounds.x, y : config.scene.world.bounds.y};
    }

    update()
    {
        if(this.x > this.bounds.x || this.y > this.bounds.y || this.x < 0 || this.y < 0)
        {
            this.destroy();
        }
    }
}