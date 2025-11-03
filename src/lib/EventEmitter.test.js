import sinon from 'sinon/pkg/sinon.js';

import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  test('multiple events', () => {
    const emitter = new EventEmitter();

    const listener1 = sinon.stub();
    const listener2 = sinon.stub();

    emitter.addEventListener('foo', listener1);
    emitter.addEventListener('bar', listener2);

    emitter.emit('foo', 1, '2');
    emitter.emit('bar', 3, '4');

    expect(listener1.callCount).toBe(1);
    expect(listener2.callCount).toBe(1);

    expect(listener1.getCall(0).args).toEqual([1, '2']);
    expect(listener2.getCall(0).args).toEqual([3, '4']);
  });

  test('multiple listeners', () => {
    const emitter = new EventEmitter();

    const listener1 = sinon.stub();
    const listener2 = sinon.stub();

    emitter.addEventListener('foo', listener1);
    emitter.addEventListener('foo', listener2);

    emitter.emit('foo', 1, '2');

    expect(listener1.callCount).toBe(1);
    expect(listener2.callCount).toBe(1);

    expect(listener1.getCall(0).args).toEqual([1, '2']);
    expect(listener2.getCall(0).args).toEqual([1, '2']);
  });

  test('multiple listeners, remove particular', () => {
    const emitter = new EventEmitter();

    const listener1 = sinon.stub();
    const listener2 = sinon.stub();

    emitter.addEventListener('foo', listener1);
    emitter.addEventListener('foo', listener2);

    emitter.removeEventListener('foo', listener1);

    emitter.emit('foo', 1, '2');

    expect(listener1.callCount).toBe(0);
    expect(listener2.callCount).toBe(1);

    expect(listener2.getCall(0).args).toEqual([1, '2']);
  });
});
