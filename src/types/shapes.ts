import { IStylesheet } from "./mxGraph";

export interface IConfig {
  rounded?: 0 | 1;
  fillColor?: string;
  shadow?: 0 | 1;
  strokeWidth?: number; // boarder
  strokeColor?: string;
  shape?: string;
  fontColor?: string;
  fontSize?: number;
  gradientColor?: string;
  gradientDirection?: string;
  opacity?: number;
  arcSize?: number; // 0~50
  labelBackgroundColor?: string;
  labelBorderColor?: string;
  textOpacity?: number; // 0~100
  fontFamily?: string;
  points?: number[][];
}

interface IShape {
  style: string;
}

export interface IShapeMap {
  rectangle: IShape;
  ellipse: IShape;
  rhombus: IShape;
  cloud: IShape;
}

export const BuiltInShapes: IShapeMap = {
  rectangle: { style: "shape=rectangle;fillColor=#F0F8FF", },
  ellipse: { style: "shape=ellipse;fillColor=#FAF0E6;perimeter=ellipsePerimeter", },
  rhombus: { style: "shape=rhombus;fillColor=#F0FFF0;perimeter=rhombusPerimeter", },
  cloud: { style: "shape=cloud;fillColor=#F0FFF0;perimeter=ellipsePerimeter"},
  // roundRec: { style: "shape=terminator;fillColor=#E6E6FA;"},
  // box: { style: "shape=box;fillColor=#E6E6FA;"},
};

export interface ICustomShape {
  name: string;
  styleConfig: IConfig;
}

export const setStyle = (config: IStylesheet) => {
  let style = "";
  for (const key of Object.keys(config)) {
    if (key === "points") {
      style += `;${key}=${JSON.stringify(config[key])}`;
    } else {
      style += `;${key}=${config[key]}`;
    }
  }
  return style;
};

export const shapeDictionary: object = { };
