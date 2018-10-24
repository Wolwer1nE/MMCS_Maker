/**
  Backend communication
*/

export let BACKEND_LEVEL_API = "http://www.rndgd.ru/api/levels";

export default class BackendPromise extends Phaser.Events.EventEmitter
{
  constructor(baseUrl, defaultUser)
  {
    super();
    this.baseURL = baseUrl;
    this.defaultUser = defaultUser;
  }

  send(levelData, user)
  {
    const url = this.baseURL;

    const data = {
      user_id: user ? user : this.defaultUser,
      data: levelData
    };

    const headers = {
      "Content-Type" : "application/json",
      "Charset" : "UTF-8"
    };

    return this.__request("POST", url, headers, data);
  }

  getAll()
  {
    return this.__request("GET", this.baseURL);
  }

  get(id)
  {
    const url = this.baseURL + "/"+ id;
    return this.__request("GET", url);
  }

  shorten(link)
  {
    const url = "https://clck.ru/--?url=" + link;
    return this.__request("GET", url);
  }

  __request(type, url, headers, data)
  {
    return new Promise((succeed, fail) =>
    {
      var request = new XMLHttpRequest();
      request.open(type, url, true);

      if (headers)
        Object.keys(headers).forEach((key) =>
          request.setRequestHeader(key, headers[key])
        );

      request.onreadystatechange = () => {
          if(request.readyState == 4) {
              if(request.status==200) {
                  console.log("CORS works!", request.responseText);
              } else {
                  console.log("CORS error!", request);
              }
          }
      }

      request.addEventListener("load", () =>
      {
        console.log(request.response);
        if (request.status < 400)
          succeed(request.response);
        else
          fail(new Error("Request failed: " + request.statusText));
      });

      request.addEventListener("error", () =>
      {
        fail(new Error("Network error"));
      });

      const body = data ? JSON.stringify(data) : null
      request.send(body);
    });
  }
}
//
// var backend = new BackendPromise("http://www.rndgd.ru/api/levels", 1);
//
// backend.get().then(
//         (response)=> {
//           console.log(response);
//         },
//         (error)=>{
//           console.log(error);
//         }
//       );
