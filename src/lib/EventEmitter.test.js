import test from 'ava';
import sinon from 'sinon';

import { EventEmitter } from './EventEmitter';

test('multiple events', (t) => {
  const emitter = new EventEmitter();

  const listener1 = sinon.stub();
  const listener2 = sinon.stub();

  emitter.addEventListener('foo', listener1);
  emitter.addEventListener('bar', listener2);

  emitter.emit('foo', 1, '2');
  emitter.emit('bar', 3, '4');

  t.is(listener1.callCount, 1);
  t.is(listener2.callCount, 1);

  t.deepEqual(listener1.getCall(0).args, [1, '2']);
  t.deepEqual(listener2.getCall(0).args, [3, '4']);
});

test('multiple listeners', (t) => {
  const emitter = new EventEmitter();

  const listener1 = sinon.stub();
  const listener2 = sinon.stub();

  emitter.addEventListener('foo', listener1);
  emitter.addEventListener('foo', listener2);

  emitter.emit('foo', 1, '2');

  t.is(listener1.callCount, 1);
  t.is(listener2.callCount, 1);

  t.deepEqual(listener1.getCall(0).args, [1, '2']);
  t.deepEqual(listener2.getCall(0).args, [1, '2']);
});

test('multiple listeners, remove particular', (t) => {
  const emitter = new EventEmitter();

  const listener1 = sinon.stub();
  const listener2 = sinon.stub();

  emitter.addEventListener('foo', listener1);
  emitter.addEventListener('foo', listener2);

  emitter.removeEventListener('foo', listener1);

  emitter.emit('foo', 1, '2');

  t.is(listener1.callCount, 0);
  t.is(listener2.callCount, 1);

  t.deepEqual(listener2.getCall(0).args, [1, '2']);
});
