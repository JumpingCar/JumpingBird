import * as p5 from "p5"
import NeuralNetwork from "./neuralnetwork"
import { Bird } from "./bird"



export function generateNextGenAlt(p: p5, birds: Bird[]): Bird[] {
    calculateFitness(p, birds);
    const sorted = birds.sort((p1: { fitness: number }, p2: { fitness: number }) => p2.fitness - p1.fitness)
    const topCount = 40
    const randomCount = 60
    const offspringCount = 200
    const softMutationCount = 100
    const hardMutationCount = 100

    const topParents = [...Array(topCount).keys()].map(idx => sorted[idx].network.exportGenes())
    const random = [...Array(randomCount).keys()].map(_ => (new NeuralNetwork(5, 5, 2)).exportGenes())

    const parentPairs = Bird.selection(birds, (offspringCount + hardMutationCount + softMutationCount) / 2)
    const offsprings: number[][] = parentPairs.reduce((nextgen, pair) => {
        const children: number[][] = NeuralNetwork.crossover(pair[0].network, pair[1].network)
        return [...nextgen, ...children]
    }, [] as number[][])

    for (let i = 0; i < hardMutationCount; i++)
        NeuralNetwork.mutateOne(offsprings[i], 0.2)

    for (let i = 0; i < softMutationCount; i++)
        NeuralNetwork.mutateOne(offsprings[hardMutationCount + i], 0.05)

    const children = [...topParents, ...random, ...offsprings]
    for (let i = 0; i < birds.length; i++) {
        birds[i].applyGenes(children[i])
        birds[i].reset(p)
    }
    return birds
}

export function calculateFitness(p: p5, savedBirds: Bird[]): void {
    for (const bird of savedBirds)
        bird.fitness = bird.score

  }
