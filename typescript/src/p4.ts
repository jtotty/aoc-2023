import fs from 'fs';

function run(fileType: string) {
    const data = fs.readFileSync(fileType, 'utf-8').trim().split('\n');

    const total01 = parseDataPart1(data);
    console.log(total01);

    const tick02 = performance.now();
    const total02 = parseDataPart2(data);
    console.log(total02);
    console.log(`That took ${performance.now() - tick02} ms`);
}

function parseDataPart1(cards: string[]): number {
    let total = 0;

    cards.forEach((card) => {
        const parts = card.split(/: |\| /g);
        const winningNumbers = parts[1].match(/\d+/g);
        const numbers = parts[2].match(/\d+/g);
        let count = 0;

        if (winningNumbers && numbers) {
            winningNumbers.forEach((num) => {
                if (numbers.includes(num)) {
                    count++;
                }
            });
        }

        total += count !== 0 ? Math.pow(2, count - 1) : 0;
    });

    return total;
}

function parseDataPart2(cards: string[]): number {
    let total = 0;
    const cardCopies: Record<number, number> = Object.create(null);

    cards.forEach((card, index) => {
        const parts = card.split(/: |\| /g);
        const winningNumbers = parts[1].match(/\d+/g);
        const playerNumbers = parts[2].match(/\d+/g);

        let count = 0;

        if (winningNumbers && playerNumbers) {
            winningNumbers.forEach((winningNum) => {
                if (playerNumbers.includes(winningNum)) {
                    count++;
                }
            });
        }

        cardCopies[index + 1] = count;
    });

    function countCopies(item: number) {
        total++;
        const itemCount = cardCopies[item];

        if (itemCount) {
            for (let i = item + 1; i <= item + itemCount; i++) {
                countCopies(i);
            }
        }
    }

    for (let key of Object.keys(cardCopies)) {
        countCopies(Number(key));
    }

    return total;
}

run('../data/p4/data.txt');
