import * as React from 'react'
import { useEffect } from 'react'
import * as p5 from 'p5'
import { Bird } from '../bird';
import Pipe from '../pipe';
import { generateNextGenAlt } from '../ga';

const sketch = (p: p5): void => {
    let generation = 0
    let deadCount = 0;
    const TOTAL = 50;
    let slider: p5.Element;
    let birds : Bird[] = [];
    let counter = 0;
    let pipes : Pipe[] = [];
    let savedBirds : Bird[] = [];
    let fittest = 0;

    p.setup = (): void => {
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.createSpan("Generations: 0").id("#count").position(20, 20).style('color', '#fff').style('font-size', '30px')
        p.createSpan("Alive: ?").id("#alive").position(20, 60).style('color', '#fff').style('font-size', '30px')
        p.createSpan("Fittest").id("#fittest").position(20, 100).style('color', '#fff').style('font-size', '30px')
        slider = p.createSlider(1, 10, 1);
        for (let i = 0; i < TOTAL; i++) {
            birds.push(new Bird(p));
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
                pipes[i].show(p);
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
                    deadCount += 1
                    document.getElementById("#alive").innerHTML = `Alive: ${TOTAL - deadCount}`
                    savedBirds.push(birds.splice(i, 1)[0]);
                }
            }
      
            for (const bird of birds) {
                bird.update(p, pipes);
            }
            

            if (birds.length === 0) {
              counter = 0;
              for (let i = savedBirds.length - 1; i >= 0; i--) {
                if (fittest < savedBirds[i].fitness) {
                    fittest = savedBirds[i].fitness
                    console.log(savedBirds[i].fitness)
                    document.getElementById("#fittest").innerHTML = `Fittest: ${Math.round(fittest * 100) / 100}`
                }
            }
            birds = generateNextGenAlt(p, savedBirds);
            savedBirds = []
            pipes = [];
            generation += 1
            deadCount = 0
            document.getElementById("#count").innerHTML = `Generations: ${generation}`
            return
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