/*
* Phaser Event Emitter Mixin
*/

export default function AddBeacon(object)
{
  Object.assign(object,
    {
      __beacon : new Phaser.Events.EventEmitter(),

      emit(event, payload)
      {
        this.__beacon.emit(event, payload);
      },
      on(event, callback, context)
      {
        this.__beacon.on(event, callback, context);
      },
      off(event, callback, context)
      {
        this.__beacon.off(event, callback, context);
      },
      once(event, callback, context)
      {
        this.__beacon.once(event, callback, context);
      },
      removeListener(event, callback, context, once)
      {
        this.__beacon.removeListener(event, callback, context, once);
      },
      removeAllListeners(event)
      {
        this.__beacon.removeAllListeners(event);
      }
    }
  );
}
