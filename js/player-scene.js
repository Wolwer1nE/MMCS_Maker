import {XButton} from "./x-ui/x-button.js";
import SceneMap from "./scene-map.js";
import {ModeBasedScene} from "./scene-mode.js";
import SceneModePlayer from "./scene-mode-player.js";

export default class PlayerScene extends ModeBasedScene
{
  constructor()
  {
        super({key: "player", active: false});
  }
}
