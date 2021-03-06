import * as React from 'react'
import { useEffect } from 'react'
import * as p5 from 'p5'
import { Bird } from '../bird';
import Pipe from '../pipe';
import { generateNextGenAlt, calculateFitness } from '../ga';
import { User } from '../user';

const sketch = (p: p5): void => {
    let generation = 0
    let deadCount = 0;
    const TOTAL = 500;
    let slider: p5.Element;
    let birds : Bird[] = [];
    let counter = 0;
    let pipes : Pipe[] = [];
    let savedBirds : Bird[] = [];
    let fittest = 0;
    let user : User;

    p.setup = (): void => {
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.createSpan("Generations: 0").id("#count").position(20, 20).style('color', '#fff').style('font-size', '30px')
        p.createSpan("Alive: 500").id("#alive").position(20, 60).style('color', '#fff').style('font-size', '30px')
        p.createSpan("Fittest: 0").id("#fittest").position(20, 100).style('color', '#fff').style('font-size', '30px')
        p.createSpan("User Score: 0").id("#score").position(20, 140).style('color', '#fff').style('font-size', '30px')
        slider = p.createSlider(1, 10, 1).id('#slider');
        for (let i = 0; i < TOTAL; i++) {
            birds.push(new Bird(p));
        }
        user = new User(p)
        const importButton = p.select('#gene-import')
        const geneEditor = p.select('#gene-editor-textarea')
        importButton.mouseClicked(() => {
            if (geneEditor.value() === '')
                return

            const importValue = geneEditor.value().toString()
            const genes = importValue.split('\n').map(row => row.split(' ').map(val => parseFloat(val)))
            user.reset(p)
            counter = 0
            pipes = []
            pipes.push(new Pipe(p));
            counter++
            deadCount = 0
            generation = 0
            birds = [...birds, ...savedBirds]
            savedBirds = []
    
            birds.forEach((bird, idx) => { 
                bird.applyGenes(genes[idx])
                bird.reset(p) 
            })
        })

        const exportButton = p.select('#gene-export')
        exportButton.mouseClicked(() => {
            console.log(birds.length)
            const exportValue = [ ...birds, ...savedBirds ].map(bird => bird.network.exportGenes().join(' ')).join('\n')
            geneEditor.value(exportValue)
        })
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
                if ( pipes[i].hitsForUser(user)) {
                    user.dead = true;
                }

                if (pipes[i].offscreen(p)) {
                    pipes.splice(i, 1);
                }
            }
        
            for (let i = birds.length - 1; i >= 0; i--) {
                if (birds[i].dead || birds[i].offScreen()) {
                    deadCount += 1
                    document.getElementById("#alive").innerHTML = `Alive: ${TOTAL - deadCount}`
                    savedBirds.push(birds.splice(i, 1)[0]);
                }
            }
            if (user.offScreen()){
                user.dead = true;
            }

            for (const bird of birds) {
                bird.update(p, pipes);
            }
            user.update(p);

            if (birds.length !== 0) 
                birds[0].network.show(p)

            if (birds.length === 0 && user.dead) {
                counter = 0;
                calculateFitness(p, savedBirds);
                fittest = 0
                for (let i = savedBirds.length - 1; i >= 0; i--) {
                    if (fittest < savedBirds[i].fitness) {
                        fittest = savedBirds[i].fitness
                        document.getElementById("#fittest").innerHTML = `Fittest: ${Math.round(fittest * 100) / 100}`
                    }
                }
                document.getElementById("#score").innerHTML = `User Score: ${Math.round(user.score * 100) / 100}`
                birds = generateNextGenAlt(p, savedBirds);
                user.reset(p)
                savedBirds = []
                pipes = [];
                generation += 1
                deadCount = 0
                document.getElementById("#count").innerHTML = `Generations: ${generation}`
            }
        }
    }

    p.keyPressed = (): void => { 
        if (p.key === ' ') {
            user.up();
        } else if (p.key === 'q') {
            user.reset(p)
            counter = 0
            pipes = []
            pipes.push(new Pipe(p));
            counter++
            deadCount = 0
            generation = 0
            birds = [...birds, ...savedBirds]
            savedBirds = []
            birds.forEach(bird => { bird.reset(p) })
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