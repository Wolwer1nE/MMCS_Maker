/*
* Phaser Event Emitter Mixin
*/

export default function AddBeckon(object)
{
  Object.assign(object,
    {
      __beckon : new Phaser.Events.EventEmitter(),

      emit(event, payload)
      {
        this.__beckon.emit(event, payload);
      },
      on(event, callback, context)
      {
        this.__beckon.on(event, callback, context);
      },
      off(event, callback, context)
      {
        this.__beckon.off(event, callback, context);
      },
      once(event, callback, context)
      {
        this.__beckon.once(event, callback, context);
      },
      removeListener(event, callback, context, once)
      {
        this.__beckon.removeListener(event, callback, context, once);
      },
      removeAllListeners(event)
      {
        this.__beckon.removeAllListeners(event);
      }
    }
  );
}
