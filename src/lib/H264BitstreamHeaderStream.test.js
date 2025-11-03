import sinon from 'sinon';

import { H264BitstreamHeaderStream } from './H264BitstreamHeaderStream.js';

describe('H264BitstreamHeaderStream', () => {
  test('clean chunks, 3-byte start-code', (done) => {
    const stream = new H264BitstreamHeaderStream();

    const chunkListener = sinon.stub();

    stream.addEventListener('data', chunkListener);
    stream.addEventListener('end', () => {
      expect(chunkListener.callCount).toBe(2);
      expect(chunkListener.getCall(0).args[0]).toEqual({
        start: 0,
        end: 4,
        size: 5,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 7,
      });
      expect(chunkListener.getCall(1).args[0]).toEqual({
        start: 5,
        end: 10,
        size: 6,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 8,
      });
      done();
    });

    stream.appendData(new Uint8Array([0, 0, 1, 103, 4]));
    stream.appendData(new Uint8Array([0, 0, 1, 104, 5, 6]));
    stream.finish();
  });

  test('clean chunks, 4-byte start-code', (done) => {
    const stream = new H264BitstreamHeaderStream();

    const chunkListener = sinon.stub();

    stream.addEventListener('data', chunkListener);
    stream.addEventListener('end', () => {
      expect(chunkListener.callCount).toBe(2);
      expect(chunkListener.getCall(0).args[0]).toEqual({
        start: 1,
        end: 5,
        size: 5,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 7,
      });
      expect(chunkListener.getCall(1).args[0]).toEqual({
        start: 7,
        end: 12,
        size: 6,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 8,
      });
      done();
    });

    stream.appendData(new Uint8Array([0, 0, 0, 1, 103, 4]));
    stream.appendData(new Uint8Array([0, 0, 0, 1, 104, 5, 6]));
    stream.finish();
  });

  test('second chunk zeros in first chunk', (done) => {
    const stream = new H264BitstreamHeaderStream();

    const chunkListener = sinon.stub();

    stream.addEventListener('data', chunkListener);
    stream.addEventListener('end', () => {
      expect(chunkListener.callCount).toBe(2);
      expect(chunkListener.getCall(0).args[0]).toEqual({
        start: 1,
        end: 5,
        size: 5,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 7,
      });
      expect(chunkListener.getCall(1).args[0]).toEqual({
        start: 7,
        end: 12,
        size: 6,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 8,
      });
      done();
    });

    stream.appendData(new Uint8Array([0, 0, 0, 1, 103, 4, 0, 0, 0]));
    stream.appendData(new Uint8Array([1, 104, 5, 6]));
    stream.finish();
  });

  test('combine chunks, 3-byte start-code', (done) => {
    const stream = new H264BitstreamHeaderStream();

    const chunkListener = sinon.stub();

    stream.addEventListener('data', chunkListener);
    stream.addEventListener('end', () => {
      expect(chunkListener.callCount).toBe(5);
      expect(chunkListener.getCall(0).args[0]).toEqual({
        start: 0,
        end: 5,
        size: 6,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 7,
      });
      expect(chunkListener.getCall(1).args[0]).toEqual({
        start: 6,
        end: 14,
        size: 9,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 8,
      });
      expect(chunkListener.getCall(2).args[0]).toEqual({
        start: 15,
        end: 19,
        size: 5,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 5,
      });
      expect(chunkListener.getCall(3).args[0]).toEqual({
        start: 20,
        end: 27,
        size: 8,
        forbiddenZeroBit: 0,
        refIdc: 2,
        type: 1,
      });
      expect(chunkListener.getCall(4).args[0]).toEqual({
        start: 28,
        end: 31,
        size: 4,
        forbiddenZeroBit: 0,
        refIdc: 0,
        type: 6,
      });
      done();
    });

    stream.appendData(new Uint8Array([0, 0, 1, 103, 3, 4, 0, 0, 1, 104]));
    stream.appendData(new Uint8Array([6, 7, 8, 9, 10, 0]));
    stream.appendData(new Uint8Array([0, 1, 101, 12]));
    stream.appendData(new Uint8Array([0, 0, 1, 65]));
    stream.appendData(new Uint8Array([14, 15, 16, 17]));
    stream.appendData(new Uint8Array([0, 0, 1, 6]));
    stream.finish();
  });

  test('combine chunks, 4-byte start-code', (done) => {
    const stream = new H264BitstreamHeaderStream();

    const chunkListener = sinon.stub();

    stream.addEventListener('data', chunkListener);
    stream.addEventListener('end', () => {
      expect(chunkListener.callCount).toBe(6);
      expect(chunkListener.getCall(0).args[0]).toEqual({
        start: 1,
        end: 6,
        size: 6,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 7,
      });
      expect(chunkListener.getCall(1).args[0]).toEqual({
        start: 8,
        end: 16,
        size: 9,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 8,
      });
      expect(chunkListener.getCall(2).args[0]).toEqual({
        start: 18,
        end: 22,
        size: 5,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 5,
      });
      expect(chunkListener.getCall(3).args[0]).toEqual({
        start: 24,
        end: 31,
        size: 8,
        forbiddenZeroBit: 0,
        refIdc: 2,
        type: 1,
      });
      expect(chunkListener.getCall(4).args[0]).toEqual({
        start: 33,
        end: 36,
        size: 4,
        forbiddenZeroBit: 0,
        refIdc: 0,
        type: 6,
      });
      expect(chunkListener.getCall(5).args[0]).toEqual({
        start: 38,
        end: 43,
        size: 6,
        forbiddenZeroBit: 0,
        refIdc: 3,
        type: 7,
      });
      done();
    });

    stream.appendData(new Uint8Array([0, 0, 0, 1, 103, 3, 4, 0, 0, 0, 1, 104]));
    stream.appendData(new Uint8Array([6, 7, 8, 9, 10, 0, 0]));
    stream.appendData(new Uint8Array([0, 1, 101, 12]));
    stream.appendData(new Uint8Array([0, 0, 0, 1, 65]));
    stream.appendData(new Uint8Array([14, 15, 16, 17, 0]));
    stream.appendData(new Uint8Array([0, 0, 1, 6, 0, 0, 0]));
    stream.appendData(new Uint8Array([1, 103, 20, 21]));
    stream.finish();
  });
});
