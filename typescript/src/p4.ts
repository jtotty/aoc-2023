import fs from 'fs';

function run(fileType: string) {
    const data = fs.readFileSync(fileType, 'utf-8').trim().split('\n');

    const total01 = parseDataPart1(data);
    console.log(total01);

    const total02 = parseDataPart2(data);
    console.log(total02);
}

function parseDataPart1(cards: string[]): number {
    let total = 0;

    cards.forEach((card) => {
        const parts = card.split(/: |\| /g);
        const winningNumbers = parts[1].match(/\d+/g);
        const numbers = parts[2].match(/\d+/g);
        let tally = 0;

        winningNumbers?.forEach((num) => {
            if (numbers?.includes(num)) {
                tally++;
            }
        });

        total += (tally !== 0) ? Math.pow(2, tally - 1) : 0;
    });

    return total;
}

function parseDataPart2(cards: string[]): number {
    return 0;
}

run('../data/p4/data.txt');
