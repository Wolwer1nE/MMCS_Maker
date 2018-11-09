/**
  Render
*/
import {XRender} from "./x-sprite.js";

XRender.make = {};

import XCancel from "./sprites/x-cancel.js";
XRender.make.cancel = (sc,st,w,h) =>
{
  return new XCancel(sc,st,w,h).sprite;
};

import XCircle from "./sprites/x-circle.js";
XRender.make.circle = (sc,st,w,h) =>
{
  return new XCircle(sc,st,w,h).sprite;
};

import XDown from "./sprites/x-down.js";
XRender.make.down = (sc,st,w,h) =>
{
  return new XDown(sc,st,w,h).sprite;
};

import XLeft from "./sprites/x-left.js";
XRender.make.left = (sc,st,w,h) =>
{
  return new XLeft(sc,st,w,h).sprite;
};

import XOk from "./sprites/x-ok.js";
XRender.make.ok = (sc,st,w,h) =>
{
  return new XOk(sc,st,w,h).sprite;
};

import XPause from "./sprites/x-pause.js";
XRender.make.pause = (sc,st,w,h) =>
{
  return new XPause(sc,st,w,h).sprite;
};

import XPlay from "./sprites/x-play.js";
XRender.make.play = (sc,st,w,h) =>
{
  return new XPlay(sc,st,w,h).sprite;
};

import XRect from "./sprites/x-rect.js";
XRender.make.rect = (sc,st,w,h) =>
{
  return new XRect(sc,st,w,h).sprite;
};

import XReplay from "./sprites/x-replay.js";
XRender.make.replay = (sc,st,w,h) =>
{
  return new XReplay(sc,st,w,h).sprite;
};

import XRight from "./sprites/x-right.js";
XRender.make.right = (sc,st,w,h) =>
{
  return new XRight(sc,st,w,h).sprite;
};

import XUp from "./sprites/x-up.js";
XRender.make.up = (sc,st,w,h) =>
{
  return new XUp(sc,st,w,h).sprite;
};

XRender.SystemSprites = {};
Object.keys(XRender.make).forEach((k)=>
{
  XRender.SystemSprites[k] = k
});

import XSprite from "./x-sprite.js";
XRender.make.copy = (sc,sp,w,h) =>
{
  return new XSprite(sc, null,
    w?w:sp.width,
    h?h:sp.height,
    sp.texture.key,
    sp.frame.name).sprite;
};

export {XRender as default};
