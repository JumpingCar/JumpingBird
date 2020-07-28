// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

import * as p5 from "p5"

// Neuro-Evolution Flappy Bird

export class User {
    x: number
    y: number
    gravity: number
    lift: number
    velocity: number
    height: number
    score: number
    fitness: number
    dead: boolean
    wasTop: number

    constructor(p: p5) {
        this.reset(p)
    }

    show(p: p5): void {
        p.noStroke();
        p.fill(255, 0, 0);
        p.ellipse(this.x, this.y, 32, 32);
    }

    up(): void {
        this.velocity += this.lift;
    }

    update(p: p5): void {
        if (!this.dead) {
            this.show(p)
            this.score++;
            this.velocity += this.gravity;
            this.y += this.velocity;
        }
    }

    offScreen(): boolean {
        return (this.y > this.height || this.y < 0);
    }

    reset(p: p5): void {
        this.dead = false
        this.x = p.width / 2;
        this.height = p.height
        this.y = this.height / 2
        this.gravity = 0.8;
        this.lift = -12;
        this.velocity = 0;
        this.score = 0;
        this.fitness = 0;
    }
}
