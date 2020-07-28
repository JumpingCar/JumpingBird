// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

import * as p5 from "p5"
import Matrix from "./matrix"
import NeuralNetwork from "./neuralnetwork"
import Pipe from "./pipe"

// Neuro-Evolution Flappy Bird

export class Bird {

    x : number
    y : number
    gravity : number
    lift : number
    velocity : number
    height : number
    score : number
    fitness : number
    network : NeuralNetwork
    raySensor : number[]
    dead : boolean
    cool : number
    jumping : boolean
    inputs : number[]
    wasTop : number

    constructor(p: p5) {
        this.reset(p)
        this.network = new NeuralNetwork(5, 5, 2)
    }

    show(p: p5) : void {
      p.noStroke();
      p.fill(255);
      p.ellipse(this.x, this.y, 32, 32);
    }

    up() : void {
      this.velocity += this.lift;
    }

    static selection(birds: Bird[], pairs: number): Bird[][] {
        const maxFitness = birds.reduce((acc, cur) => Math.max(acc, cur.fitness), -1)

        // car of highest fitness gets 10 quotas
        const fitnessList = birds.reduce((list, car, idx) => {
            const quota = Math.floor(car.fitness / maxFitness * 10)
            return [ ...list, ...Array(quota).fill(idx) ]
        }, [])

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Array(pairs).fill(0).reduce((acc, _) => {
            const mom = fitnessList[Math.floor(Math.random() * fitnessList.length)]
            const dad = fitnessList[Math.floor(Math.random() * fitnessList.length)]
            return [ ...acc, [birds[mom], birds[dad]] ]
        }, [])
    }

    static adjust(output: Matrix): boolean {
        return output.matrix[0][0] > output.matrix[1][0]
    }

    update(p: p5, pipes: Pipe[]) : void {
        if (!this.dead) {
            this.look(p, pipes)
            const output = this.network.feedforward(this.raySensor)
            const decision = Bird.adjust(output)
            if (decision) {
                this.up()
                this.jumping = true
            }

            this.show(p)
            this.score++;
            this.velocity += this.gravity;
            this.y += this.velocity;
        }
}

    look(p: p5, pipes: Pipe[]) : void {
        let closest = null;
        let closestD = Infinity;
        for (let i = 0; i < pipes.length; i++) {
            const d = (pipes[i].x + pipes[i].width) - this.x;
            if (d < closestD && d > 0) {
                closest = pipes[i];
                closestD = d;
            }
        }
        this.raySensor[0] = closestD / p.width
        this.raySensor[1] = (closest.top + (closest.space / 2)) / p.height
        this.raySensor[2] = (closest.bottom + (closest.space / 2)) / p.height
        this.raySensor[3] = this.velocity / 10;
        this.raySensor[4] =  this.y / p.height;

        this.inputs = [];
        this.inputs[0] = this.y / p.height;
        this.inputs[1] = closest.top / p.height;
        this.inputs[2] = closest.bottom / p.height;
        this.inputs[3] = closest.x / p.width;
        this.inputs[4] = this.velocity / 10;
        }

    applyGenes(genes: number[]): void {
        this.network.importGenes(genes)
    }

    offScreen() : boolean {
        return (this.y > this.height || this.y < 0);
      }
    reset(p: p5) : void {
        this.dead = false
        this.x = 1500;
        this.height = p.height
        this.y = this.height / 2
        this.gravity = 0.8;
        this.lift = -12;
        this.velocity = 0;
        this.score = 0;
        this.fitness = 0;
        this.raySensor = new Array(4).fill(-50)
        this.cool = 0
        this.jumping = false
        this.inputs = new Array(5).fill(-50)
        this.wasTop = 0;
    }
  }
