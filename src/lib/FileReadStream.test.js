import sinon from 'sinon';

import { FileReadStream } from './FileReadStream';

describe('FileReadStream', () => {
  test('empty file', (done) => {
    const file = new File([], 'test');
    const stream = new FileReadStream(file);

    const chunkListener = sinon.stub();

    stream.addEventListener('data', chunkListener);

    stream.addEventListener('end', () => {
      expect(chunkListener.callCount).toBe(0);
      done();
    });

    stream.start();
  });

  test('entire file in one chunk', (done) => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const file = new File([data.buffer], 'test');

    const stream = new FileReadStream(file, {
      chunkSize: 10,
    });

    const chunkListener = sinon.stub();

    stream.addEventListener('data', chunkListener);

    stream.addEventListener('end', () => {
      expect(chunkListener.callCount).toBe(1);
      expect(chunkListener.getCall(0).args[0]).toEqual(data.buffer);
      done();
    });

    stream.start();
  });

  test('entire file in multiple chunks', (done) => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const file = new File([data.buffer], 'test');

    const stream = new FileReadStream(file, {
      chunkSize: 1,
    });

    const chunkListener = sinon.stub();

    stream.addEventListener('data', chunkListener);

    stream.addEventListener('end', () => {
      expect(chunkListener.callCount).toBe(5);
      expect(chunkListener.getCall(0).args[0]).toEqual(data.buffer.slice(0, 1));
      expect(chunkListener.getCall(1).args[0]).toEqual(data.buffer.slice(1, 2));
      expect(chunkListener.getCall(2).args[0]).toEqual(data.buffer.slice(2, 3));
      expect(chunkListener.getCall(3).args[0]).toEqual(data.buffer.slice(3, 4));
      expect(chunkListener.getCall(4).args[0]).toEqual(data.buffer.slice(4, 5));
      done();
    });

    stream.start();
  });
});
