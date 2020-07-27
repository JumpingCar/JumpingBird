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
    pipes : Pipe[]

    constructor(p: p5) {
        this.dead = false
        this.y = this.height / 2;
        this.x = 64;
        this.height = p.windowHeight
        this.gravity = 0.8;
        this.lift = -12;
        this.velocity = 0;
        this.score = 0;
        this.fitness = 0;
        this.network = new NeuralNetwork(this.raySensor.length, 6, 1)
    }

    show(p: p5) : void {
      p.stroke(255);
      p.fill(255, 100);
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
        return output.matrix[0][0] > 0.5
    }

    update(p: p5) : void {
        const output = this.network.feedforward(this.raySensor)
        const decision = Bird.adjust(output)
        if (!this.dead) {
            if (decision) {
                this.up()
            }
        }
        this.show(p)
        this.look(p, this.pipes)
        this.score++;
        this.velocity += this.gravity;
        this.y += this.velocity;
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
        this.raySensor[0] = closestD
        this.raySensor[1] = closest.top + (closest.space / 2)
    }

    applyGenes(genes: number[]): void {
        this.network.importGenes(genes)
    }

    offScreen() : boolean {
        return (this.y > this.height || this.y < 0);
      }
  }
