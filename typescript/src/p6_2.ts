import fs from 'fs';

type Race = {
    time: number,
    distance: number,
};

function run(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf-8').trim();
    const race = parseData(data);
    console.log(race);

    const tick = performance.now();
    const answer = numWaysToBeat(race);
    console.log(`Time: ${performance.now() - tick} ms`);
    console.log(answer);

    const tick02 = performance.now();
    const answer02 = numWaysToBeatQuadratic(race);
    console.log(`Time: ${performance.now() - tick02} ms`);
    console.log(answer02);
}

function parseData(data: string): Race {
    const lines = data.split('\n');
    const time = lines[0].match(/\d+/g)?.join('') as string;
    const distance = lines[1].match(/\d+/g)?.join('') as string;

    return { time: +time, distance: +distance };
}

function numWaysToBeat(race: Race): number {
    let beatenCount = 0;
    let distance = 0;

    // Zero btn press duration is always zero distance - can start at 1
    for (let btnPressDuration = 1; btnPressDuration < race.time; btnPressDuration++) {
        const remainingtime = race.time - btnPressDuration;
        distance = btnPressDuration * remainingtime;

        if (distance > race.distance) {
            beatenCount++;
        }
    }

    return beatenCount;
}

/**
 * Using the Quadratic formula to solve d = (t - x) * x
 * rather than iterating through all possible button press durations.
 */
function numWaysToBeatQuadratic(race: Race): number {
    const numToSqrt = Math.pow(race.time, 2) - 4 * 1 * race.distance;
    let lowerLimit = race.time / 2 - Math.sqrt(numToSqrt) / 2;
    let upperLimit = race.time / 2 + Math.sqrt(numToSqrt) / 2;

    if (lowerLimit % 2 === 0) {
        lowerLimit++;
    } else {
        lowerLimit = Math.ceil(lowerLimit);
    }

    if (upperLimit % 2 !== 0) {
        upperLimit = Math.ceil(upperLimit);
    }

    return upperLimit - lowerLimit;
}

run('../data/p6/data.txt');
