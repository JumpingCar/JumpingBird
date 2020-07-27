import * as p5 from "p5"
import NeuralNetwork from "./neuralnetwork"
import { Bird } from "./bird"



export function generateNextGenAlt(p: p5, birds: Bird[]): void {
    const sorted = birds.sort((p1: { fitness: number }, p2: { fitness: number }) => p2.fitness - p1.fitness)

    const topCount = 4
    const randomCount = 6
    const offspringCount = 20
    const softMutationCount = 10
    const hardMutationCount = 10

    const topParents = [...Array(topCount).keys()].map(idx => sorted[idx].network.exportGenes())
    const random = [...Array(randomCount).keys()].map(_ => (new NeuralNetwork(2, 6, 1)).exportGenes())

    const parentPairs = Bird.selection(this.cars, (offspringCount + hardMutationCount + softMutationCount) / 2)
    const offsprings: number[][] = parentPairs.reduce((nextgen, pair) => {
        const children: number[][] = NeuralNetwork.crossover(pair[0].network, pair[1].network)
        return [...nextgen, ...children]
    }, [] as number[][])

    for (let i = 0; i < hardMutationCount; i++)
        NeuralNetwork.mutateOne(offsprings[i], 0.2)

    for (let i = 0; i < softMutationCount; i++)
        NeuralNetwork.mutateOne(offsprings[hardMutationCount + i], 0.05)

    const children = [...topParents, ...random, ...offsprings]
    for (let i = 0; i < 50; i++) {
        birds[i].applyGenes(children[i])
    }

}
