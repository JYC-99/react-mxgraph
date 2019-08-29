import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";
import { IMxGraph } from "../types/mxGraph";

const {
  mxOutline,
} = mxGraphJs;

interface IMinimapProps {
  width?: string;
  height?: string;
}

// tslint:disable-next-line: no-empty-interface
interface IOutline {

}

export class Minimap extends React.PureComponent<IMinimapProps> {
  private readonly _containerRef = React.createRef<HTMLDivElement>();
  private outline?: IOutline;

  constructor(props: IMinimapProps) {
    super(props);

  }
  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const {
          graph,
        } = value;

        if (graph) {
          this._initMiniMap(graph);
        }

        return (
          <div className="minimap-container" style={{height: this.props.height, width: this.props.width}} ref={this._containerRef} />
        );
      }}
      </MxGraphContext.Consumer>
    );
  }
  private readonly _initMiniMap = (graph: IMxGraph): void => {
    if (this._containerRef.current === null) {
      throw new Error("empty minimap container");
    }
    this.outline = new mxOutline(graph, this._containerRef.current);
  }
}
