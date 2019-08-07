
interface IShape {
  style: string;
}

export interface IShapeMap {
  rectangle: IShape;
  round: IShape;
  ellipse: IShape;
  rhombus: IShape;
  cloud: IShape;
}

export const Shapes: IShapeMap = {
  rectangle: { style: "shape=rectangle;fillColor=#F0F8FF", },
  round: { style: "rounded=1;fillColor=#E6E6FA",  },
  ellipse: { style: "shape=ellipse;fillColor=#FAF0E6;perimeter=ellipsePerimeter", },
  rhombus: { style: "shape=rhombus;fillColor=#F0FFF0;perimeter=rhombusPerimeter", },
  cloud: { style: "shape=cloud;fillColor=#F0FFF0;perimeter=ellipsePerimeter"},
}