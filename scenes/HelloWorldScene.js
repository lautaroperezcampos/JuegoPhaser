// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
    this.timeLeft = 30;
    this.gameEnded = false;
    this.score = 0;
    this.itemValues = {
      square: 20,
      triangle: 15,
      diamond: 25,
      bad: -20,
    };
  }

  init() {
    this.timeLeft = 30;
    this.gameEnded = false;
    this.score = 0;
  }

  preload() {
    // load assets
    this.load.image("sky", "./public/assets/space3.png");
    this.load.image("red", "./public/assets/particles/red.png");
  }

  create() {
    // create game objects
    this.add.image(400, 300, "sky");

    this.timerText = this.add.text(16, 16, `Tiempo: ${this.timeLeft}`, {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff",
    });

    this.scoreText = this.add.text(16, 48, `Puntaje: ${this.score}`, {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff",
    });

    this.createPlatformTextures();
    this.createPlatforms();
    this.createPlayerTexture();
    this.createPlayer();

    this.items = this.physics.add.group();
    this.physics.add.collider(this.items, this.platforms);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);

    this.createItemTextures();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.spawnEvent = this.time.addEvent({
      delay: 500,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true,
    });
  }

  createPlatformTextures() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x95a5a6, 1);
    graphics.fillRect(0, 0, 160, 24);
    graphics.generateTexture("platform", 160, 24);
    graphics.destroy();
  }

  createItemTextures() {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x3498db, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("square", 32, 32);
    graphics.clear();

    graphics.fillStyle(0xe74c3c, 1);
    graphics.beginPath();
    graphics.moveTo(16, 0);
    graphics.lineTo(32, 32);
    graphics.lineTo(0, 32);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture("triangle", 32, 32);
    graphics.clear();

    graphics.fillStyle(0xf1c40f, 1);
    graphics.beginPath();
    graphics.moveTo(16, 0);
    graphics.lineTo(32, 16);
    graphics.lineTo(16, 32);
    graphics.lineTo(0, 16);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture("diamond", 32, 32);
    graphics.clear();

    graphics.fillStyle(0x8e44ad, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeLineShape(new Phaser.Geom.Line(8, 8, 24, 24));
    graphics.strokeLineShape(new Phaser.Geom.Line(24, 8, 8, 24));
    graphics.generateTexture("bad", 32, 32);
    graphics.destroy();
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 580, "platform").setScale(5, 1).refreshBody();
    this.platforms.create(200, 460, "platform").setScale(1.5, 1).refreshBody();
    this.platforms.create(600, 380, "platform").setScale(1.3, 1).refreshBody();
    this.platforms.create(300, 260, "platform").setScale(1.2, 1).refreshBody();
    this.platforms.create(520, 180, "platform").setScale(1, 1).refreshBody();
  }

  createPlayerTexture() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x2ecc71, 1);
    graphics.fillRect(0, 0, 32, 48);
    graphics.generateTexture("player", 32, 48);
    graphics.destroy();
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 520, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.1);
    this.player.body.setSize(32, 48);
  }

  spawnItem() {
    if (this.gameEnded) {
      return;
    }

    const types = ["square", "triangle", "diamond", "bad"];
    const type = Phaser.Math.RND.pick(types);
    const x = Phaser.Math.Between(40, 760);
    const item = this.items.create(x, -20, type);
    item.setVelocity(0, 120);
    item.setData("type", type);
    item.setData("value", this.itemValues[type]);
    item.setData("hitFloor", false);
    item.setCollideWorldBounds(true);
    item.setBounce(0.7);

    if (type === "bad") {
      item.setTint(0x9b59b6);
    }
  }

  collectItem(player, item) {
    if (this.gameEnded) {
      return;
    }

    const value = item.getData("value") || 0;
    this.score += value;
    item.destroy();
    this.scoreText.setText(`Puntaje: ${this.score}`);

    if (this.score > 100) {
      this.endGame(true);
    }
  }

  tickTimer() {
    if (this.gameEnded) {
      return;
    }

    this.timeLeft -= 1;
    this.timerText.setText(`Tiempo: ${this.timeLeft}`);

    if (this.timeLeft <= 0) {
      this.endGame(false);
    }
  }

  endGame(won = false) {
    if (this.gameEnded) {
      return;
    }

    this.gameEnded = true;
    if (this.spawnEvent) {
      this.spawnEvent.remove(false);
    }

    const detail = won
      ? "Superaste los 100 puntos."
      : "Se acabó el tiempo.";

    this.scene.start("game-over", {
      won,
      score: this.score,
      timeLeft: this.timeLeft,
      reason: detail,
    });
  }

  update() {
    if (this.player && this.cursors) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-260);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(260);
      } else {
        this.player.setVelocityX(0);
      }

      if (this.cursors.up.isDown && this.player.body.onFloor()) {
        this.player.setVelocityY(-420);
      }
    }

    this.items.children.each((item) => {
      if (!item || !item.body) {
        return;
      }

      const touchingFloor = item.body.blocked.down || item.body.touching.down;
      if (touchingFloor && !item.getData("hitFloor")) {
        item.setData("hitFloor", true);
        const value = item.getData("value") || 0;
        const newValue = value - 5;
        item.setData("value", newValue);

        if (newValue <= 0) {
          item.destroy();
        }
      }

      if (!touchingFloor && item.getData("hitFloor")) {
        item.setData("hitFloor", false);
      }
    }, this);
  }
}
