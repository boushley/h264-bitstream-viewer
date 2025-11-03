import test from 'ava';
import sinon from 'sinon';

import { FileReadStream } from './FileReadStream';

test.cb('empty file', (t) => {
  const file = new File([], 'test');
  const stream = new FileReadStream(file);

  const chunkListener = sinon.stub();

  t.plan(1);

  stream.addEventListener('data', chunkListener);

  stream.addEventListener('end', () => {
    t.is(chunkListener.callCount, 0);
    t.end();
  });

  stream.start();
});

test.cb('entire file in one chunk', (t) => {
  const data = new Uint8Array([1, 2, 3, 4, 5]);
  const file = new File([data.buffer], 'test');

  const stream = new FileReadStream(file, {
    chunkSize: 10,
  });

  const chunkListener = sinon.stub();

  t.plan(2);

  stream.addEventListener('data', chunkListener);

  stream.addEventListener('end', () => {
    t.is(chunkListener.callCount, 1);
    t.deepEqual(chunkListener.getCall(0).args[0], data.buffer);
    t.end();
  });

  stream.start();
});

test.cb('entire file in multiple chunks', (t) => {
  const data = new Uint8Array([1, 2, 3, 4, 5]);
  const file = new File([data.buffer], 'test');

  const stream = new FileReadStream(file, {
    chunkSize: 1,
  });

  const chunkListener = sinon.stub();

  t.plan(6);

  stream.addEventListener('data', chunkListener);

  stream.addEventListener('end', () => {
    t.is(chunkListener.callCount, 5);
    t.deepEqual(chunkListener.getCall(0).args[0], data.buffer.slice(0, 1));
    t.deepEqual(chunkListener.getCall(1).args[0], data.buffer.slice(1, 2));
    t.deepEqual(chunkListener.getCall(2).args[0], data.buffer.slice(2, 3));
    t.deepEqual(chunkListener.getCall(3).args[0], data.buffer.slice(3, 4));
    t.deepEqual(chunkListener.getCall(4).args[0], data.buffer.slice(4, 5));
    t.end();
  });

  stream.start();
});
