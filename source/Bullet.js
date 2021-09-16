class Bullet
{
    constructor(config)
    {
        this.bulletSprite = config.scene.physics.add.sprite(config.x, config.y, 'bullet');
        this.bulletSprite.setBounce(0.5,0.5);
        this.bulletSprite.setCollideWorldBounds(true);
        config.scene.physics.velocityFromAngle(config.angle, config.velocity, this.bulletSprite.body.velocity);
        this.bulletSprite.setScale(0.25);
        this.bounds = { x : config.scene.physics.world.bounds.x, y : config.scene.physics.world.bounds.y};
    }

    update()
    {
        if(this.bulletSprite == null)
            return;
        if(this.bulletSprite.body.velocity.x < 0.1 && this.bulletSprite.body.velocity.y < 0.1)
        {
            this.bulletSprite.destroy();
            this.bulletSprite = null;
        }
    }
}