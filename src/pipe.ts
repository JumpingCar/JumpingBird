// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

import * as p5 from "p5"
import { Bird } from "./bird"

export default class Pipe {
    height : number
    space : number
    top : number
    bottom : number
    width : number
    x : number
    speed : number

    constructor (p: p5) {
        this.reset(p)
    }

    hits(bird : Bird) : boolean {
        if (bird.y < this.top || bird.y > this.top + this.space) {
            if (bird.x > this.x && bird.x < this.x + this.width) {
                return true;
            }
        }
        return false;
    }

    makeRandom(min : number, max : number) : number{
        const RandVal = Math.floor(Math.random()*(max-min+1)) + min;
        return RandVal;
    }

    show(p: p5) : void {
        p.stroke(107, 164, 255);
        p.strokeWeight(4);
        p.noFill();
        p.rectMode(p.CORNER);
        p.rect(this.x, 0, this.width, this.top);
        p.rect(this.x, this.top + this.space, this.width, this.bottom);
    }

    update() : void {
        this.x -= this.speed;
    }

    offscreen(p: p5) : boolean {
        return this.x < - p.windowWidth / 2;
    }

    reset(p: p5) : void {
        this.space = 250
        this.height = p.height
        this.top = this.makeRandom( this.height / 6, 3 / 4 * this.height )
        this.bottom = this.height - (this.top + this.space)
        this.width = 80
        this.x = p.width
        this.speed = 6;
    }

}
