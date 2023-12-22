import fs from 'fs';

type Node = { name: string, L: string, R: string };
type NodeMap = Map<string, Node>;
type Instruction = 'L' | 'R';

// run('../data/p8/test.txt');
run('../data/p8/data.txt');

function run(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
    const [instructions, nodes] = parseData(data);

    // Part 01
    // const tick = performance.now();
    // const steps = calculateSteps01(instructions, nodes, 'AAA');
    // console.log(steps);
    // console.log(`${(performance.now() - tick)} ms`);

    // Part 02
    const tick02 = performance.now();
    const steps02 = calculatedSteps02(instructions, nodes);
    console.log(`${(performance.now() - tick02)} ms`);
    console.log(steps02);
}

function parseData(data: string[]): [Instruction[], NodeMap] {
    const instructions = data[0].split('') as Instruction[];
    const nodes = new Map<string, Node>();

    for (let i = 2; i < data.length; i++) {
        const [name, leftRight] = data[i].split(' = ');
        const [left, right] = leftRight.replace(/\(|\)/g, '').split(', ');

        nodes.set(name, {
            name,
            L: left,
            R: right,
        });
    }

    return [instructions, nodes];
}

function calculateSteps01(instructions: Instruction[], nodeMap: NodeMap, startingNodeName: string) {
    let currentNode = nodeMap.get(startingNodeName);
    let iPointer = 0;
    let steps = 0;

    if (!currentNode) {
        throw new Error('Invalid starting node');
    }

    while (currentNode.name !== 'ZZZ') {
        const nextNode = nodeMap.get(currentNode[instructions[iPointer]]);

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

    return steps;
}

function calculatedSteps02(instructions: Instruction[], nodeMap: NodeMap) {
    const currNodes: Node[] = [];

    for (const [name, node] of nodeMap.entries()) {
        if (name[2] === 'A') {
            currNodes.push(node);
        }
    }

    const nodesLength = currNodes.length;

    let steps = 0;
    let iPointer = 0;
    let zCount = 0;

    while (true) {
        currNodes.forEach((node) => {
            const nextNode = nodeMap.get(node[instructions[iPointer]]);

            if (nextNode) {
                currNodes.push(nextNode);

                if (nextNode.name[2] === 'Z') {
                    zCount++;
                }
            }
        });

        steps++;

        if (zCount === nodesLength) {
            break;
        }

        if (currNodes.length === nodesLength * 2) {
            currNodes.splice(0, nodesLength);
        }

        if (iPointer === instructions.length - 1) {
            iPointer = 0;
        } else {
            iPointer++;
        }
    }

    return steps;
}
