// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { IMxGraph } from '../types/mxGraph';

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
  mxConstraintHandler.prototype.update = function (me, source) {
    if (this.isKeepFocusEvent(me) || !mxEvent.isAltDown(me.getEvent())) {
      mxConstraintHandlerUpdate.apply(this, arguments);
    }
    else {
      this.reset();
    }
  };
  // tslint:disable-next-line: no-function-expression
  mxGraph.prototype.getAllConnectionConstraints = function (terminal, source): any {
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
  
  graph.connectionHandler.createEdgeState = function (me) {
    const edge = graph.createEdge(null, null, null, null, null, "edgeStyle=orthogonalEdgeStyle");
    return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
  };

}
//override
function initVertexHandle() {
  mxConstants.VERTEX_SELECTION_COLOR = "#003472";
  mxConstants.VERTEX_SELECTION_STROKEWIDTH = "2";
  mxConstants.EDGE_SELECTION_COLOR = "#6b6882";
  mxConstants.EDGE_SELECTION_STROKEWIDTH = "1";
  // tslint:disable-next-line: no-function-expression
  mxVertexHandler.prototype.getSelectionColor = function (): string {
    return mxConstants.VERTEX_SELECTION_COLOR;
  };
  // tslint:disable-next-line: no-function-expression
  mxVertexHandler.prototype.getSelectionStrokeWidth = function (): string {
    return mxConstants.VERTEX_SELECTION_STROKEWIDTH;
  };
  // tslint:disable-next-line: no-function-expression
  mxVertexHandler.prototype.isSelectionDashed = function (): string {
    return mxConstants.VERTEX_SELECTION_DASHED;
  };
  mxVertexHandler.prototype.createSelectionShape = function (bounds: any): IMxShape {
    const shape = new mxRectangleShape(bounds, null, this.getSelectionColor()); // bounds, fill, stroke, strokewidth
    shape.strokewidth = this.getSelectionStrokeWidth();
    shape.isDashed = this.isSelectionDashed();
    return shape;
  };

  mxVertexHandler.prototype.init = function (): void {
    this.graph = this.state.view.graph;
    this.selectionBounds = this.getSelectionBounds(this.state);
    this.bounds = new mxRectangle(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height);
    this.selectionBorder = this.createSelectionShape(this.bounds);
    // VML dialect required here for event transparency in IE
    this.selectionBorder.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML : mxConstants.DIALECT_SVG;
    this.selectionBorder.pointerEvents = false;
    this.selectionBorder.rotation = Number(this.state.style[mxConstants.STYLE_ROTATION] || "0");
    this.selectionBorder.init(this.graph.getView().getOverlayPane());
    mxEvent.redirectMouseEvents(this.selectionBorder.node, this.graph, this.state);

    if (this.graph.isCellMovable(this.state.cell)) {
      this.selectionBorder.setCursor(mxConstants.CURSOR_MOVABLE_VERTEX);
    }

    this.customHandles = this.createCustomHandles();
    this.redraw();

    if (this.constrainGroupByChildren) {
      this.updateMinBounds();
    }
  };

}
//override
function initEdgeHandle() {
  mxEdgeHandler.prototype.isHandleVisible = function (index) {
    return false;
  }

  // tslint:disable-next-line: cyclomatic-complexity
  mxEdgeHandler.prototype.init = function () {
    this.graph = this.state.view.graph;
    this.marker = this.createMarker();
    this.constraintHandler = new mxConstraintHandler(this.graph);

    // Clones the original points from the cell
    // and makes sure at least one point exists
    this.points = [];

    // Uses the absolute points of the state
    // for the initial configuration and preview
    this.abspoints = this.getSelectionPoints(this.state);
    this.shape = this.createSelectionShape(this.abspoints);
    this.shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ?
      mxConstants.DIALECT_MIXEDHTML : mxConstants.DIALECT_SVG;
    this.shape.init(this.graph.getView().getOverlayPane());
    this.shape.pointerEvents = false;
    this.shape.setCursor(mxConstants.CURSOR_MOVABLE_EDGE);
    mxEvent.redirectMouseEvents(this.shape.node, this.graph, this.state);

    // Updates preferHtml
    this.preferHtml = this.state.text != null &&
      this.state.text.node.parentNode == this.graph.container;

    if (!this.preferHtml) {
      // Checks source terminal
      const sourceState = this.state.getVisibleTerminalState(true);

      if (sourceState != null) {
        this.preferHtml = sourceState.text != null &&
          sourceState.text.node.parentNode == this.graph.container;
      }

      if (!this.preferHtml) {
        // Checks target terminal
        const targetState = this.state.getVisibleTerminalState(false);

        if (targetState != null) {
          this.preferHtml = targetState.text != null &&
            targetState.text.node.parentNode == this.graph.container;
        }
      }
    }

    // Adds highlight for parent group
    if (this.parentHighlightEnabled) {
      const parent = this.graph.model.getParent(this.state.cell);

      if (this.graph.model.isVertex(parent)) {
        const pstate = this.graph.view.getState(parent);

        if (pstate != null) {
          this.parentHighlight = this.createParentHighlightShape(pstate);
          // VML dialect required here for event transparency in IE
          this.parentHighlight.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML : mxConstants.DIALECT_SVG;
          this.parentHighlight.pointerEvents = false;
          this.parentHighlight.rotation = Number(pstate.style[mxConstants.STYLE_ROTATION] || '0');
          this.parentHighlight.init(this.graph.getView().getOverlayPane());
        }
      }
    }
    // [remove a code about initialize this.bends]

    // Adds a rectangular handle for the label position
    this.label = new mxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y);
    this.labelShape = this.createLabelHandleShape();
    this.initBend(this.labelShape);
    this.labelShape.setCursor(mxConstants.CURSOR_LABEL_HANDLE);

    this.customHandles = this.createCustomHandles();

    this.redraw();
  };

}

function initStyleSheet(graph: IMxGraph) {
  const style = graph.getStylesheet().getDefaultEdgeStyle();
  style.strokeColor = "#1685a9";
  style.fontColor = "#000000";
  style.fontStyle = "0";
  style.fontStyle = "0";
  // style.startSize = "8";
  // style.endSize = "8";
  // style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_CURVED] = "1";
}

export function init(graph: IMxGraph): void {
  mxGraph.prototype.tolerance = 8;
  graph.setConnectable(true);
  initStyleSheet(graph);
  initConstraintHandler();
  initConnection(graph);
  initVertexHandle();
  initEdgeHandle();
}
