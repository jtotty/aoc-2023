import fs from 'fs';

type Almanac = {
    [key: string]: Record<'drs'|'srt'|'rl', number>[],
};

function run(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf-8').trim();

    let [seeds, almanac] = parseData(data);

    // const tick01 = performance.now();
    // const lowestLocation01 = findLowestLocation(seeds, almanac);
    // console.log(`Took: ${performance.now() - tick01} ms`);
    // console.log(lowestLocation01);

    const seedRanges = findSeedRanges(seeds);
    console.log(seedRanges);

    const tick02 = performance.now();

    let lowestLocation02 = -1;
    seedRanges.forEach((seedRange) => {
        for (let i = seedRange.start; i <= seedRange.start + seedRange.range; i++) {
            const loc = findLocation(i, almanac);

            if (lowestLocation02 === -1) {
                lowestLocation02 = loc;
            } else {
                lowestLocation02 = loc < lowestLocation02 ? loc : lowestLocation02;
            }
        }
    });

    console.log(`Took: ${performance.now() - tick02} ms`);
    console.log(lowestLocation02);
}

function parseData(data: string): [number[], Almanac] {
    const parts = data.split('\n\n');
    const almanac: Almanac = {};

    const seeds = parts[0].split(': ')[1].match(/\d+/g)?.map((num) => Number(num)) || [];

    for (let i = 1; i < parts.length; i++) {
        let [key, map] = parts[i].split(':\n');
        const mapRows = map.split('\n');

        key = key.replace(' map', '');
        almanac[key] = [];

        mapRows.forEach((row) => {
            const values = row.split(' ');
            almanac[key].push({
                'drs': Number(values[0]),
                'srt': Number(values[1]),
                'rl': Number(values[2]),
            });
        });
    }

    return [seeds, almanac];
}

function findLowestLocation(seeds: number[], almanac: Almanac): number {
    let lowestLocation: number | undefined;

    seeds.forEach((seed) => {
        let currMapVal = seed;

        for (let [key, maps] of Object.entries(almanac)) {
            let mapFound = false;

            for (let map of maps) {
                if (mapFound) break;
                if (map.srt <= currMapVal && map.srt + map.rl >= currMapVal) {
                    const offset = map.srt - map.drs;
                    currMapVal -= offset;
                    mapFound = true;
                }
            }

            if (key === 'humidity-to-location') {
                if (lowestLocation === undefined) {
                    lowestLocation = currMapVal;
                } else {
                    lowestLocation = currMapVal < lowestLocation ? currMapVal : lowestLocation;
                }
            }
        }
    });

    return lowestLocation || -1;
}

function findLocation(seed: number, almanac: Almanac ): number {
    let currMapVal = seed;

    for (let [key, maps] of Object.entries(almanac)) {
        let mapFound = false;

        for (let map of maps) {
            if (mapFound) break;
            if (map.srt <= currMapVal && map.srt + map.rl >= currMapVal) {
                const offset = map.srt - map.drs;
                currMapVal -= offset;
                mapFound = true;
            }
        }

        if (key === 'humidity-to-location') {
            return currMapVal;
        }
    }

    return currMapVal;
}

function findSeedRanges(seeds: number[]) {
    let parsed: Record<string, number>[] = [];
    let start = -1;
    let range = -1;

    for (let i = 0; i < seeds.length; i++) {
        if (i % 2 === 0) {
            start = seeds[i];
        } else {
            range = seeds[i];
        }

        if (start > -1 && range > -1) {
            parsed.push({ start, range });
            start = -1;
            range = -1;
        }
    }

    return parsed;
}

run('../data/p5/test.txt');
