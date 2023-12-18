import fs from 'fs';

type ValueMap = {
    from: string,
    to: string,
    map: {
        dest: number,
        src: number,
        range: number,
    }[],
};

type Almanac = Record<string, ValueMap>;
type SeedRange = { start: number, range: number };

let almanac: Almanac;

function run(filePath: string) {
    const contents = fs.readFileSync(filePath, 'utf-8').trim().split('\n\n');
    const seedData = contents.shift()?.split(': ')[1].split(' ');
    const seeds: SeedRange[] = [];

    if (seedData) {
        for (let i = 0; i < seedData.length; i += 2) {
            seeds.push({
                start: Number(seedData[i]),
                range: Number(seedData[i + 1]),
            });
        }
    }

    const parsed = contents.map(parseMap);
    for (const p of parsed) {
        p.map = createNegativeRanges(p.map);
    }

    almanac = parsed.reduce((acc, x) => {
        acc[x.from] = x;
        return acc;
    }, {} as Almanac);

    const tick = performance.now();
    let lowestLocation = Infinity;
    for (const seed of seeds) {
        let start = seed.start;
        let remaining = seed.range;

        while (remaining > 0) {
            const [startLocation, consumed] = walkMap(start, remaining, 'seed')
            start += consumed;
            remaining -= consumed;

            if (startLocation < lowestLocation) {
                lowestLocation = startLocation;
            }
        }
    }

    console.log(`Took: ${performance.now() - tick} ms`);
    console.log(lowestLocation);
}

function createRange(line: string) {
    const items = line.split(' ');

    const range = {
        dest: Number(items[0]),
        src: Number(items[1]),
        range: Number(items[2]),
    };

    return range;
}

function createNegativeRanges(ranges: ValueMap['map']) {
    ranges.sort((a, b) => a.src - b.src);

    let start = 0;
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        if (range.src > start) {
            ranges.splice(i, 0, {
                dest: start,
                src: start,
                range: range.src - start,
            });
            i++;
        }

        start = range.src + range.range;
    }

    return ranges;
}

function parseMap(data: string): ValueMap {
    const contents = data.split('\n');
    const [from, _, to] = contents.shift()?.split(' ')[0].split('-') as string[];

    return {
        from,
        to,
        map: contents.map(createRange),
    };
}

function walkMap(value: number, range: number, name: string): [number, number] {
    if (name === 'location') {
        return [value, range];
    }

    const currMap = almanac[name];
    const rangeMap = currMap.map.find(x => x.src <= value && x.src + x.range > value);

    if (rangeMap) {
        const diff = value - rangeMap.src;
        const mappedValue = rangeMap.dest + diff;
        return walkMap(mappedValue, Math.min(range, rangeMap.range - diff), currMap.to);
    }

    return walkMap(value, 1, currMap.to);
}

run('../data/p5/data.txt');
