import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { IMxGraphContext, MxGraphContext } from "../context/MxGraphContext";
import { IStylesheet } from "../types/mxGraph";
const {
  mxCellRenderer,
  mxRectangle,
  mxEllipse,
  mxUtils,
  mxConstants,
} = mxGraphJs;

interface IConfig {
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

type ExtendableShape = "rectangle" | "ellipse";

interface IRegisterNodeProps {
  name: string;
  config: IConfig;
  extend: ExtendableShape;
}

const builtInShape = {
  rectangle: mxRectangle,
  ellipse: mxEllipse,
};

export class RegisterNode extends React.PureComponent<IRegisterNodeProps> {
  constructor(props: IRegisterNodeProps) {
    super(props);
    const extend = this.props.extend;
    if (!builtInShape.hasOwnProperty(extend)) {
      throw new Error("illegal built-in shape");
    }
    const extendedShape = builtInShape[extend];
    function registerShape(): void {
      extendedShape.call(this);
    }
    mxUtils.extend(registerShape, extendedShape);
    mxCellRenderer.registerShape(this.props.name, registerShape);
  }

  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const { graph } = value;
        if (graph) {
          const style = graph.getStylesheet()
                             .createDefaultVertexStyle(); // default
          style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
          style[mxConstants.STYLE_PERIMETER] = "rectanglePerimeter";
          style[mxConstants.STYLE_ROUNDED] = true;
          this.setStyle(style);
          graph.getStylesheet()
               .putCellStyle(this.props.name, style);
        }
        return null;
      }}</MxGraphContext.Consumer>
    );
  }

  private readonly setStyle = (style: IStylesheet) => {
    Object.assign(style, this.props.config);

  }
}
