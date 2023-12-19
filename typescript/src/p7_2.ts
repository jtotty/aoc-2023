import fs from 'fs';

type Hand = { hand: string, bid: number };

const labels = {
    'A': 'm',
    'K': 'l',
    'Q': 'k',
    'T': 'j',
    '9': 'i',
    '8': 'h',
    '7': 'g',
    '6': 'f',
    '5': 'e',
    '4': 'd',
    '3': 'c',
    '2': 'b',
    'J': 'a',
} as const;

type LabelKey = keyof typeof labels;

enum Plays {
    'highCard',
    'onePair',
    'twoPairs',
    'threeOfAKind',
    'fullHouse',
    'fourOfAKind',
    'fiveOfAKind',
}

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
            score = Plays.fiveOfAKind;
            break;
        case 2:
            score = countLabels(hand).includes(4)
                ? Plays.fourOfAKind
                : Plays.fullHouse;
            break;
        case 3:
            score = countLabels(hand).includes(2)
                ? Plays.twoPairs
                : Plays.threeOfAKind;
            break;
        case 4:
            score = Plays.onePair;
            break;
        case 5:
            score = Plays.highCard;
            break;
        default:
            break;
    }

    if (hand.includes('J')) {
        score = parseJokers(hand, score);
    }

    handCache.set(hand, score);

    return score;
};

function parseJokers(hand: string, score: number): number {
    if (score === Plays.fiveOfAKind || score === Plays.fourOfAKind || score === Plays.fullHouse) {
        return Plays.fiveOfAKind;
    }

    if (score === Plays.threeOfAKind) {
        return Plays.fourOfAKind;
    }

    if (score === Plays.onePair) {
        return Plays.threeOfAKind;
    }

    if (score === Plays.highCard) {
        return Plays.onePair;
    }

    const jokerCount = hand.split('').filter((char) => char === 'J').length;
    if (score === Plays.twoPairs) {
        if (jokerCount === 1) {
            return Plays.fullHouse;
        } else if (jokerCount === 2) {
            return Plays.fourOfAKind;
        }
    }

    return score;
}

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
