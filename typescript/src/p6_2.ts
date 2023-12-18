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

run('../data/p6/data.txt');
