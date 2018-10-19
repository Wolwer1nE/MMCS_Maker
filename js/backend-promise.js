/**
  Backend communication
*/


export default class BackendPromise extends Phaser.Events.EventEmitter
{
  constructor(baseUrl, defaultUser)
  {
    super();
    this.baseURL = baseUrl;
    this.defaultUser = defaultUser;
  }
  
  send(levelData)
  {
    const url = this.baseURL;
    
    const data = {
      user_id: this.defaultUser,
      data: levelData
    };
    
    return new Promise((succeed, fail) => 
    {
      var request = new XMLHttpRequest();      
      request.open("POST", url, true);
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Charset', 'UTF-8');
      
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
      
      request.send(JSON.stringify(data));
    });
  }
  
  getAll()
  {
    return get();
  }
  
  get(levelId)
  {
    const url = levelId ?
      this.baseURL + "/"+ levelId :
      this.baseURL;
    return new Promise((succeed, fail) => 
    {
      var request = new XMLHttpRequest();      
      request.open("GET", url, true);
      
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
      
      request.send();
    });
  }
}

var backend = new BackendPromise("http://www.rndgd.ru/api/levels", 1);

backend.get().then( 
        (response)=> {
          console.log(response);
        },
        (error)=>{
          console.log(error);     
        }
      );