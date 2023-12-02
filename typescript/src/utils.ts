export function sumValues(values: number[]): number {
    return values.reduce((acc, val) => acc + val, 0);
}
