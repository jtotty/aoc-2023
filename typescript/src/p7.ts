import fs from 'fs';

type Hand = { hand: string, bid: number };

const labels = {
    'A': 'm',
    'K': 'l',
    'Q': 'k',
    'J': 'j',
    'T': 'i',
    '9': 'h',
    '8': 'g',
    '7': 'f',
    '6': 'e',
    '5': 'd',
    '4': 'c',
    '3': 'b',
    '2': 'a',
} as const;

const handCache = new Map<string, number>();

function run(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
    const hands = parseHands(data);

    const tick = performance.now();
    const sortedHands = hands.sort(sortHands);
    const totalWinnings = calculateTotalWinnings(sortedHands);
    console.log(`Time: ${performance.now() - tick} ms`);
    console.log(`Total Winnings: ${totalWinnings}`);
}

function parseHands(data: string[]): Hand[] {
    return data.map((line) => {
        const [hand, bid] = line.split(' ');
        return { hand, bid: parseInt(bid) };
    });
}

function sortHands(a: Hand, b: Hand) {
    const scoreA = determineHandScore(a.hand);
    const scoreB = determineHandScore(b.hand);

    if (scoreA === scoreB) {
        const mappedA = a.hand.split('').map(labelScore).join('');
        const mappedB = b.hand.split('').map(labelScore).join('');

        return mappedA.localeCompare(mappedB);
    }

    return scoreA - scoreB;
};

function labelScore(label: string) {
    return labels[label as keyof typeof labels];
}

function determineHandScore(hand: string): number {
    if (handCache.has(hand)) {
        return handCache.get(hand) as number;
    }

    let counts = hand.split('').map((label) => {
        let occurrences = 0;
        for (let char of hand) {
            if (char === label) {
                occurrences++;
            }
        }

        return occurrences;
    });

    let score = 0;

    if (counts.includes(5)) {
        score =  6;
    } else if (counts.includes(4)) {
        score = 5;
    } else if (counts.includes(3)) {
        score = counts.includes(2) ? 4 : 3;
    } else if (counts.includes(2)) {
        if (counts.filter(i => i === 2).length === 4) {
            score = 2;
        } else {
            score = 1;
        }
    }

    handCache.set(hand, score);

    return score;
};

function calculateTotalWinnings(hands: Hand[]): number {
    let total = 0;
    hands.forEach((hand, index) => {
        total += hand.bid * (index + 1);
    });

    return total;
}
run('../data/p7/data.txt');
