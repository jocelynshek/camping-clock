// When ideating for this piece, I thought about events in my life where I didn't care much for the time, and being in nature always inspires that feeling for me.

let embers = [];
let stars = [];
let fireParticles = [];
let lastSecond = -1;
let lastMinute = -1;

function setup() {
  createCanvas(1400, 650);
  frameRate(120);
  angleMode(DEGREES);
	createInitialStars();
}

function draw() {
  background(20, 20, 50); // Dark blue for ground backdrop
  
  let h = hour();
  let m = minute();
  let s = second();
	
	// Some updating that I am doing within the draw() function

  // Stars fade out at the start of each new minute
  if (lastMinute != m && s === 0) {
    for (let star of stars) {
      star.startFading();
    }
    lastMinute = m;
  }

  // Remove stars that have faded completely
  stars = stars.filter(star => !star.isFinished());

  // Update fire every section
  if (lastSecond != s) {
    createFireParticles();
    createEmber();
    lastSecond = s;
  }

  // Illustrations in the layered order that I want them to show up
	drawSky();
	drawMoon(h); // changes based on AM/PM
	drawStars();
	drawTrees(h); // # of trees is the hour
  drawTents(m); // # of tents is the minute
  drawBonfire();
  drawEmbers();
	drawLogs();
  updateFireParticles();
	
}

function drawSky() {
  // Sky gradient
  for (let i = 0; i < height / 2; i++) {
    stroke(20, 20, 50 + i * 0.2);
    line(0, i, width, i);
  }
}

function createInitialStars() {
  let currentSecond = second();
  for (let i = 0; i < currentSecond; i++) {
    let x = randomGaussian(width / 2, width / 4);
    let y = random(0, height / 3);
    stars.push(new Star(x, y));
  }
}

function drawMoon(hours) {
	beginShape();
	
	if(hours => 12) {
		fill(255,255,255);
	}
	
	if(hours < 12) {
		fill(230, 187, 46);
	}

  // Anchor point and Bezier vertices
	vertex(70, 20);
	bezierVertex(20, 0, 0, 75, 70, 75);
	bezierVertex(50, 80, 20, 25, 70, 20);

  endShape();
}

function drawTrees(hours) {
  let hours12 = hours % 12 || 12; // Convert to 12-hour
  let availableWidth = width - 300; // Subtracting bonfire area
  let treeSpacing = availableWidth / (hours12 + 1);
  let leftOffset = 0;

  for (let i = 1; i <= hours12; i++) {
    let x;
    if (i * treeSpacing <= width / 2 - 150) {
      // Trees on the left side
      x = i * treeSpacing;
    } else {
      // Trees on the right side
      if (leftOffset === 0) leftOffset = 300;
      x = i * treeSpacing + leftOffset;
    }
    
    let y = height-400; // Tree height
    drawTree(x, y);
  }
}

function drawTree(x, y) {
  push();
	noStroke();
  fill(20, 20, 50); // shadow color to match ground
  rect(x - 10, y, 20, 100); //trunk

  bezier(x - 60, y + 50, 
         x - 30, y - 40, 
         x + 30, y - 40, 
         x + 60, y + 50);

  bezier(x - 45, y, 
         x - 20, y - 80, 
         x + 20, y - 80, 
         x + 45, y);

  // Top layer
  bezier(x - 30, y - 50, 
         x - 10, y - 120, 
         x + 10, y - 120, 
         x + 30, y - 50);
  pop();
}

function drawTents(minutes) {
  let maxTentsPerRow = 15; // Maximum tents per row
  let maxRows = 4; // Maximum number of rows

  // Determine the number of rows to use based on minutes
  let rows = Math.ceil(minutes / maxTentsPerRow);
  rows = constrain(rows, 1, maxRows);

  let remainingTents = minutes;

  for (let row = 0; row < rows; row++) {
    let tentsInRow = min(remainingTents, maxTentsPerRow);
    let tentGap = width / (tentsInRow + 1);
    let y = height - 25 - row * 60; // figuring out tent height/spacing

    for (let i = 1; i <= tentsInRow; i++) {
      let x = i * tentGap;
      drawTent(x, y, 1);
    }

    remainingTents -= tentsInRow;

    if (remainingTents <= 0) {
      break;
    }
  }
}

