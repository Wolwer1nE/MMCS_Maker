/*
*  Firebase Plugin
*/

import FirebaseCollection from "./firebase-collection.js"
import FirebaseDocument from "./firebase-document.js"

export default class FirebasePlugin extends Phaser.Plugins.BasePlugin
{
  constructor(pluginManager)
  {
    super(pluginManager);
  }

  init(data)
  {
    firebase.initializeApp(data.config);
    this.db = firebase.firestore();
    // Disable deprecated features
    this.db.settings({
      timestampsInSnapshots: true
    });
    // Init wrappers
    data.collections.forEach(
      (collection) => {
        this.db[collection.key] = new FirebaseCollection(
          this.db.collection(collection.remoteId),
          collection.proto || FirebaseDocument);
      });

    if (data.enablePersistance)
      this.db.enablePersistance();
    console.log(this);
  }

  boot()
  {
    var eventEmitter = this.systems.events;
    //eventEmitter.on("update", this.update, this);
    eventEmitter.on("start", this.start, this);
    eventEmitter.on("shutdown", this.shutdown, this);
    eventEmitter.once("destroy", this.destroy, this);
  }


  start()
  {
    //console.log(this);
  }

  shutdown(){}

  destroy()
  {
    this.shutdown();
    super.destroy();
  }
}
