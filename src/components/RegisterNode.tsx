import * as React from "react";

import { IMxGraphContext, MxGraphContext } from "../context/MxGraphContext";
import {
  mxCellRenderer,
  mxEllipse,
  mxRectangleShape,
  mxUtils,
} from "../mxgraph";

import {
  IConfig,
} from "../types/shapes";

type ExtendableShape = "rectangle" | "ellipse";

interface IRegisterNodeProps {
  name: string;
  config: IConfig;
  extend: ExtendableShape;
}

const builtInShape = {
  // tslint:disable-next-line: ban-types
  rectangle: (mxRectangleShape as Function),
  // tslint:disable-next-line: ban-types
  ellipse: (mxEllipse as Function),
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
      // @ts-ignore
      extendedShape.call(this);
    }
    mxUtils.extend(registerShape, extendedShape);
    mxCellRenderer.registerShape(this.props.name, registerShape);
  }

  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const { customShape } = value;
        if (!customShape) {
          throw new Error("no custome shape in mxgraph component");
        }
        customShape.push({name: this.props.name, styleConfig: this.props.config});
        return null;
      }}</MxGraphContext.Consumer>
    );
  }
}
