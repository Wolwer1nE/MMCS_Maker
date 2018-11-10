/*
* Firebase Collection Wrapper
*/

String.prototype.ucFirst = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default class FirebaseCollection extends Phaser.Events.EventEmitter
{
  static get Events()
  {
    return {
      "Added":"Added",
      "Modified":"Modified",
      "Removed":"Removed"
    }
  }

  constructor(frCollection)
  {
    super();
    this.data = frCollection;
    this.subscribe();
  }

  destroy()
  {
    this.unsubscribe();
    this.data = undefined;
    super.destroy();
  }

  add(data)
  {
    return this.data.add(data);
  }

  get(query)
  {
    if (query == undefined)
      return this.data.get();
    else if (typeof query === "string")
      return this.data.doc(query).get();
    else if (query.param && query.rel && query.value)
    {
      var q = this.data.where(query.param, query.rel, query.value);
      if (query.order)
      {
        if (typeof query.order === "string")
          q = q.orderBy(query.order);
        else
          Object.keys(query.order).forEach(
            (orderKey) => {
              q = q.orderBy(orderKey, query.order[orderKey])
            });
      }
      return q.get();
    }
  }

  set(key, data)
  {
    return this.data.doc(key).set(data);
  }

  subscribe()
  {
    this.data.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) =>
        this.emit(FirebaseCollection.Events[change.type.ucFirst()], change.doc))
    });
  }

  unsubscribe()
  {
    this.data.onSnapshot(()=>{});
  }
}
