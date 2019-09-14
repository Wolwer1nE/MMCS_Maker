/*
* Firebase Collection Wrapper
*/

export function callConstructor(constructor) {
    var factoryFunction = constructor.bind.apply(constructor, arguments);
    return new factoryFunction();
}

export default class FirebaseCollection extends Phaser.Events.EventEmitter
{
  static get Events()
  {
    return {
      "added":"added",
      "modified":"modified",
      "removed":"removed"
    }
  }

  constructor(frCollection, docType)
  {
    super();
    this.data = frCollection;
    this.docProto = docType;
    //this.subscribe();
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

  pull(documentId)
  {
    return new Promise( (success, fail) =>
    {
      this.data.doc(documentId).get().then(
      (doc) => {
        if (doc.exists) success(callConstructor(this.docProto, this, doc.id, doc.data()));
        else fail(doc);
      }, fail);
    });
  }

  get(query)
  {
    var q = this.data;
    if (query === undefined)
      return q.get();

    if (query.param && query.rel && query.value)
    {
      q = q.where(query.param, query.rel, query.value);
    }

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

  set(key, data)
  {
    return this.data.doc(key).set(data);
  }

  subscribe()
  {
    this.data.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) =>
        this.emit(FirebaseCollection.Events[change.type], change.doc))
    });
  }

  unsubscribe()
  {
    this.data.onSnapshot(()=>{});
  }
}
