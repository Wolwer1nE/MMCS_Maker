/*
* URL Params Extractor
*/

export default class URLParamsPlugin extends Phaser.Plugins.BasePlugin
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

  constructor(pluginManager)
  {
    super(pluginManager);
    let params = URLParamsPlugin.parseURL(window.location.search);
    Object.assign(this, params);
    // remove params from URL
    history.pushState({}, null, window.location.origin + window.location.pathname);
  }
}
