import { determineTwoDigitValue, matchNumbers, sumCalibrationValues } from "../p1";

const testInput = `dfdfj1
eighthree
sevenine
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const testNumsSingleDigits = [
    [1],
    [8, 3],
    [7, 9],
    [2, 1, 9],
    [8, 2, 3],
    [1, 2, 3],
    [2, 1, 3, 4],
    [4, 9, 8, 7, 2],
    [1, 8, 2, 3, 4],
    [7, 6],
];

const testNumsDoubleDigits = [11, 83, 79, 29, 83, 13, 24, 42, 14, 76];

test('sums correct value', () => {
    const sum = sumCalibrationValues(testNumsDoubleDigits);
    expect(sum).toEqual(454);
});

test('determines correct two-digit values', () => {
    const result = testNumsSingleDigits.map((i) => determineTwoDigitValue(i));
    expect(result).toEqual(testNumsDoubleDigits);
});

test('matches numbers in each line correctly', () => {
    const lines = testInput.split('\n');
    const result = lines.map((line) => matchNumbers(line));
    expect(result).toEqual(testNumsSingleDigits);
});
