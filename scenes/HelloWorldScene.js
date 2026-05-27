// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
    this.timeLeft = 30;
    this.gameEnded = false;
  }

  init() {
    this.timeLeft = 30;
    this.gameEnded = false;
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

    this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true,
    });
  }

  tickTimer() {
    if (this.gameEnded) {
      return;
    }

    this.timeLeft -= 1;
    this.timerText.setText(`Tiempo: ${this.timeLeft}`);

    if (this.timeLeft <= 0) {
      this.endGame();
    }
  }

  endGame() {
    this.gameEnded = true;
    this.add
      .text(400, 300, "¡PERDISTE!", {
        fontFamily: "Arial",
        fontSize: "64px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 360, "Se acabó el tiempo. Recarga la página para jugar de nuevo.", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  update() {
    // update game objects
  }
}
