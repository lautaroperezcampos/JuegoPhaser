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
    this.load.image("logo", "./public/assets/phaser3-logo.png");
    this.load.image("red", "./public/assets/particles/red.png");
  }

  create() {
    // create game objects
    this.add.image(400, 300, "sky");

    const logo = this.physics.add.image(400, 100, "logo");
    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    // emmit particles from logo
    const emitter = this.add.particles(0, 0, "red", {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    emitter.startFollow(logo);

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

    this.items = this.physics.add.group();
    this.physics.add.overlap(logo, this.items, this.collectItem, null, this);

    this.createItemTextures();

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
    graphics.destroy();
  }

  spawnItem() {
    if (this.gameEnded) {
      return;
    }

    const types = ["square", "triangle", "diamond"];
    const type = Phaser.Math.RND.pick(types);
    const x = Phaser.Math.Between(40, 760);
    const item = this.items.create(x, -20, type);
    item.setVelocity(0, 120);
    item.setData("type", type);
    item.setData("value", this.itemValues[type]);
    item.setData("hitFloor", false);
    item.setCollideWorldBounds(true);
    item.setBounce(0.7);
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

    const message = won ? "¡GANASTE!" : "¡PERDISTE!";
    const detail = won
      ? "Superaste los 100 puntos."
      : "Se acabó el tiempo.";

    this.add
      .text(400, 300, message, {
        fontFamily: "Arial",
        fontSize: "64px",
        color: won ? "#2ecc71" : "#ff0000",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 360, detail, {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  update() {
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
