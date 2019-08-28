import { IMxState, IStylesheet } from "./mxGraph";

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

export interface IShape {
  style: string;
}

export interface IMxShape {
  style: IConfig;
  apply(state: IMxState): void;
  redraw(): void;
}

export interface IMxRectangleShape extends IMxShape {
  style: IConfig;
  boundingBox: IMxRectangle;
  bounds: IMxRectangle;
}

export interface IMxEllipse extends IMxShape {
  style: IConfig;
}

export interface IMxText extends IMxShape {
  style: IConfig;
  background: string;
  color: string;
  cursor: string;
  dialect: string;
  family: string;
  fill: string;
}

export interface IMxPoint {
  x: number;
  y: number;
  getCenterX(): number;
  getCenterY(): number;
  getPoint(): IMxPoint;
}

export interface IMxRectangle extends IMxPoint {
  x: number;
  y: number;
  height: number;
  width: number;
  intersect(rect: IMxRectangle): void;
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
