// --- VARIABLES ---
let score = 0;
let highScore = 0;
let shotsLeft = 10;
let gameTimer = 30;
let frameCounter = 0;

// Ball properties
let ballX, ballY;
let ballRadius = 15;
let ballVX = 0;
let ballVY = 0;
let isMoving = false;

// Shooting States: 0 = waiting, 1 = selecting power, 2 = aiming, 3 = ready to shoot
let shootStep = 0;
let powerValue = 0;
let powerDirection = 1;
let aimX = 0;
let aimY = 0;

// Hoop properties
let hoopX, hoopY;
let hoopWidth = 45;
let hoopZone2Line = 400;

function setup() {
createCanvas(800, 400);
resetBall();
resetHoop();
}

function draw() {
// Background = Orange court
background(230, 115, 0);

drawCourt();


if (!isMoving && shootStep === 0 && shotsLeft > 0 && gameTimer > 0) {
frameCounter++;
if (frameCounter >= 60) {
gameTimer--;
frameCounter = 0;
}
}

// --- GAME OVER CHECK ---
if (shotsLeft <= 0 || gameTimer <= 0) {
fill(0, 150);
rect(0, 0, width, height);
fill(255);
textSize(48);
textAlign(CENTER, CENTER);
text("GAME OVER", width / 2, height / 2 - 40);
textSize(24);
text("Final Score: " + score, width / 2, height / 2 + 20);
text("Click anywhere to restart", width / 2, height / 2 + 70);
return;
}

// --- BALL PHYSICS ---
if (isMoving) {
ballX += ballVX;
ballY += ballVY;
ballVY += 0.45; // Gravity

// Collision detection with the hoop
if (ballY >= hoopY - 3 && ballY <= hoopY + 8) {
if (ballX >= hoopX - hoopWidth / 2.2 && ballX <= hoopX + hoopWidth / 2.2) {
let pointsEarned = (ballX > hoopZone2Line) ? 3 : 2;
score += pointsEarned;

if (score > highScore) {
highScore = score;
}

resetHoop();
resetBall();
isMoving = false;
shootStep = 0;
shotsLeft--;
}
}

// Miss if it goes off screen
if (ballY > height || ballX < 0 || ballX > width) {
score -= 1; // Miss penalty
resetBall();
isMoving = false;
shootStep = 0;
shotsLeft--;
}
}

// --- DRAW HOOP & NET ---
drawHoop();

// --- DRAW BALL ---
noStroke();
fill(200, 80, 0);
ellipse(ballX, ballY, ballRadius * 2);

// --- DRAW INTERACTION GUIDES ---
if (shootStep === 1) {
// Power Bar animation
powerValue += 5 * powerDirection;
if (powerValue > 150 || powerValue < 0) {
powerDirection *= -1;
}

// Draw Power Bar
stroke(0);
strokeWeight(2);
fill(255);
rect(width / 2 - 20, height - 200, 40, 150);
fill(255, 0, 0);
noStroke();
rect(width / 2 - 16, height - 50 - powerValue, 32, powerValue);

textAlign(CENTER);
fill(255);
textSize(18);
text("Click again to lock POWER!", width / 2, height - 220);
} else if (shootStep === 2) {
// Show live aiming line following mouse before clicking
stroke(255, 255, 0);
strokeWeight(3);
line(ballX, ballY, mouseX, mouseY);

textAlign(CENTER);
fill(255);
textSize(18);
text("Click to lock AIM direction!", width / 2, height - 100);
}

// --- DRAW HUD ---
drawHUD();
}

// --- MOUSE CONTROLS (Click Power -> Click Aim -> Shoot) ---
function mousePressed() {
if (shotsLeft <= 0 || gameTimer <= 0) {
score = 0;
shotsLeft = 10;
gameTimer = 30;
resetHoop();
resetBall();
shootStep = 0;
return;
}

if (!isMoving) {
if (shootStep === 0) {
// Step 1: Start power meter
shootStep = 1;
powerValue = 0;
} else if (shootStep === 1) {
// Step 2: Lock power, move to aim click mode
shootStep = 2;
} else if (shootStep === 2) {
// Step 3: Lock aim position and fire the ball!
let dx = mouseX - ballX;
let dy = mouseY - ballY;
let angleMag = sqrt(dx * dx + dy * dy);

if (angleMag > 0) {
let speedFactor = map(powerValue, 0, 150, 5, 18);
ballVX = (dx / angleMag) * speedFactor;
ballVY = (dy / angleMag) * speedFactor;

isMoving = true;
shootStep = 0;
}
}
}
}

// --- HELPER FUNCTIONS ---
function resetBall() {
ballX = width / 2;
ballY = height - 80;
ballVX = 0;
ballVY = 0;
}

function resetHoop() {
hoopX = random(150, width - 150);
hoopY = random(120, 300);
}

function drawHoop() {
// Backboard
fill(255, 255, 255, 200);
stroke(0);
strokeWeight(3);
rect(hoopX - 35, hoopY - 45, 70, 45, 5);
// Backboard square target
noFill();
stroke(255, 0, 0);
rect(hoopX - 12, hoopY - 30, 24, 20);

// Net strings
stroke(255);
strokeWeight(1);
let netDepth = 35;
for (let i = -hoopWidth / 2; i <= hoopWidth / 2; i += 8) {
line(hoopX + i, hoopY, hoopX + i * 0.6, hoopY + netDepth);
}

// Rim
fill(255, 69, 0);
stroke(200, 50, 0);
strokeWeight(4);
ellipse(hoopX, hoopY, hoopWidth, 18);
}

function drawCourt() {
stroke(255);
strokeWeight(2);
line(hoopZone2Line, 0, hoopZone2Line, height);

noStroke();
fill(255, 60);
textSize(16);
textAlign(CENTER);
text("2-Point Zone", 200, 40);
text("3-Point Zone", 600, 40);
} 

function drawHUD() {
fill(0, 150);
noStroke();
rect(10, 10, 260, 130, 10);

fill(255);
textSize(18);
textAlign(LEFT, TOP);
text("Score: " + score, 25, 20);
text("High Score: " + highScore, 25, 50);
text("Shots Left: " + shotsLeft, 25, 80);
text("Time Left: " + gameTimer + "s", 25, 110);
}

