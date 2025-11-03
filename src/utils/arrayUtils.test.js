import arrayUtils from './arrayUtils.js';

describe('arrayUtils', () => {
  test('range: empty', () => {
    const range = arrayUtils.range();

    expect(range).toEqual([]);
  });

  test('range: no start', () => {
    const range = arrayUtils.range(3);

    expect(range).toEqual([0, 1, 2]);
  });

  test('range: start and end', () => {
    const range = arrayUtils.range(2, 5);

    expect(range).toEqual([2, 3, 4]);
  });

  test('concatUint8Arrays: empty', () => {
    const result = arrayUtils.concatUint8Arrays();

    expect(result).toEqual(new Uint8Array([]));
  });

  test('concatUint8Arrays: one input', () => {
    const input1 = new Uint8Array([1, 2, 3]);

    const result = arrayUtils.concatUint8Arrays(input1);

    expect(result).toEqual(input1);
    expect(result).not.toBe(input1);
  });

  test('concatUint8Arrays: two inputs', () => {
    const input1 = new Uint8Array([1, 2, 3]);
    const input2 = new Uint8Array([4, 5]);

    const result = arrayUtils.concatUint8Arrays(input1, input2);

    expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
  });
});
