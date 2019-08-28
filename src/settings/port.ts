// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import { IMxCell, IMxGraph, IMxMouseEvent, IMxState } from "../types/mxGraph";
const {
  mxGraph,
  mxConstants,
  mxEdgeHandler,
  mxVertexHandler,
  mxRectangle,
  mxEvent,
  mxCellMarker,
  mxCellHighlight,
  mxGraphView,
  mxClient,
  mxUtils,
  mxPoint,
} = mxGraphJs;

// tslint:disable

function setPortHandler(_graph: IMxGraph): void {

  mxVertexHandler.prototype.createSelectionShape = function (state: IMxState) {
    const shape = this.graph.cellRenderer.createShape(state);
    shape.style = state.shape.style;

    shape.isDashed = this.isSelectionDashed();
    shape.isRounded = state.style[mxConstants.STYLE_ROUNDED];
    const isPort = this.graph.isPort(state.cell);

    shape.fill = isPort ? state.style[mxConstants.STYLE_FILLCOLOR] : this.getSelectionColor();
    shape.stroke = this.getSelectionColor();

    shape.fillOpacity = isPort ? 100 : 20;
    shape.strokeOpacity = 100;
    return shape;
  };

  mxVertexHandler.prototype.init = function () {
    this.graph = this.state.view.graph;
    this.selectionBounds = this.getSelectionBounds(this.state);
    this.bounds = new mxRectangle(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height);
    this.selectionBorder = this.createSelectionShape(this.state);

    this.selectionBorder.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML : mxConstants.DIALECT_SVG;
    this.selectionBorder.pointerEvents = false;
    this.selectionBorder.init(this.graph.getView().getOverlayPane());


    if (this.graph.isCellMovable(this.state.cell)) {
      this.selectionBorder.setCursor(mxConstants.CURSOR_MOVABLE_VERTEX);
    }

    this.sizers = [];

    this.customHandles = this.createCustomHandles();
    this.redraw();

    if (this.constrainGroupByChildren) {
      this.updateMinBounds();
    }
  };

}

function setPortValidationStyle(_graph: IMxGraph) {
  mxCellMarker.prototype.getMarkerColor = function (_evt: PointerEvent, _state: IMxState, isValid: boolean) {
    return (isValid) ? "#1565c0" : "red";
  };
  mxCellHighlight.prototype.repaint = function () {
    if (this.state != null && this.shape != null) {
      if (this.graph.model.isEdge(this.state.cell)) {
        this.shape.points = this.state.absolutePoints;
      }
      else {
        this.shape.bounds = new mxRectangle(this.state.x - this.spacing, this.state.y - this.spacing,
          this.state.width + 2 * this.spacing, this.state.height + 2 * this.spacing);
        this.shape.rotation = Number(this.state.style[mxConstants.STYLE_ROTATION] || '0');
      }

      // Uses cursor from shape in highlight
      if (this.state.shape != null) {
        this.shape.setCursor(this.state.shape.getCursor());
      }

      // if (mxClient.IS_QUIRKS || document.documentMode == 8) {
      if (mxClient.IS_QUIRKS) {
        if (this.shape.stroke == 'transparent') {
          this.shape.stroke = 'white';
          this.shape.opacity = 1;
        }
        else {
          this.shape.opacity = this.opacity;
        }
      }

      this.shape.redraw();
    }
  };

  // the code calculates graphX and graphY of mxMouseEvent
  // which involve intersection calculation in mxUtils.intersectsHotspot
  mxUtils.convertPoint = function (container: HTMLDivElement, x: number, y: number) {
    var origin = mxUtils.getScrollOrigin(container);
    var offset = mxUtils.getOffset(container);

    offset.x -= origin.x;
    offset.y -= origin.y;

    return new mxPoint(x - offset.x, y - offset.y);
  }

  mxCellHighlight.prototype.createShape = function () {
    var shape = this.graph.cellRenderer.createShape(this.state);
    shape.svgStrokeTolerance = this.graph.tolerance;
    shape.scale = this.state.view.scale;

    shape.points = this.state.absolutePoints;
    shape.apply(this.state);
    // shape.strokewidth = this.spacing / this.state.view.scale / this.state.view.scale;
    // shape.arrowStrokewidth = this.spacing;
    // shape.stroke = this.highlightColor;
    shape.opacity = 50;
    shape.fill = this.highlightColor;
    shape.isDashed = this.dashed;
    shape.isShadow = false;
    shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML : mxConstants.DIALECT_SVG;
    shape.init(this.graph.getView().getOverlayPane()); // make node
    mxEvent.redirectMouseEvents(shape.node, this.graph, this.state); // fire connection event
    // if (this.graph.dialect != mxConstants.DIALECT_SVG) {
    //   shape.pointerEvents = false;
    // }
    // else {
    //   shape.svgPointerEvents = 'stroke';
    // }

    return shape;
  };

}

