import * as React from "react";
import {
  ICanvasData,
} from "../types/flow";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  IMxGraphContext,
  MxGraphContext
} from "../context/MxGraphContext";

interface IFlowProps {
  data: ICanvasData;
}

const {
  mxGraph,
} = mxGraphJs;

export class Flow extends React.PureComponent<IFlowProps> {
  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const {
          container,
        } = value;

        const graph = new mxGraph(container);

        if (graph) {
          graph
            .getModel()
            .beginUpdate();

          try {
            const parent = graph.getDefaultParent();

            const vertexes = this.props.data.nodes.map((node) => {
              const width = node.size ? node.size[0] : 200;
              const height = node.size ? node.size[1] : 200;

              return {
                vertex: graph.insertVertex(parent, null, node.label, node.x, node.y, width, height),
                id: node.id
              };
            });

            this.props.data.edges.forEach((edge) => {
              const source = vertexes.find((v) => v.id === edge.source);
              const target = vertexes.find((v) => v.id === edge.target);

              if (source && target) {
                graph.insertEdge(parent, null, "", source.vertex, target.vertex);
              }
            });
          } finally {
            graph
              .getModel()
              .endUpdate();
          }
        } else {
          throw new Error("Init mxGraph failed");
        }

        return null;
      }}
      </MxGraphContext.Consumer>
    );
  }
}
