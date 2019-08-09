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
  Graph
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

  // graph.connectionHandler.createEdgeState = function(me): IMxState {
  //   const edge = graph.createEdge(null, null, null, null, null, "edgeStyle=orthogonalEdgeStyle;resizable=0");
  //   // tslint:disable-next-line: no-invalid-this
  //   console.log(edge);
  //   return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
  // };

}

// override to disallow resizing of edge
// tslint:disable-next-statement
function initEdgeHandle(): void {
  // tslint:disable
  mxEdgeHandler.prototype.isHandleVisible = (index) => {
    return false;
  }

  // tslint:disable-next-line: cyclomatic-complexity
  mxEdgeHandler.prototype.init = function() {
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
  edgeStyle.strokeColor = "grey"; // "#1685a9";
  edgeStyle.fontColor = "#000000";
  edgeStyle.fontStyle = "0";
  edgeStyle.fontStyle = "0";
  // style.startSize = "8";
  // style.endSize = "8";
  // style[mxConstants.STYLE_ROUNDED] = true;
  edgeStyle[mxConstants.STYLE_CURVED] = "1";

  const vertexStyle = graph.getStylesheet()
                        .getDefaultVertexStyle();
  vertexStyle.strokeColor = "grey";
  vertexStyle.fillColor = "white";
  vertexStyle.fontColor = "#424242";

  mxConstants.VERTEX_SELECTION_COLOR = "#1976d2";
  mxConstants.VERTEX_SELECTION_STROKEWIDTH = "1";
  mxConstants.VERTEX_SELECTION_DASHED = 0;

  mxConstants.EDGE_SELECTION_COLOR = "#1976d2";
  mxConstants.EDGE_SELECTION_DASHED = 0;

  mxConstants.SHADOW_OPACITY = 0.1;
}

// tslint:disable
function initHighlightShape(graph): void {
  // override  mxConstraintHandler.prototype.highlightColor = mxConstants.DEFAULT_VALID_COLOR
  mxConstraintHandler.prototype.highlightColor = "#29b6f6";
  graph.defaultEdgeStyle = {
    'edgeStyle': 'orthogonalEdgeStyle', 'rounded': '0', 'html': '1',
			'jettySize': 'auto', 'orthogonalLoop': '1'
  }
  graph.currentEdgeStyle = graph.defaultEdgeStyle;
  graph.createCurrentEdgeStyle = function()
  {
    var style = 'edgeStyle=' + (this.currentEdgeStyle['edgeStyle'] || 'none') + ';';
    
    if (this.currentEdgeStyle['shape'] != null)
    {
      style += 'shape=' + this.currentEdgeStyle['shape'] + ';';
    }
    
    if (this.currentEdgeStyle['curved'] != null)
    {
      style += 'curved=' + this.currentEdgeStyle['curved'] + ';';
    }
    
    if (this.currentEdgeStyle['rounded'] != null)
    {
      style += 'rounded=' + this.currentEdgeStyle['rounded'] + ';';
    }

    if (this.currentEdgeStyle['comic'] != null)
    {
      style += 'comic=' + this.currentEdgeStyle['comic'] + ';';
    }
    
    // Special logic for custom property of elbowEdgeStyle
    if (this.currentEdgeStyle['edgeStyle'] == 'elbowEdgeStyle' && this.currentEdgeStyle['elbow'] != null)
    {
      style += 'elbow=' + this.currentEdgeStyle['elbow'] + ';';
    }
    
    if (this.currentEdgeStyle['html'] != null)
    {
      style += 'html=' + this.currentEdgeStyle['html'] + ';';
    }
    else
    {
      style += 'html=1;';
    }
    
    return style;
  };
  // mxConstants.HIGHLIGHT_OPACITY = 30;
  mxConstraintHandler.prototype.createHighlightShape = function() {
    var hl = new mxEllipse(null, this.highlightColor, this.highlightColor, 0);
    hl.opacity = mxConstants.HIGHLIGHT_OPACITY;
    
    return hl;
  };
  // Uses current edge style for connect preview 
  mxConnectionHandler.prototype.createEdgeState = function(me) {
    var style = this.graph.createCurrentEdgeStyle();
    var edge = this.graph.createEdge(null, null, null, null, null, style);
    var state = new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));   
    for (var key in this.graph.currentEdgeStyle) {
      state.style[key] = this.graph.currentEdgeStyle[key];
    }
    return state;
  };

  // Overrides edge preview to use current edge shape and default style
  mxConnectionHandler.prototype.livePreview = true;
  mxConnectionHandler.prototype.cursor = 'crosshair';
  // Overrides dashed state with current edge style
  var connectionHandlerCreateShape = mxConnectionHandler.prototype.createShape;
  mxConnectionHandler.prototype.createShape = function() {
    var shape = connectionHandlerCreateShape.apply(this, arguments);
    shape.isDashed = this.graph.currentEdgeStyle[mxConstants.STYLE_DASHED] == '1';
    return shape;
  }

  // Overrides live preview to keep current style
  mxConnectionHandler.prototype.updatePreview = function(valid)
  {
    // do not change color of preview
  };

// tslint:enable
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
  initEdgeHandle();

  initHighlightShape(graph);
}
