/*
* URL Params Extractor
*/

export default class URLParams
{
  static parseURL(url)
  {
    let options = {};
    for(let p of new URLSearchParams(url).entries())
    {
      options[p[0]] = p[1];
    }
    return options;
  }

  static get()
  {
    return URLParams.parseURL(window.location.search);
  }

  static clear()
  {
    history.pushState({}, null, window.location.origin + window.location.pathname);
  }
}