function drawTent(x, y, scale) {
  push();
	noStroke();
  scale *= 0.75; // was playing around with spacing of tents
  translate(x, y);

  fill(200, 100, 50);
  triangle(-20 * scale, 0, 20 * scale, 0, 0, -40 * scale);
  
	fill(0, 0, 0);
  triangle(-10 * scale, 0, 10 * scale, 0, 0, -40 * scale);
  
	fill(73, 131, 74);
  triangle(50 * scale, -40 * scale, 20 * scale, 0, 0, -40 * scale);
  triangle(50 * scale, -40 * scale, 35 * scale, -71 * scale, 0, -40 * scale);
  stroke(0);
  line(-20 * scale, 0, 20 * scale, 0);
  pop();
}

function drawLogs() {
  push();
  translate(width / 2, height / 2 + 20);
  stroke(100, 50, 0);
  strokeWeight(25);
  
  // First log
  rotate(15);
  line(-50, 0, 50, 0);
  
  // Second log
  rotate(-30);
  line(-50, 0, 50, 0);
	
	// adding shadow/layers
	stroke(61, 33, 0);
	line(-50, 0, -49, 0);
	line(45, 25, 44, 28);
	
	strokeWeight(2);
	line(-52, -12, 55, -12);
	line(-50, 12, 53, 12);
	
  pop();
}

function drawBonfire() {
  // Drawing the bonfire base
  noStroke();
  fill(150, 75, 0);
  ellipse(width / 2, height / 2, 80, 40);

  fill(255, 100, 0, 150);
	
  beginShape();

  vertex(width/2, height/2-70);
	bezierVertex(width / 2 + 60, height / 2 - 10, width / 2 + 60, height / 2 + 10, width / 2, height / 2 + 20);
  bezierVertex(width / 2 - 60, height / 2 + 10, width / 2 - 60, height / 2 - 10, width / 2, height / 2 - 70);

  endShape();
	
  // updating fire particles
  for (let p of fireParticles) {
    p.draw();
    p.update();
  }
}

function drawEmbers() {
  for (let i = embers.length - 1; i >= 0; i--) {
    let ember = embers[i];
    ember.update();
    ember.display();

    if (ember.isOutOfView()) {
      // Making embers stars when they reach sky
      stars.push(new Star(ember.pos.x, ember.pos.y));
      embers.splice(i, 1);
    }
  }
}

function createFireParticles() {
  // Fire particles for bonfire
  for (let i = 0; i < 5; i++) {
    fireParticles.push(new FireParticle(width / 2, height / 2));
  }
}

function createEmber() {
  let xPos = randomGaussian(width / 2, width / 4);
  embers.push(new Ember(xPos, height / 2));
}

function updateFireParticles() {
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    fireParticles[i].update();
    if (fireParticles[i].isFinished()) {
      fireParticles.splice(i, 1);
    }
  }
}

function drawStars() {
  for (let star of stars) {
    star.update();
    star.display();
  }
}

class Star {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(2, 4);
    this.vel = createVector(random(-1, 1), random(-0.5, -1.5)); // More horizontal spread
    this.alpha = 255;
    this.fading = false;
    this.fadeSpeed = 10;
  }
	
  update() {
    if (this.fading) {
      this.alpha -= this.fadeSpeed; // Fade out
      this.pos.y -= 2; // Move upwards
    }
  }

  display() {
    fill(255, this.alpha);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  startFading() {
    this.fading = true;
  }

  isFinished() {
    return this.alpha <= 0; // Star disappears when faded
  }
}

class FireParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-2, -0.5));
    this.alpha = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 4;
  }

  isFinished() {
    return this.alpha <= 0;
  }

  draw() {
    noStroke();
    fill(255, 100, 0, this.alpha);
    ellipse(this.pos.x, this.pos.y, 6);
  }
}

class Ember {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5), random(-2, -1));
    this.alpha = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 2;
  }

  display() {
    noStroke();
    fill(255, 150, 0, this.alpha);
    ellipse(this.pos.x, this.pos.y, 4);
  }

  isOutOfView() {
    return this.pos.y < 100 || this.alpha <= 0;
  }
}