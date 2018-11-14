/*
* Firebase Document
*/
import {callConstructor} from "./firebase-collection.js"

export default class FirebaseDocument extends Phaser.Events.EventEmitter
{
  constructor(collection, id, data)
  {
    super();
    this.collection = collection;

    this.id = id;
    if (data)
      this.content = data;
  }

  setContent(value)
  {
    //console.log("set ", this.constructor.name, " : ", value);
    Object.assign(this, value);
  }

  getContent(value)
  {
    return {};
  }

  set content(value) { this.setContent(value); }
  get content() { return this.getContent(); }

  push()
  {
    return new Promise ((success, fail) =>
    {
      if (this.id)
        this.collection.doc(this.id).set(this.content, {merge:true}).then(success, fail);
      else
        this.collection.add(this.content).then(
          (doc) => {this.id = doc.id; success(this)},
          fail
        );
    });
  }

  store(key)
  {
    let doc = {id:this.id, content:this.content};
    localStorage.setItem(key, JSON.stringify(doc));
  }

  static restore(proto, collection, key)
  {
    let stored = localStorage.getItem(key);
    if (!stored) return null;

    let doc = JSON.parse(stored);
    return callConstructor(proto, collection, doc.id, doc.content);
  }

  static isStored(key)
  {
    return localStorage.getItem(key) != null;
  }
}
