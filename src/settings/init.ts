// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { IMxConnectionConstraint, IMxGraph, IMxState } from "../types/mxGraph";
// import { registerShape } from "./Shapes";
const {
  mxEvent,
  mxConstraintHandler,
  mxGraph,
  mxConnectionConstraint,
  mxPoint,
  mxUtils,
  mxEllipse,
  mxRectangleShape,
  mxVertexHandler,
  mxConstants,
  mxRectangle,
  mxEdgeHandler,
  mxConnectionHandler,
  mxCellState,
  mxCloud,
  mxRhombus,
} = mxGraphJs;

// tslint:disable-next-line: export-name
function initConstraintHandler(): void {
  const mxConstraintHandlerUpdate = mxConstraintHandler.prototype.update;
  mxConstraintHandler.prototype.update = function(me, source): void {
    // tslint:disable-next-line: no-invalid-this
    if (this.isKeepFocusEvent(me) || !mxEvent.isAltDown(me.getEvent())) {
      // tslint:disable-next-line: no-invalid-this
      mxConstraintHandlerUpdate.apply(this, arguments);
    }
    else {
      // tslint:disable-next-line: no-invalid-this
      this.reset();
    }
  };
  // tslint:disable-next-line: no-function-expression
  mxGraph.prototype.getAllConnectionConstraints = function(terminal, source): IMxConnectionConstraint[] | null {
    if (terminal) {
      const constraints = mxUtils.getValue(terminal.style, "points", null);
      if (constraints) {
        // Requires an array of arrays with x, y (0..1) and an optional
        // perimeter (0 or 1), eg. points=[[0,0,1],[0,1,0],[1,1]]
        const result = [];
        try {
          const c = JSON.parse(constraints);
          for (const tmp of c) {
            result.push(new mxConnectionConstraint(new mxPoint(tmp[0], tmp[1]), (tmp.length > 2) ? tmp[2] !== "0" : true));
          }
        }
        catch (e) {
          // ignore
        }
        return result;
      }
      else {
        if (terminal.shape) {
          if (terminal.shape.stencil) {
            return terminal.shape.stencil.constraints;
          }
          else if (terminal.shape.constraints) {
            return terminal.shape.constraints;
          }
        }
      }
    }

    return null;
  };
}

function initConnection(graph: IMxGraph): void {
  mxEllipse.prototype.constraints = [
    new mxConnectionConstraint(new mxPoint(0, 0), true), new mxConnectionConstraint(new mxPoint(1, 0), true),
    new mxConnectionConstraint(new mxPoint(0, 1), true), new mxConnectionConstraint(new mxPoint(1, 1), true),
    new mxConnectionConstraint(new mxPoint(0.5, 0), true), new mxConnectionConstraint(new mxPoint(0.5, 1), true),
    new mxConnectionConstraint(new mxPoint(0, 0.5), true), new mxConnectionConstraint(new mxPoint(1, 0.5))
  ];
  mxRectangleShape.prototype.constraints = [
    new mxConnectionConstraint(new mxPoint(0.25, 0), true),
    new mxConnectionConstraint(new mxPoint(0.5, 0), true),
    new mxConnectionConstraint(new mxPoint(0.75, 0), true),
    new mxConnectionConstraint(new mxPoint(0, 0.25), true),
    new mxConnectionConstraint(new mxPoint(0, 0.5), true),
    new mxConnectionConstraint(new mxPoint(0, 0.75), true),
    new mxConnectionConstraint(new mxPoint(1, 0.25), true),
    new mxConnectionConstraint(new mxPoint(1, 0.5), true),
    new mxConnectionConstraint(new mxPoint(1, 0.75), true),
    new mxConnectionConstraint(new mxPoint(0.25, 1), true),
    new mxConnectionConstraint(new mxPoint(0.5, 1), true),
    new mxConnectionConstraint(new mxPoint(0.75, 1), true)
  ];
  mxCloud.prototype.constraints = [
    new mxConnectionConstraint(new mxPoint(0.25, 0.25), false),
    new mxConnectionConstraint(new mxPoint(0.4, 0.1), false),
    new mxConnectionConstraint(new mxPoint(0.16, 0.55), false),
    new mxConnectionConstraint(new mxPoint(0.07, 0.4), false),
    new mxConnectionConstraint(new mxPoint(0.31, 0.8), false),
    new mxConnectionConstraint(new mxPoint(0.13, 0.77), false),
    new mxConnectionConstraint(new mxPoint(0.8, 0.8), false),
    new mxConnectionConstraint(new mxPoint(0.55, 0.95), false),
    new mxConnectionConstraint(new mxPoint(0.875, 0.5), false),
    new mxConnectionConstraint(new mxPoint(0.96, 0.7), false),
    new mxConnectionConstraint(new mxPoint(0.625, 0.2), false),
    new mxConnectionConstraint(new mxPoint(0.88, 0.25), false)
  ];
  mxRhombus.prototype.constraints = mxEllipse.prototype.constraints;

  if (!graph.connectionHandler.connectImage) {
    graph.connectionHandler.isConnectableCell = (cell) => {
      return false;
    };
    mxEdgeHandler.prototype.isConnectableCell = (cell) => {
      return graph.connectionHandler.isConnectableCell(cell);
    };
  }

  graph.connectionHandler.createEdgeState = function(me): IMxState {
    const edge = graph.createEdge(null, null, null, null, null, "edgeStyle=orthogonalEdgeStyle");
    // tslint:disable-next-line: no-invalid-this
    return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
  };

}

function initStyleSheet(graph: IMxGraph): void {
  const style = graph.getStylesheet()
                     .getDefaultEdgeStyle();
  // style.strokeColor = "#1685a9";
  style.fontColor = "#000000";
  style.fontStyle = "0";
  style.fontStyle = "0";
  // style.startSize = "8";
  // style.endSize = "8";
  // style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_CURVED] = "1";

  mxConstants.VERTEX_SELECTION_COLOR = "#003472";
  mxConstants.VERTEX_SELECTION_STROKEWIDTH = "2";
  mxConstants.EDGE_SELECTION_COLOR = "#FFFFFF";
}

export function init(graph: IMxGraph): void {
  mxGraph.prototype.tolerance = 8;
  // registerShape();
  graph.setCellsResizable(false);
  graph.setConnectable(true);
  initStyleSheet(graph);
  initConstraintHandler();
  initConnection(graph);
  // initVertexHandle();
  // initEdgeHandle();
}
