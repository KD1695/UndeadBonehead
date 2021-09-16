window.onload = function()
{
    var config = {
        type: Phaser.AUTO,
        width: 600,
        height: 600,
        parent: 'phaser-game',
		autoCenter: true,
        physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 },
				debug: false
			}
		},
		scene: [SceneMain]
    };

    var game = new Phaser.Game(config);
}