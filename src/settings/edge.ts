// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { ImxCell, IMxGraph, IMxMouseEvent, IMxState } from "../types/mxGraph";
// import { registerShape } from "./Shapes";
const {
  mxEvent,
  mxConstraintHandler,
  mxGraph,
  mxPoint,
  mxEllipse,
  mxConstants,
  mxEdgeHandler,
  mxConnectionHandler,
  mxCellState,
  mxDragSource,
  mxRectangle,
  mxUtils,
} = mxGraphJs;

const setSelectionShape = (): void => {
  mxEdgeHandler.prototype.createSelectionShape = function (points) {
    const shape = new this.state.shape.constructor();
    shape.outline = false;
    // shape.apply(this.state);

    // // shape.fill = this.getSelectionColor();
    // shape.fill = "black";
    // shape.stroke = "black";
    // shape.isDashed = this.isSelectionDashed();
    // // shape.stroke = this.getSelectionColor();
    // shape.isShadow = false;
    return shape;
  };

  mxEdgeHandler.prototype.drawPreview = function () {
    if (this.isLabel) {
      var b = this.labelShape.bounds;
      var bounds = new mxRectangle(Math.round(this.label.x - b.width / 2),
        Math.round(this.label.y - b.height / 2), b.width, b.height);
      this.labelShape.bounds = bounds;
      this.labelShape.redraw();
    }
    else if (this.shape != null) {
      this.shape.apply(this.state);
      this.shape.points = this.abspoints;
      this.shape.scale = this.state.view.scale;
      this.shape.isDashed = this.isSelectionDashed();
      this.shape.stroke = this.getSelectionColor();
      this.shape.fill = this.getSelectionColor();
      this.shape.strokewidth = this.getSelectionStrokeWidth() / this.shape.scale / this.shape.scale;
      this.shape.arrowStrokewidth = this.getSelectionStrokeWidth();
      this.shape.arrowStroke = this.getSelectionColor();
      this.shape.isShadow = false;
      console.log(this.shape);
      this.shape.redraw();
    }

    if (this.parentHighlight != null) {
      this.parentHighlight.redraw();
    }
  };
};

const setEdgeUnmovable = (graph: IMxGraph): void => {
  graph.isCellMovable = function(cell) {
    var state = graph.view.getState(cell);
    var style = (state != null) ? state.style : graph.getCellStyle(cell);
    if( graph.getModel().isEdge(cell) ) return false;
    return graph.isCellsMovable() && !graph.isCellLocked(cell) && style[mxConstants.STYLE_MOVABLE] != 0;
  };
};

// override to disallow resizing of edge
// tslint:disable-next-statement
export function initEdgeHandle(graph: IMxGraph): void {
  // tslint:disable
  mxEdgeHandler.prototype.isHandleVisible = (index) => {
    return true;
  }

  setSelectionShape();
  setEdgeUnmovable(graph);

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
    if (this.graph.isCellMovable(this.state.cell)) {
      this.shape.setCursor(mxConstants.CURSOR_MOVABLE_EDGE);
    }
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
    // [remove a piece of code about initializing this.bends from the original function]

    // Adds a rectangular handle for the label position
    this.label = new mxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y);
    this.labelShape = this.createLabelHandleShape();
    this.initBend(this.labelShape);
    this.labelShape.setCursor(mxConstants.CURSOR_LABEL_HANDLE);

    this.customHandles = this.createCustomHandles();
    console.log(this.marker);
    this.redraw();
    // tslint:enable
  };

}