function setHotspot(_graph: IMxGraph) {

  mxCellMarker.prototype.intersects = function (state: IMxState, me: IMxMouseEvent) {
    if (this.hotspotEnabled) {
      return mxUtils.intersectsHotspot(state, me.getGraphX(), me.getGraphY(),
        10, mxConstants.MIN_HOTSPOT_SIZE,
        mxConstants.MAX_HOTSPOT_SIZE);
    }

    return true;
  };
}

function setTooltips(graph: IMxGraph) {
  graph.setTooltips(true);
  graph.getTooltipForCell = function (cell) {
    if (graph.getModel().isEdge(cell)) {
      return graph.convertValueToString(this.model.getTerminal(cell, true)) +
        graph.convertValueToString(this.model.getTerminal(cell, false));
    }
    return mxGraph.prototype.getTooltipForCell.apply(this, arguments);
  };
}

function setSelectionRecursively(graph: IMxGraph) {
  const selectModel = graph.getSelectionModel();
  const setCells = selectModel.setCells;
  selectModel.setCells = function (cells: IMxCell[]) {
    setCells.call(selectModel,
      cells.filter(cell => cell != null)
        .map(cell => cell.getChildCount() ? [cell, ...cell.children.filter(port => graph.isPort(port))] : [cell])
        .reduce((arr, cells) => arr.concat(cells), [])
    );
  };
}

// function preventChildrenFromBeingRemoved(graph: IMxGraph) {
//   // graph.graphHandler.shouldRemoveCellsFromParent = (parent, cells, evt) => {
//   //   const bl =  (cells.length == 0 && !cells[0].geometry.relative && mxGraphHandler.prototype.shouldRemoveCellsFromParent.apply(this, arguments));
//   //   console.log(bl);
//   // };
// }

// tslint:disable-next-line: export-name
export function initPort(graph: IMxGraph) {

  setPortHandler(graph);
  setPortValidationStyle(graph);
  setHotspot(graph);
  graph.disconnectOnMove = false;
  graph.foldingEnabled = false;
  graph.cellsResizable = false;
  graph.extendParents = false;

  graph.getLabel = function (cell: IMxCell) {
    let label = mxGraph.prototype.getLabel.apply(this, arguments); // "supercall"
    if (this.isCellLocked(cell)) { return ""; }
    else if (this.isCellCollapsed(cell)) {
      const index = label.indexOf("</h1>");
      if (index > 0) { label = label.substring(0, index + 5); }
    }
    return label;
  }


  graph.isPort = (cell) => {
    const geo = graph.getCellGeometry(cell);
    return geo ? graph.getModel().isVertex(cell) && geo.relative : false;
  };
  setTooltips(graph);
  // Removes the folding icon and disables any folding
  graph.isCellFoldable = function (_cell: IMxCell) {
    return false;
  };
  graph.view.updateFixedTerminalPoint = function (edge, terminal, source, _constraint) {
    mxGraphView.prototype.updateFixedTerminalPoint.apply(this, arguments);

    var pts = edge.absolutePoints;
    var pt = pts[(source) ? 0 : pts.length - 1];

    if (terminal != null && pt == null && this.getPerimeterFunction(terminal) == null) {
      edge.setAbsoluteTerminalPoint(new mxPoint(this.getRoutingCenterX(terminal),
        this.getRoutingCenterY(terminal)), source)
    }
  };

  if (!graph.connectionHandler.connectImage) {
    graph.connectionHandler.isConnectableCell = (cell) => {
      return graph.isPort(cell);
    };
    mxEdgeHandler.prototype.isConnectableCell = (cell: IMxCell) => {
      return graph.connectionHandler.isConnectableCell(cell);
    };
  }

  setSelectionRecursively(graph);
}
