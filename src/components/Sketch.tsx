import * as React from 'react'
import { useEffect } from 'react'
import * as p5 from 'p5'
import { Bird } from '../bird';
import Pipe from '../pipe';
import { generateNextGenAlt } from '../ga';

const sketch = (p: p5): void => {
    let slider: p5.Element;
    const TOTAL = 50;
    const birds : Bird[] = [];
    let counter = 0;
    let pipes : Pipe[] = [];
    const savedBirds : Bird[] = [];

    p.setup = (): void => {
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.createSpan("Generations: 0").id("#count").position(20, 20).style('color', '#fff').style('font-size', '30px')
        p.createSpan("Alive: ?").id("#alive").position(20, 60).style('color', '#fff').style('font-size', '30px')
        p.createSpan("Fittest").id("#fittest").position(20, 100).style('color', '#fff').style('font-size', '30px')
        slider = p.createSlider(1, 10, 1);
        for (let i = 0; i < TOTAL; i++) {
            birds[i] = new Bird(p);
        }    
    }

    p.draw = (): void => {
        p.background(50)
        for (let n = 0; n < slider.value(); n++) {
            if (counter % 75 == 0) {
              pipes.push(new Pipe(p));
            }
            counter++;
        
            for (let i = pipes.length - 1; i >= 0; i--) {
              pipes[i].update();
        
              for (let j = birds.length - 1; j >= 0; j--) {
                if (pipes[i].hits(birds[j])) {
                  birds[j].dead = true;
                }
              }
        
              if (pipes[i].offscreen(p)) {
                pipes.splice(i, 1);
              }
            }
        
            for (let i = birds.length - 1; i >= 0; i--) {
                if (birds[i].offScreen() || birds[i].dead) {
                    savedBirds.push(birds.splice(i, 1)[0]);              
                    }
                }
        
            for (const bird of birds) {
              bird.update(p);
            }
        
            if (birds.length === 0) {
              counter = 0;
              generateNextGenAlt(p, savedBirds);
              pipes = [];
            }
          }
    }
}

const Sketch: React.FC = () => {
    const container: React.RefObject<HTMLDivElement> = React.createRef()

    useEffect(() => {
        const canvas = new p5(sketch, container.current)

        return () => { canvas.remove() }
    }, [])

    return <div id="container" ref={container} />
}

export default Sketch