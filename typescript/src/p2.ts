import fs from 'fs';

enum TOTAL_CUBES { red = 12, green = 13, blue = 14 };
type CubeColors = keyof typeof TOTAL_CUBES;

function run(filePath: string) {
    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

    const tick = performance.now();

    const games = parseGamesPart1(lines);
    const sum = games.reduce((acc, game) => acc + game, 0);

    console.log(`Time: ${performance.now() - tick} ms`);
    console.log(sum);
}

function parseGamesPart1(lines: string[]): number[] {
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

// ~ 0.7545 ms
// ~ 0.699 ms
run('../../data/p2/data.txt');
