let racerXs = [45, 40, 30, 47];
let startY = 50;
let yStep = 60;
let finishX = 560;
let winner = -1;
let restartBtn;

function setup() {
  createCanvas(600, startY + yStep * racerXs.length);

  restartBtn = createButton("Restart Race");
  restartBtn.mousePressed(restartRace);
}

function draw() {
  background(240);

  // Finish line
  line(finishX, 0, finishX, height);

  for (let i = 0; i < racerXs.length; i++) {
    let y = startY + yStep * i;

    if (winner === -1 && racerXs[i] < finishX) {
      racerXs[i] += random(1, 3);

      if (racerXs[i] >= finishX) {
        winner = i;
      }
    }

    circle(racerXs[i], y, 24);
  }

  if (winner !== -1) {
    textSize(24);
    text(`Racer ${winner + 1} wins!`, 20, 30);
  }
}

function restartRace() {
  racerXs = [30, 30, 30];
  winner = -1;
}