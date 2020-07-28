// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

import * as p5 from "p5"
import { Bird } from "./bird"
import { User } from "./user"

export default class Pipe {
    height : number
    space : number
    top : number
    topL : number
    midUp : number
    midDown : number
    midL : number
    bottom : number
    bottomL : number
    width : number
    x : number
    speed : number

    constructor (p: p5) {
        this.reset(p)
    }

    hits(bird : Bird) : boolean {
        if (bird.x > this.x && bird.x < this.x + this.width) {
            if (bird.y < this.top || this.midDown > bird.y &&  bird.y > this.midUp || bird.y > this.bottom ) {
                    return true;
            } else if ( this.top < bird.y && bird.y < this.midUp ) {
                if ( bird.wasTop === -1 ) {
                    bird.score *= 1 ;
                }
                bird.wasTop = 1
            } else {
                if ( bird.wasTop === 1 ) {
                    bird.score *= 1 ;
                }
                bird.wasTop = -1
            }

        }
        return false;
    }

    hitsForUser(user : User) : boolean {
        if (user.x > this.x && user.x < this.x + this.width) {
            if (user.y < this.top || this.midDown > user.y &&  user.y > this.midUp || user.y > this.bottom ) {
                return true;
            }
        return false;
        }
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
        p.rect(this.x, 0, this.width, this.topL);
        p.rect(this.x, this.midUp, this.width, this.midL);
        p.rect(this.x, this.bottom, this.width, this.bottomL);
    }

    update() : void {
        this.x -= this.speed;
    }

    offscreen(p: p5) : boolean {
        return this.x < - p.windowWidth / 2;
    }

    reset(p: p5) : void {
        this.height = p.height
        this.space = this.height / 10

        this.topL = this.makeRandom( this.height / 12, 4 / 12 * this.height )
        this.top = this.topL

        this.midUp = this.topL + this.space
        this.midL = this.makeRandom( 2 * this.height / 12, 5 / 12 * this.height )
        this.midDown = this.midUp + this.midL

        this.bottomL = this.height - (this.topL + this.space + this.midL + this.space)
        this.bottom = this.midDown + this.space

        this.width = 80
        this.x = p.width
        this.speed = 6;
    }

}
