class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png"); 
        this.load.image("industrial_tiles", "pixel_platformer_industrial_tilemap_packed.png");
        this.load.image("background_tiles", "tilemap-backgrounds_packed.png");
        this.load.tilemapTiledJSON("stage-1", "stage-1.tmj");   // Tilemap in JSON

        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", { 
            frameWidth: 18,
            frameHeight: 18 
        });

        this.load.spritesheet("tilemap_characters", "tilemap-characters_packed.png", {
            frameWidth: 22,
            frameHeight: 22,
            spacing: 2,
            margin: 1
        });

        

    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });
        
        this.anims.create({
            key: 'coin_spin',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', {
                start: 151,
                end: 152,
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'flag_wave',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', {
                start: 111,
                end: 112,
            }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_walk',
            frames: this.anims.generateFrameNumbers('tilemap_characters', {
                start: 18,
                end: 19,
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_fly',
            frames: this.anims.generateFrameNumbers('tilemap_characters', {
                start: 24,
                end: 26,
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'unkillable_enemy_walk',
            frames: this.anims.generateFrameNumbers('tilemap_characters', {
                start: 15,
                end: 16,
            }),
            frameRate: 5,
            repeat: -1
        })


         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}