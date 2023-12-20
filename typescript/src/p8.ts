import fs from 'fs';

type Node = { name: string, L: string, R: string };
type NodeMap = Map<string, Node>;

const data = fs.readFileSync('../data/p8/data.txt', 'utf-8').trim().split('\n');

const [instructions, nodes] = parseData(data);

const tick = performance.now();
const steps = calculateSteps(instructions, nodes, 'AAA');
console.log(steps);
console.log(`${(performance.now() - tick)} ms`);

function parseData(data: string[]): [string[], NodeMap] {
    const instructions = data[0].split('');
    const nodes = new Map<string, Node>();

    for (let i = 2; i < data.length; i++) {
        const [name, leftRight] = data[i].split(' = ');
        const [left, right] = leftRight.replace(/\(|\)/g, '').split(', ');
        nodes.set(name, { name, L: left, R: right });
    }

    return [instructions, nodes];
}

function calculateSteps(instructions: string[], nodeMap: NodeMap, startingNode: string) {
    let currentNode = nodeMap.get(startingNode);
    let iPointer = 0;
    let steps = 0;

    if (currentNode) {
        while (currentNode.name !== 'ZZZ') {
            const instruction = instructions[iPointer] as 'L' | 'R';
            const nextNode = nodeMap.get(currentNode[instruction]);

            if (nextNode) {
                currentNode = nextNode;

                if (iPointer === instructions.length - 1) {
                    iPointer = 0;
                } else {
                    iPointer++;
                }

                steps++;
            }
        }
    }

    return steps;
}
