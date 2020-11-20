tf.setBackend("cpu");

// The number of birds in each population
const totalPopulation = 100;

// Birds currently alived
let alivePlanes = [];

// all the birds of the current generation
let allPlanes = [];

// Array which holds all the pipes on the screen
let pipes = [];

let frameCounter = 0;

// Current generation number
let generation = 1;

let generationSpan;

function preload() {
    planeImg = loadImage("assets/plane.png");
	bg = loadImage("assets/bg.png");
}

function setup() {
	let canvas = createCanvas(bg.width, bg.height);
	generationSpan = select("#generation");
	generationSpan.html(generation);
	canvas.parent("sketch");
	for (let i = 0; i < totalPopulation; i++) {
		let bird = new Plane();
		alivePlanes[i] = bird;
		allPlanes[i] = bird;
	}
}

function draw() {
	image(bg, 0, 0);
	for (let i = pipes.length - 1; i >= 0; i--) {
		pipes[i].update();
		if (pipes[i].checkOffScreen()) {
			pipes.splice(i, 1);
		}
	}

	for (let i = alivePlanes.length - 1; i >= 0; i--) {
		let plane = alivePlanes[i];

		plane.chooseAction(pipes);
		plane.update();

		if (plane.checkCollision()) {
			alivePlanes.splice(i, 1);
		}
	}

	frameCounter++;

	for (let i = 0; i < alivePlanes.length; i++) {
		alivePlanes[i].show();
	}
	if (alivePlanes.length == 0) {
		generation++;
		generationSpan.html(generation);
		createNextGeneration();
	}
}
