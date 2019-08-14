
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
