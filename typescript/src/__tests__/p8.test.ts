import { nodesEndWithZ } from '../p8';

const randomNodes = [
    { name: 'BGA', L: 'MPB', R: 'HFP' },
    { name: 'SLA', L: 'BCD', R: 'VJK' },
    { name: 'PTA', L: 'LSP', R: 'TXX' },
    { name: 'AAA', L: 'MQQ', R: 'VHH' },
    { name: 'XJA', L: 'BHL', R: 'RGF' },
    { name: 'JNA', L: 'CKP', R: 'KXQ' },
];

const nodesWithZ = [
    { name: 'ZZZ', L: 'VHH', R: 'MQQ' },
    { name: 'LQZ', L: 'VJK', R: 'BCD' },
    { name: 'SNZ', L: 'TXX', R: 'LSP' },
    { name: 'PBZ', L: 'KXQ', R: 'CKP' },
    { name: 'LCZ', L: 'HFP', R: 'MPB' },
    { name: 'PDZ', L: 'RGF', R: 'BHL' },
];

test('node matching returns false', () => {
    const result = nodesEndWithZ(randomNodes);
    expect(result).toEqual(false);
});

test('node matching returns true', () => {
    const result = nodesEndWithZ(nodesWithZ);
    expect(result).toEqual(true);
});
