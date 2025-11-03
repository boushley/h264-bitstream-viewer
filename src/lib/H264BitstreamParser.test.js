import { H264BitstreamParser } from './H264BitstreamParser.js';

describe('H264BitstreamParser', () => {
  test('findUnit: empty data, no offset', () => {
    const data = new Uint8Array(0);

    const result = H264BitstreamParser.findUnit(data);

    expect(result).toEqual({ start: -1, end: -1, size: 0 });
  });

  test('findUnit: no start-codes', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);

    const result = H264BitstreamParser.findUnit(data);

    expect(result).toEqual({ start: -1, end: -1, size: 0 });
  });

  test('findUnit: 3-byte start-code in the end', () => {
    const data = new Uint8Array([1, 2, 3, 0, 0, 1]);

    const result = H264BitstreamParser.findUnit(data);

    expect(result).toEqual({ start: -1, end: -1, size: 0 });
  });

  test('findUnit: 4-byte start-code in the end', () => {
    const data = new Uint8Array([1, 2, 3, 0, 0, 0, 1]);

    const result = H264BitstreamParser.findUnit(data);

    expect(result).toEqual({ start: -1, end: -1, size: 0 });
  });

  test('findUnit: single unit, leading zeros', () => {
    const data = new Uint8Array([0, 0, 0, 0, 0, 0, 1, 5, 6]);

    const result = H264BitstreamParser.findUnit(data);

    expect(result).toEqual({ start: 4, end: 8, size: 5 });
  });

  test('findUnit: single unit, leading trash', () => {
    const data = new Uint8Array([1, 2, 3, 4, 0, 0, 1, 5, 6]);

    const result = H264BitstreamParser.findUnit(data);

    expect(result).toEqual({ start: 4, end: 8, size: 5 });
  });

  test('findUnit: two units, 3-byte start-codes', () => {
    const data = new Uint8Array([0, 0, 1, 5, 6, 0, 0, 1, 7, 8, 9]);

    const result1 = H264BitstreamParser.findUnit(data, 0);
    const result2 = H264BitstreamParser.findUnit(data, 4);

    expect(result1).toEqual({ start: 0, end: 4, size: 5 });
    expect(result2).toEqual({ start: 5, end: 10, size: 6 });
  });

  test('findUnit: two units, second one has only header', () => {
    const data = new Uint8Array([0, 0, 1, 5, 6, 0, 0, 1, 5]);

    const result1 = H264BitstreamParser.findUnit(data, 0);
    const result2 = H264BitstreamParser.findUnit(data, 4);

    expect(result1).toEqual({ start: 0, end: 4, size: 5 });
    expect(result2).toEqual({ start: 5, end: 8, size: 4 });
  });

  test('findUnit: two units, second one with 4-byte start-codes', () => {
    const data = new Uint8Array([0, 0, 1, 5, 6, 0, 0, 0, 1, 7, 8, 9]);

    const result1 = H264BitstreamParser.findUnit(data, 0);
    const result2 = H264BitstreamParser.findUnit(data, 4);

    expect(result1).toEqual({ start: 0, end: 4, size: 5 });
    expect(result2).toEqual({ start: 6, end: 11, size: 6 });
  });

  test('findUnit: two units, all with 4-byte start-codes', () => {
    const data = new Uint8Array([0, 0, 0, 1, 5, 6, 0, 0, 0, 1, 7, 8, 9]);

    const result1 = H264BitstreamParser.findUnit(data, 0);
    const result2 = H264BitstreamParser.findUnit(data, 5);

    expect(result1).toEqual({ start: 1, end: 5, size: 5 });
    expect(result2).toEqual({ start: 7, end: 12, size: 6 });
  });

  test('findUnitWithHeader: no start-codes', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);

    const result = H264BitstreamParser.findUnitWithHeader(data);

    expect(result).toEqual({
      start: -1,
      end: -1,
      size: 0,
      forbiddenZeroBit: -1,
      refIdc: -1,
      type: -1,
    });
  });

  test('findUnitWithHeader: single unit, leading zeros', () => {
    const data = new Uint8Array([0, 0, 0, 0, 0, 0, 1, 103, 6]);

    const result = H264BitstreamParser.findUnitWithHeader(data);

    expect(result).toEqual({
      start: 4,
      end: 8,
      size: 5,
      forbiddenZeroBit: 0,
      refIdc: 3,
      type: 7,
    });
  });

  test('findUnitWithHeader: single unit, leading trash', () => {
    const data = new Uint8Array([1, 2, 3, 4, 0, 0, 1, 6, 7]);

    const result = H264BitstreamParser.findUnitWithHeader(data);

    expect(result).toEqual({
      start: 4,
      end: 8,
      size: 5,
      forbiddenZeroBit: 0,
      refIdc: 0,
      type: 6,
    });
  });

  test('readUnitHeader: empty data', () => {
    const header = H264BitstreamParser.readUnitHeader(new Uint8Array([]));

    expect(header).toEqual({
      forbiddenZeroBit: -1,
      refIdc: -1,
      type: -1,
    });
  });

  test('readUnitHeader: different units', () => {
    const header1 = H264BitstreamParser.readUnitHeader(
      new Uint8Array([0, 0, 1, 6]),
    );
    const header2 = H264BitstreamParser.readUnitHeader(
      new Uint8Array([0, 0, 1, 103]),
    );
    const header3 = H264BitstreamParser.readUnitHeader(
      new Uint8Array([0, 0, 1, 104]),
    );
    const header4 = H264BitstreamParser.readUnitHeader(
      new Uint8Array([0, 0, 1, 101]),
    );
    const header5 = H264BitstreamParser.readUnitHeader(
      new Uint8Array([0, 0, 1, 65]),
    );

    expect(header1).toEqual({
      forbiddenZeroBit: 0,
      refIdc: 0,
      type: 6,
    });
    expect(header2).toEqual({
      forbiddenZeroBit: 0,
      refIdc: 3,
      type: 7,
    });
    expect(header3).toEqual({
      forbiddenZeroBit: 0,
      refIdc: 3,
      type: 8,
    });
    expect(header4).toEqual({
      forbiddenZeroBit: 0,
      refIdc: 3,
      type: 5,
    });
    expect(header5).toEqual({
      forbiddenZeroBit: 0,
      refIdc: 2,
      type: 1,
    });
  });

  test('readUnitHeader: offset on start-code', () => {
    const header = H264BitstreamParser.readUnitHeader(
      new Uint8Array([1, 2, 3, 0, 0, 1, 6]),
      3,
    );

    expect(header).toEqual({
      forbiddenZeroBit: 0,
      refIdc: 0,
      type: 6,
    });
  });

  test('readUnitHeader: offset before start-code', () => {
    const header = H264BitstreamParser.readUnitHeader(
      new Uint8Array([1, 2, 3, 0, 0, 1, 6]),
      2,
    );

    expect(header).toEqual({
      forbiddenZeroBit: -1,
      refIdc: -1,
      type: -1,
    });
  });
});
