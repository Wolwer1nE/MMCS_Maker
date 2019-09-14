/*
* Level Storage
*/
import FirebaseDocument from "./firebase/firebase-document.js"

export default class Level extends FirebaseDocument
{
  static restore(collection, key)
  {
    return FirebaseDocument.restore(Level, collection, key);
  }

  static isStored(key)
  {
    return FirebaseDocument.isStored(key);
  }

  constructor(collection, id, content)
  {
    super(collection, id, content);
  }

  set data(value)
  {
    switch (typeof value)
    {
      case "string": // it came from server
        if (this.zipped)
          value = LZString.decompressFromUTF16(value);
        this.__data = JSON.parse(value);
        break;
      case "object": // it came from tilemap
        this.__data = value;
        break;
      default:
        throw new TypeError("Unexpected type of data " + value);
    }
  }

  get data()
  {
    return this.__data;
  }

  getContent()
  {
    var data = this.zipped ?
      LZString.compressToUTF16( JSON.stringify(this.__data) ) :
      JSON.stringify(this.__data);

    return Object.assign( super.getContent(),
      {
        "data" : data,
        "zipped": this.zipped || false
      });
  }
}

FirebaseDocument.prototype.Level = Level;
