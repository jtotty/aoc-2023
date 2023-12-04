import fs from 'fs';

type PartPositions = { value: number, start: number, end: number };

class Symbol {
    x: number;
    y: number;
    numbers: number[];

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.numbers = [];
    }

    addNumber(num: number) {
        this.numbers.push(num);
    }

    productOfNumbers(): number {
        if (this.numbers.length > 1) {
            return this.numbers.reduce((prod, n) => prod * n, 1);
        }

        return 0;
    }
}

const regexNumPattern = new RegExp(/\d+/g);

function run(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

    const tick01 = performance.now();
    const part1Sum = parseDataPart1(data);
    console.log(`Part 1: ${performance.now() - tick01} ms`);
    console.log(part1Sum);

    const tick02 = performance.now();
    const part2Sum = parseDataPart2(data);
    console.log(`Part 2: ${performance.now() - tick02} ms`);
    console.log(part2Sum);
}

function parseDataPart1(lines: string[]): number {
    const partPositions: PartPositions[] = [];
    let match: RegExpExecArray|null = null;
    let sum = 0;

    for (let row = 0; row < lines.length; row++) {
        // Find all the numbers in the current row
        while ((match = regexNumPattern.exec(lines[row])) !== null) {
            partPositions.push({
                value: Number(match[0]),
                start: match.index,
                end: regexNumPattern.lastIndex - 1,
            });
        }

        // Check all coordinates surrounding each number for a symbol
        // If found mark as a valid number and check the next number
        for (let part of partPositions) {
            let validPart = false;

            for (let i = row - 1; i <= row + 1; i++) {
                if (i === -1 || i === lines.length) continue;

                for (let j = part.start - 1; j <= part.end + 1; j++) {
                    if ((j >= 0 && j < lines[row].length) && (lines[i][j] !== '.' && isNaN(Number(lines[i][j])))) {
                        validPart = true;
                        break;
                    }
                }

                if (validPart) break;
            }

            if (validPart) sum += part.value;
        }

        partPositions.length = 0;
    }

    return sum;
}

function parseDataPart2(lines: string[]): number {
    let symbols: Symbol[] = [];
    let partPositions: PartPositions[] = [];
    let match: RegExpExecArray|null = null;

    for (let row = 0; row < lines.length; row++) {
        // Find all the numbers in the current row
        while ((match = regexNumPattern.exec(lines[row])) !== null) {
            partPositions.push({
                value: Number(match[0]),
                start: match.index,
                end: regexNumPattern.lastIndex - 1,
            });
        }

        for (let part of partPositions) {
            let validPart = false;

            for (let i = row - 1; i <= row + 1; i++) {
                if (i === -1 || i === lines.length) continue;

                for (let j = part.start - 1; j <= part.end + 1; j++) {
                    if ((j >= 0 && j < lines[row].length) && lines[i][j] === '*') {
                        let symbol = symbols.find((s) => s.x === i && s.y === j);

                        if (symbol) {
                            symbol.addNumber(part.value);
                        } else {
                            symbol = new Symbol(i, j);
                            symbol.addNumber(part.value);
                            symbols.push(symbol);
                        }

                        validPart = true;
                        break;
                    }
                }

                if (validPart) break;
            }
        }

        partPositions.length = 0;
    }

    return symbols.reduce((sum, symbol) => sum + symbol.productOfNumbers(), 0);
}

run('../data/p3/data.txt');
