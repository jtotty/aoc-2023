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
        answer *= numWaysToBeat(race);
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

run('../data/p6/data.txt');
