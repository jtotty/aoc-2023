export function sumValues(values: number[]): number {
    return values.reduce((acc, val) => acc + val, 0);
}

export function isNumber(str: string): boolean {
    return !isNaN(Number(str));
}
