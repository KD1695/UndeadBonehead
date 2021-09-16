class Player extends Phaser.GameObjects.Sprite
{
    speed = 2.5;
    canRotate = true;
    canPunch = false;
    constructor(config)
    {
        super(config.scene, config.x, config.y, "player");
        config.scene.add.existing(this);
    }

    create(scene)
    {
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update(scene)
    {
        if (this.cursors.left.isDown)
        {
            this.angle -= this.speed;
        }
        else if (this.cursors.right.isDown)
        {
            this.angle += this.speed;
        }
        else if(this.cursors.up.isDown)
        {

        }
        else if(this.cursors.down.isDown)
        {

        }
    }
}