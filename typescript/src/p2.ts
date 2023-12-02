import fs from 'fs';
import { sumValues } from './utils';

enum TOTAL_CUBES { red = 12, green = 13, blue = 14 };
type CubeColors = keyof typeof TOTAL_CUBES;

function run(filePath: string) {
    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

    const tick01 = performance.now();
    const games01 = parseGamesPart1(lines);
    const sum = sumValues(games01);
    console.log(`Time Part01: ${performance.now() - tick01} ms`);
    console.log(sum);

    const tick02 = performance.now();
    const games02 = parseGamesPart2(lines);
    const powerSum = sumValues(games02);
    console.log(`Time Part02: ${performance.now() - tick02} ms`);
    console.log(powerSum);
}

export function parseGamesPart1(lines: string[]): number[] {
    const games = lines.map((line, index) => {
        let gameIsValid = true;
        const sets = line.split(': ')[1];

        sets.split(/, |; /).every((cube) => {
            const [count, color] = cube.split(' ');

            if (TOTAL_CUBES[color as CubeColors] < Number(count)) {
                gameIsValid = false;
                return false;
            }

            return true;
        });

        if (gameIsValid) {
            return index + 1;
        }

        return 0;
    });

    return games;
}

export function parseGamesPart2(lines: string[]): number[] {
    const totalGamesPower = lines.map((line) => {
        const sets = line.split(': ')[1];
        const colorCounts = { red: 0, green: 0, blue: 0 };

        sets.split(/, |; /).forEach((cube) => {
            const [count, color] = cube.split(' ');

            if (Number(count) > colorCounts[color as CubeColors]) {
                colorCounts[color as CubeColors] = Number(count);
            }
        });

        return colorCounts.red * colorCounts.green * colorCounts.blue;
    });

    return totalGamesPower;
}

run('../../data/p2/data.txt');
