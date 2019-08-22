// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { ImxCell, IMxGraph, IMxMouseEvent } from "../types/mxGraph";
import { initPort } from "./port";
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

// override to disallow resizing of edge
// tslint:disable-next-statement
function initEdgeHandle(): void {
  // tslint:disable
  mxEdgeHandler.prototype.isHandleVisible = (index) => {
    return true;
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

function initStyleSheet(graph: IMxGraph): void {
  const edgeStyle = graph.getStylesheet()
    .getDefaultEdgeStyle();

  // Changes the default edge style
  edgeStyle.edgeStyle = "orthogonalEdgeStyle";
  edgeStyle.strokeColor = "grey"; // "#1685a9";
  edgeStyle.fontColor = "#000000";
  edgeStyle.fontStyle = "0";
  edgeStyle.fontStyle = "0";

  edgeStyle[mxConstants.STYLE_CURVED] = "1";

  const vertexStyle = graph.getStylesheet()
    .getDefaultVertexStyle();
  vertexStyle.strokeColor = "grey";
  vertexStyle.fillColor = "white";
  vertexStyle.fontColor = "#424242";

  // for selection border
  mxConstants.VERTEX_SELECTION_COLOR = "#1976d2";
  mxConstants.VERTEX_SELECTION_STROKEWIDTH = "1";
  mxConstants.VERTEX_SELECTION_DASHED = 0;

  mxConstants.EDGE_SELECTION_COLOR = "#1976d2";
  mxConstants.EDGE_SELECTION_DASHED = 0;
  //

  mxConstants.SHADOW_OPACITY = 0.1;
}

// tslint:disable
function initHighlightShape(graph: IMxGraph): void {
  // Shows connection points only if cell not selected
  graph.connectionHandler.constraintHandler.isStateIgnored = function (state, source) {
    return source && state.view.graph.isCellSelected(state.cell);
  };
  // override  mxConstraintHandler.prototype.highlightColor = mxConstants.DEFAULT_VALID_COLOR
  mxConstraintHandler.prototype.highlightColor = "#29b6f6";
  graph.defaultEdgeStyle = {
    'edgeStyle': 'orthogonalEdgeStyle', 'rounded': '0', 'html': '1',
    'jettySize': 'auto', 'orthogonalLoop': '1'
  }
  graph.currentEdgeStyle = graph.defaultEdgeStyle;
  graph.createCurrentEdgeStyle = function () {
    var style = 'edgeStyle=' + (this.currentEdgeStyle['edgeStyle'] || 'none') + ';';
    if (this.currentEdgeStyle['shape']) style += 'shape=' + this.currentEdgeStyle['shape'] + ';';
    if (this.currentEdgeStyle['curved']) style += 'curved=' + this.currentEdgeStyle['curved'] + ';';
    if (this.currentEdgeStyle['rounded']) style += 'rounded=' + this.currentEdgeStyle['rounded'] + ';';
    if (this.currentEdgeStyle['comic']) style += 'comic=' + this.currentEdgeStyle['comic'] + ';';
    // Special logic for custom property of elbowEdgeStyle
    if (this.currentEdgeStyle['edgeStyle'] == 'elbowEdgeStyle' && this.currentEdgeStyle['elbow']) {
      style += 'elbow=' + this.currentEdgeStyle['elbow'] + ';';
    }
    if (this.currentEdgeStyle['html']) style += 'html=' + this.currentEdgeStyle['html'] + ';';
    else style += 'html=1;';

    return style;
  };
  // mxConstants.HIGHLIGHT_OPACITY = 30;
  mxConstraintHandler.prototype.createHighlightShape = function () {
    var hl = new mxEllipse(null, this.highlightColor, this.highlightColor, 0);
    hl.opacity = mxConstants.HIGHLIGHT_OPACITY;

    return hl;
  };
  // Uses current edge style for connect preview 
  // mxConnectionHandler.prototype.createEdgeState = function (me) {
  //   // var style = this.graph.createCurrentEdgeStyle();
  //   // var edge = this.graph.createEdge(null, null, null, null, null, style);
  //   // var state = new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
  //   // for (var key in this.graph.currentEdgeStyle) {
  //   //   state.style[key] = this.graph.currentEdgeStyle[key];
  //   // }
  //   // return state;
  //   return null;
  // };

  graph.connectionHandler.createEdgeState = function (me: IMxMouseEvent) {
    var edge = graph.createEdge(null, null, null, null, null);

    return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
  };
  // Overrides edge preview to use current edge shape and default style
  mxConnectionHandler.prototype.livePreview = true;
  mxConnectionHandler.prototype.cursor = 'crosshair';
  // Overrides dashed state with current edge style
  var connectionHandlerCreateShape = mxConnectionHandler.prototype.createShape;
  mxConnectionHandler.prototype.createShape = function () {
    var shape = connectionHandlerCreateShape.apply(this, arguments);
    shape.isDashed = this.graph.currentEdgeStyle[mxConstants.STYLE_DASHED] == '1';
    return shape;
  }
  // change valid and invalid color of edge preview
  mxConstants.VALID_COLOR = "#54cb30";
  mxConstants.INVALID_COLOR = "#c63530";
  // Overrides live preview to keep current style
  mxConnectionHandler.prototype.updatePreview = function (valid: boolean) {
    // do not change color of preview
    this.shape.stroke = this.getEdgeColor(valid);
  };

  // tslint:enable
}

function setLabelUnmovable(): void {
  // tslint:disable-next-line: no-function-expression
  mxGraph.prototype.isLabelMovable = function(cell: ImxCell): boolean {
    return false;
  };
}

function unableDanglingEdges(graph: IMxGraph): void {
  graph.setAllowDanglingEdges(false);
  graph.setDisconnectOnMove(false);
}

function repairDragCoordinate(): void {
  // tslint:disable
  mxDragSource.prototype.dragOver = function (graph, evt) {
    var offset = mxUtils.getOffset(graph.container);
    // var origin = mxUtils.getScrollOrigin(graph.container);
    var origin = { x: 0, y: 0 };
    var x = mxEvent.getClientX(evt) - offset.x + origin.x - graph.panDx;
    var y = mxEvent.getClientY(evt) - offset.y + origin.y - graph.panDy;

    if (graph.autoScroll && (this.autoscroll == null || this.autoscroll)) {
      graph.scrollPointToVisible(x, y, graph.autoExtend);
    }

    // Highlights the drop target under the mouse
    if (this.currentHighlight != null && graph.isDropEnabled()) {
      this.currentDropTarget = this.getDropTarget(graph, x, y, evt);
      var state = graph.getView().getState(this.currentDropTarget);
      this.currentHighlight.highlight(state);
    }

    // Updates the location of the preview
    if (this.previewElement != null) {
      if (this.previewElement.parentNode == null) {
        graph.container.appendChild(this.previewElement);

        this.previewElement.style.zIndex = '3';
        this.previewElement.style.position = 'absolute';
      }

      var gridEnabled = this.isGridEnabled() && graph.isGridEnabledEvent(evt);
      var hideGuide = true;

      // Grid and guides
      if (this.currentGuide != null && this.currentGuide.isEnabledForEvent(evt)) {
        // LATER: HTML preview appears smaller than SVG preview
        var w = parseInt(this.previewElement.style.width);
        var h = parseInt(this.previewElement.style.height);
        var bounds = new mxRectangle(0, 0, w, h);
        var delta = new mxPoint(x, y);
        delta = this.currentGuide.move(bounds, delta, gridEnabled);
        hideGuide = false;
        x = delta.x;
        y = delta.y;
      }
      else if (gridEnabled) {
        var scale = graph.view.scale;
        var tr = graph.view.translate;
        var off = graph.gridSize / 2;
        x = (graph.snap(x / scale - tr.x - off) + tr.x) * scale;
        y = (graph.snap(y / scale - tr.y - off) + tr.y) * scale;
      }

      if (this.currentGuide != null && hideGuide) {
        this.currentGuide.hide();
      }

      if (this.previewOffset != null) {
        x += this.previewOffset.x;
        y += this.previewOffset.y;
      }

      this.previewElement.style.left = Math.round(x) + 'px';
      this.previewElement.style.top = Math.round(y) + 'px';
      this.previewElement.style.visibility = 'visible';
    }

    this.currentPoint = new mxPoint(x, y);
  };
  // tslint:enable
}

export function init(graph: IMxGraph): void {

  mxGraph.prototype.tolerance = 8;
  repairDragCoordinate();
  setLabelUnmovable();
  unableDanglingEdges(graph);

  graph.setCellsResizable(false);
  graph.setConnectable(true);
  initStyleSheet(graph);

  initEdgeHandle();

  initHighlightShape(graph);
  // html in-place editor
  graph.setHtmlLabels(true);

  initPort(graph);
}
