import { parseGamesPart1, parseGamesPart2 } from '../p2';

const testInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const data = testInput.trim().split('\n');
const values01 = [1, 2, 0, 0, 5];
const values02 = [48, 12, 1560, 630, 36];

test('parseGamesPart1', () => {
    const values = parseGamesPart1(data);
    expect(values).toEqual(values01);
});

test('parseGamePart2', () => {
    const values = parseGamesPart2(data);
    expect(values).toEqual(values02);
});
