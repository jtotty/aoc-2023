import fs from 'fs';

const NUMBERS_DICT = new Map([
    ['one', 1],
    ['two', 2],
    ['three', 3],
    ['four', 4],
    ['five', 5],
    ['six', 6],
    ['seven', 7],
    ['eight', 8],
    ['nine', 9],
]);

function run(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf8');
    const values = getCalibrationValues(data);
    const sum = sumCalibrationValues(values);
    console.log(sum);
}

run('../../data/p1/data.txt');

function getCalibrationValues(input: string): number[] {
    const lines = input.split('\n');
    const digits: number[] = [];

    lines.forEach((line) => {
        const numbers = matchNumbers(line);
        if (numbers?.length) {
            digits.push(determineTwoDigitValue(numbers));
        }
    });

    return digits;
}

export function matchNumbers(line: string): number[] | null {
    const lineNumbers: number[] = []
    let tempWord = '';

    if (line.length === 0) return null;

    line.split('').forEach((char) => {
        if (char.match(/[a-z]/ig)) {
            tempWord += char;

            NUMBERS_DICT.forEach((_num, key) => {
                if (tempWord.includes(key)) {
                    lineNumbers.push(NUMBERS_DICT.get(key) as number);
                    tempWord = tempWord[tempWord.length - 1];
                }
            });
        } else if (char.match(/\d/g)) {
            if (tempWord.length) {
                tempWord = tempWord[tempWord.length - 1];
            }

            lineNumbers.push(Number(char));
        }
    });

    return lineNumbers;
}

export function determineTwoDigitValue(numbers: number[]): number {
    if (numbers.length === 1) {
        return Number(`${numbers[0]}${numbers[0]}`);
    }

    if (numbers.length === 2) {
        return Number(numbers.join(''));
    }

    if (numbers.length >= 3) {
        return Number(`${numbers[0]}${numbers[numbers.length - 1]}`);
    }

    return 0;
}

export function sumCalibrationValues(values: number[]): number {
    return values.reduce((acc, value) => acc + value, 0);
}
