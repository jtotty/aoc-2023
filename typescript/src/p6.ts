import fs from 'fs';

type Race = {
    time: number,
    distance: number,
};

function run(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf-8').trim();
    const races: Race[] = parseData(data);

    const tick = performance.now();

    let answer = 1;
    for (const race of races) {
        answer *= numWaysToBeatQuadratic(race);
    }

    console.log(`Time: ${performance.now() - tick} ms`);
    console.log(answer);
}

function parseData(data: string): Race[] {
    let races = [];

    const lines = data.split('\n');
    const times = lines[0].match(/\d+/g)?.map(Number);
    const distances = lines[1].match(/\d+/g)?.map(Number);

    if (times && distances) {
        for (let i = 0; i < times.length; i++) {
            races.push({
                time: times[i],
                distance: distances[i],
            });
        }
    }

    return races;
}

function numWaysToBeat(race: Race): number {
    let beatenCount = 0;
    let distance = 0;

    for (let btnPressDuration = 0; btnPressDuration < race.time; btnPressDuration++) {
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
