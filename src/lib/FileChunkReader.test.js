import { FileChunkReader } from './FileChunkReader';

describe('FileChunkReader', () => {
  test('empty file', async () => {
    const data = new Uint8Array([]);
    const file = new File([data.buffer], 'test');

    const reader = new FileChunkReader(file);

    const buffer = await reader.readAsArrayBuffer();

    expect(new Uint8Array(buffer)).toEqual(data);
  });

  test('no args full file', async () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const file = new File([data.buffer], 'test');

    const reader = new FileChunkReader(file);

    const buffer = await reader.readAsArrayBuffer();

    expect(new Uint8Array(buffer)).toEqual(data);
  });

  test('read till the end', async () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const file = new File([data.buffer], 'test');

    const reader = new FileChunkReader(file);

    const buffer = await reader.readAsArrayBuffer(1);

    expect(new Uint8Array(buffer)).toEqual(new Uint8Array([2, 3, 4, 5]));
  });

  test('read chunk', async () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const file = new File([data.buffer], 'test');

    const reader = new FileChunkReader(file);

    const buffer = await reader.readAsArrayBuffer(1, 2);

    expect(new Uint8Array(buffer)).toEqual(new Uint8Array([2, 3]));
  });

  test('start exceeds length', async () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const file = new File([data.buffer], 'test');

    const reader = new FileChunkReader(file);

    const buffer = await reader.readAsArrayBuffer(10);

    expect(new Uint8Array(buffer)).toEqual(new Uint8Array([]));
  });
});
