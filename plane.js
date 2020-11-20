class Plane {
    constructor(brain) {
        this.x = bg.width / 2;
        this.y = bg.height / 2;
        this.width = planeImg.width;
        this.height = planeImg.height;
        this.speed = 5.0;
        this.rotation = 0.0;

        // How many frames the bird stays alive
        this.score = 0;

        // The fitness of the bird
        this.fitness = 0;

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(0.1);
        } else {
            // Parameters are number of inputs, number of units in hidden Layer, number of outputs
            this.brain = new NeuralNetwork(5, 8, 1);
        }
    }

    copy() {
        return new Plane(this.brain);
    }

    show() {
        push()
        translate(this.x + this.width / 2, this.y + this.height / 2)
        rotate(radians(this.rotation));
        image(planeImg, -this.width / 2, -this.height / 2);
        rotate(radians(-this.rotation));
        translate(0, 0)
        pop()
    }

    chooseAction() {
        let inputs = [];

        inputs[0] = map(this.x, 0, bg.width, 0, 1);
        inputs[1] = map(this.y, 0, bg.height, 0, 1);
        inputs[2] = map(bg.width - this.x, 0, bg.width, 0, 1);
        inputs[3] = map(bg.height - this.y, 0, bg.height, 0, 1);
        inputs[4] = map(this.rotation, 1, 360, 0, 1);

        const action = this.brain.predict(inputs);
        if (action[0] > 0.75) {
            this.rotateLeft();
        } else if (action[0] > 0.5) {
            this.rotateRight();
        } else {
            this.speed = Math.min(this.speed + 1, 10);
        }
    }

    rotateLeft() {
        this.rotation -= 2;
        this.speed -= 0.1;
        this.normalizeRotation();
    }

    rotateRight() {
        this.rotation += 2;
        this.speed -= 0.1;
        this.normalizeRotation();
    }

    normalizeRotation() {
        if (this.rotation > 360) {
            this.rotation = this.rotation % 360;
        }

        if (this.rotation < 1) {
            this.rotation += 360;
        }
    };

    checkCollision() {
        const leftCollision = this.x <= 0;
        const topCollision = this.y <= 0;
        const rightCollision = this.x + this.width >= bg.width;
        const bottomCollision = this.y + this.height >= bg.height;

        const gotStuck = this.speed <= 0;

        return leftCollision || topCollision || rightCollision || bottomCollision || gotStuck;
    }

    update() {
        this.y -= this.speed * Math.cos(radians(this.rotation));
        this.x += this.speed * Math.sin(radians(this.rotation));
        this.score++;
    }
}
