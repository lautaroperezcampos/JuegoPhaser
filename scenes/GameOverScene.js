export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  init(data) {
    this.won = data.won;
    this.score = data.score || 0;
    this.timeLeft = data.timeLeft || 0;
    this.reason = data.reason || "";
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85);

    const titleText = this.won ? "¡GANASTE!" : "¡PERDISTE!";
    const titleColor = this.won ? "#2ecc71" : "#e74c3c";

    this.add
      .text(400, 180, titleText, {
        fontFamily: "Arial",
        fontSize: "64px",
        color: titleColor,
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(
        400,
        260,
        `Puntaje final: ${this.score}\nTiempo restante: ${this.timeLeft}s\n${this.reason}`,
        {
          fontFamily: "Arial",
          fontSize: "24px",
          color: "#ffffff",
          align: "center",
          lineSpacing: 10,
        }
      )
      .setOrigin(0.5);

    this.add
      .text(400, 380, "Presiona ESPACIO o haz clic para intentar de nuevo", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("hello-world");
    });

    this.input.once("pointerdown", () => {
      this.scene.start("hello-world");
    });
  }
}
