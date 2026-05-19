class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 250;
        this.DRAG = 3000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 2500;
        this.JUMP_VELOCITY = -750;
        this.SCALE = 2.5;
        this.PARTICLE_VELOCITY = 50;
        this.jumpsRemaining = 0;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("stage-1");

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 100);
        this.physics.world.checkCollision.up = false;
        this.physics.world.TILE_BIAS = 32;
        
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.bgTileset = this.map.addTilesetImage("tilemap-backgrounds_packed", "background_tiles");
        this.industrialTileset = this.map.addTilesetImage("pixel_platformer_industrial_tilemap_packed", "industrial_tiles");
        const allTilesets = [this.tileset, this.bgTileset, this.industrialTileset];
      
        this.skyLayer = this.map.createLayer("Sky", this.bgTileset, 0, 0);

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", [this.tileset, this.industrialTileset], 0, 0);

        this.waterLayer = this.map.createLayer("Water-n-Spikes", [this.tileset, this.industrialTileset], 0, 0);
        
        this.fallingPlatforms = this.map.createLayer("falling-platforms", [this.tileset, this.industrialTileset], 0, 0);

        this.aesthetics = this.map.createLayer("aesthetics", [this.tileset, this.industrialTileset], 0, 0);

        this.waterLayer.setCollisionByProperty({
            hazard: true
        });

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.groundLayer.forEachTile(tile => {
            if (tile.properties.oneway === true){
                tile.setCollision(false, false, true, false);
            }
        });

        this.fallingPlatforms.setCollisionByProperty({
            collides: true
        });

        this.fallingPlatforms.forEachTile(tile => {
            if (tile.properties.oneway === true){
                tile.setCollision(false, false, true, false);
            }
        });

        this.coins = this.map.createFromObjects("Coins", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.diamonds = this.map.createFromObjects("Diamonds", {
            name: "diamond",
            key: "tilemap_sheet",
            frame: 67
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.diamonds, Phaser.Physics.Arcade.STATIC_BODY);

        this.coinGroup = this.add.group(this.coins);
        this.diamondGroup = this.add.group(this.diamonds);

        my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");

        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.waterLayer, (obj1, obj2) => {
            obj1.setPosition(30, 200);
        });

        this.physics.add.collider(my.sprite.player, this.fallingPlatforms);

        this.waterZone = this.add.zone(this.map.widthInPixels / 2, this.map.heightInPixels - 18, this.map.widthInPixels, 80);
        this.physics.world.enable(this.waterZone);
        this.waterZone.body.setAllowGravity(false);
        this.waterZone.body.moves = false;

        this.physics.add.overlap(my.sprite.player, this.waterZone, (obj1, obj2) => {
            obj1.setPosition(30, 200);
        });

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy();
        });
        
        this.physics.add.overlap(my.sprite.player, this.diamondGroup, (obj1, obj2) => {
            obj2.destroy();
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // Camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.1, 5, 5);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle'); 
        }

        if(my.sprite.player.body.blocked.down){
            this.jumpsRemaining = 1;
        }
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }   
        if(this.jumpsRemaining > 0 && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.jumpsRemaining--;
        }
        
    
    }
}