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

type LabelKey = keyof typeof labels;

const combos = {
    'fiveOfAKind': 6,
    'fourOfAKind': 5,
    'fullHouse': 4,
    'threeOfAKind': 3,
    'twoPairs': 2,
    'onePair': 1,
    'highCard': 0,
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
        return mapHand(a.hand).localeCompare(mapHand(b.hand));
    }

    return scoreA - scoreB;
};

function determineHandScore(hand: string): number {
    if (handCache.has(hand)) {
        return handCache.get(hand) as number;
    }

    const uniqueHands = new Set(hand);
    let score: number = 0;

    switch (uniqueHands.size) {
        case 1:
            score = combos['fiveOfAKind'];
            break;
        case 2:
            score = countLabels(hand).includes(4)
                ? combos['fourOfAKind']
                : combos['fullHouse'];
            break;
        case 3:
            score = countLabels(hand).includes(2)
                ? combos['twoPairs']
                : combos['threeOfAKind'];
            break;
        case 4:
            score = combos['onePair'];
            break;
        case 5:
            score = combos['highCard'];
            break;
        default:
            break;
    }

    handCache.set(hand, score);

    return score;
};

function mapHand(hand: string): string {
    let mapped = '';
    for (let char of hand) {
        mapped += labels[char as LabelKey];
    }

    return mapped;
}

function countLabels(hand: string) {
    return hand.split('').map((label) => {
        let occurrences = 0;

        for (let char of hand) {
            if (char === label) {
                occurrences++;
            }
        }

        return occurrences;
    });
}

function calculateTotalWinnings(hands: Hand[]): number {
    return hands.reduce((total, hand, index) => {
        return total + hand.bid * (index + 1);
    }, 0);
}

run('../data/p7/data.txt');
