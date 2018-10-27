/**
  Store level data in local storage
*/
import BackendPromise from "./backend-promise.js";

export default class SceneStorage extends Phaser.Events.EventEmitter
{
  constructor(dataKey, remoteId, remoteLocation, zipData)
  {
    super();
    this.key = dataKey
    this.zipped = zipData;
    this.__setData(this.idFromKey(dataKey), remoteId);

    if (remoteLocation)
      this.backend = new BackendPromise(remoteLocation, 1);
  }

  idFromKey(key)
  {
    return key+"ID";
  }

  getData()
  {
    return this.__getData(this.key);
  }

  setData(data)
  {
    return this.__setData(this.key, data);
  }

  removeData()
  {
    this.__removeData(this.key);
  }

  loadData()
  {
    return this.__loadData(this.key);
  }

  sendData()
  {
    return this.__sendData(this.key);
  }

  __getData(key)
  {
    var rawData = localStorage.getItem(key);
    if (rawData == null) {
      return null;
    }
    if (this.zipped)
      rawData = LZString.decompressFromUTF16(rawData);

    return JSON.parse(rawData);
  }

  __setData(key, data)
  {
    console.log("set ", key, " : ", data);

    if (data == null) {
      this.__removeData(key);
      return;
    }
    if (typeof data != "object")
    {
      localStorage.setItem(key, data);
      return;
    }

    var rawData = JSON.stringify(data);
    if (this.zipped)
      rawData = LZString.compressToUTF16(rawData);

    localStorage.setItem(key, rawData);
  }

  __removeData(key)
  {
    localStorage.removeItem(key);
  }

  __sendData(key)
  {
    // TODO: user
    return new Promise((success, fail) =>
    {
      var rawData = localStorage.getItem(key);
      if (rawData == null) return fail("No data for key: "+key);
      if (this.backend == null) return fail("No backend for key: "+key);

      this.backend.send(rawData).then(
        (response) =>
        {
          const result = JSON.parse(response);
          this.__setData(this.idFromKey(key), result.id);
          success(result);
        },
        fail
      );
    });
  }

  __loadData(key)
  {
    return new Promise((success, fail) =>
    {
      const dataId = this.__getData(this.idFromKey(key));
      if (dataId == null) return fail("No ID for key: " + key);
      if (this.backend == null) return fail("No backend for key: " + key);

      this.backend.get(dataId).then(
        (response) =>
        {
          this.__setData(key, response);
          success(this.__getData(key));
        },
        fail
      );
    });
  }
}
