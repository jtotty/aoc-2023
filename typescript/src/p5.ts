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

let almanac: Almanac;

function run(filePath: string) {
    const contents = fs.readFileSync(filePath, 'utf-8').trim().split('\n\n');
    const seeds = contents.shift()?.split(': ')[1].split(' ').map(x => Number(x));

    almanac = contents.map(parseMap).reduce((acc, x) => {
        acc[x.from] = x;
        return acc;
    }, {} as Almanac);

    const tick01 = performance.now();
    const locations = [];
    if (seeds) {
        for (const seed of seeds) {
            locations.push(findLocation(seed, 'seed'));
        }
    }

    const lowestVal = locations.sort((a, b) => a - b)[0];
    console.log(`Took: ${performance.now() - tick01} ms`);
    console.log(lowestVal);
}

function createRange(line: string) {
    const items = line.split(' ');

    return {
        dest: Number(items[0]),
        src: Number(items[1]),
        range: Number(items[2]),
    };
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

function findLocation(value: number, name: string) {
    if (name === 'location') {
        return value;
    }

    const currMap = almanac[name];
    const range = currMap.map.find(x => x.src <= value && x.src + x.range >= value);

    if (range) {
        const mappedValue = value - (range.src - range.dest);
        return findLocation(mappedValue, currMap.to);
    }

    return findLocation(value, currMap.to);
}

run('../data/p5/data.txt');
