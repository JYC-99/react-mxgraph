import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

import {
  ClipboardContext, IClipboardContext,
} from "../context/ClipboardContext";
import {
  MxGraphContext
} from "../context/MxGraphContext";
import { init } from "../settings/init";
import { IMxActions, initActions } from "../types/action";
import { customShortcutDictionary, ICustomCommand } from "../types/command";
import { ICanvasData, ICanvasEdge, ICanvasNode } from "../types/flow";
import {
  ImxCell,
  IMxEventObject,
  IMxGraph,
  IMxState,
  IMxUndoManager,
  IKeyHandler,
} from "../types/mxGraph";
import { ICustomShape, } from "../types/shapes";

const {
  mxClient,
  mxUtils,
  mxEvent,
  mxGraphModel,
  mxGeometry,
  mxPoint,
  mxUndoManager,
  mxKeyHandler,
  mxConstants,
  mxRubberband,
} = mxGraphJs;

window.mxGeometry = mxGeometry;
window.mxGraphModel = mxGraphModel;
window.mxPoint = mxPoint;

interface IState {
  graph?: IMxGraph;
}

export class MxGraph extends React.PureComponent<{}, IState> {
  public static contextType = ClipboardContext;
  private undoManager: IMxUndoManager;
  private mouseX: number;
  private mouseY: number;
  private actions: IMxActions;
  private readonly customShape: ICustomShape[];
  private readonly customCommand: ICustomCommand[];
  private keyHandler: IKeyHandler;
  private _firstUpdate: boolean;

  constructor(props: {}) {
    super(props);
    this.state = {
      graph: undefined,
    };
    this.mouseX = 0;
    this.mouseY = 0;
    this.customShape = [];
    this.customCommand = [];
    this._firstUpdate = true;
  }

  public setGraph = (graph: IMxGraph) => {
    if (this.state.graph) {
      return;
    }
    init(graph);
    const rubberband = new mxRubberband(graph);
    this.undoManager = new mxUndoManager();
    // tslint:disable-next-line: deprecation
    this.actions = initActions(graph, this.context, this.undoManager);
    this.keyHandler = this.setKeyHandler(graph);

    this.addUndoEvent(graph);
    this.addCopyEvent(graph);
    this.setMouseEvent(graph);
    this.registerNode(graph);

    this.setState({
      graph,
    });
  }

  public addUndoEvent = (graph: IMxGraph) => {
    const listener = (_sender: IMxGraph, evt: IMxEventObject) => {
      this.undoManager.undoableEditHappened(evt.getProperty("edit"));
    };
    graph.getModel()
      .addListener(mxEvent.UNDO, listener);
    graph.getView()
      .addListener(mxEvent.UNDO, listener);
  }

  public addCopyEvent = (graph: IMxGraph) => {
    // tslint:disable-next-line: deprecation
    const { copy, textInput } = this.context;
    copy.gs = graph.gridSize;
    this.initTextInput(textInput);

    // For jest
    // tslint:disable-next-line: strict-type-predicates
    if (graph.container) {
      mxEvent.addListener(graph.container, "mousemove", mxUtils.bind(this, (evt: MouseEvent) => {
        this.mouseX = evt.offsetX;
        this.mouseY = evt.offsetY;
      }));
      mxEvent.addListener(graph.container, "mouseenter", mxUtils.bind(this, (evt: MouseEvent) => {
        graph.setEnabled(true);
      }));
      mxEvent.addListener(graph.container, "mouseleave", mxUtils.bind(this, (evt: MouseEvent) => {
        graph.setEnabled(false);
      }));
    }

    this.keyHandler.bindControlKey(67, () => {
      this.actions.copy.func();
    });

    this.keyHandler.bindControlKey(88, () => {
      this.actions.cut.func();
    });

    this.keyHandler.bindControlKey(86, () => {
      this.actions.pasteHere.func({ x: this.mouseX, y: this.mouseY });
    });

  }


  public componentWillMount(): void {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
    }
  }

  public componentDidUpdate(): void {
    if (this._firstUpdate && this.state.graph) { this.registerCommand(this.state.graph); this._firstUpdate = false; }
  }

  public render(): React.ReactNode {
    return (
      <div className="graph">
        <MxGraphContext.Provider
          value={{
            graph: this.state.graph,
            setGraph: this.setGraph,
            actions: this.actions,
            customShape: this.customShape,
            customCommand: this.customCommand,
            readData: this.readData,
            insertVertex: this.insertVertex,
            insertEdge: this.insertEdge,
          }}
        >
          {this.props.children}
        </MxGraphContext.Provider>
      </div>
    );
  }

  private readonly initTextInput = (textInput: HTMLTextAreaElement) => {
    mxUtils.setOpacity(textInput, 0);
    textInput.style.width = "1px";
    textInput.style.height = "1px";
    textInput.value = " ";
  }

  private readonly setKeyHandler = (graph: IMxGraph): IKeyHandler => {
    const keyHandler = new mxKeyHandler(graph);
    keyHandler.bindControlKey(90, (evt: KeyboardEvent) => {
      this.actions.undo.func();
    });
    keyHandler.bindKey(8, (evt: KeyboardEvent) => {
      this.actions.deleteCell.func();
    });
    keyHandler.bindKey(9, (evt: KeyboardEvent) => {
      if (graph.isEnabled()) {
        if (graph.isEditing()) {
          graph.stopEditing(false);
        }
        graph.selectCell(true);
      }
    });
    keyHandler.bindShiftKey(9, () => { if (graph.isEnabled()) { graph.selectPreviousCell(); } }); // Shift+Tab
    keyHandler.bindControlKey(9, () => { if (graph.isEnabled()) { graph.selectParentCell(); } }); // Ctrl+Tab
    keyHandler.bindControlShiftKey(9, () => { if (graph.isEnabled()) { graph.selectChildCell(); } }); // Ctrl+Shift+Tab
    return keyHandler;
  }

  private readonly addCustomKeyEvent = (graph: IMxGraph, func: () => void, key: string): void => {
    mxEvent.addListener(document, "keydown", (event: KeyboardEvent) => {
      if (graph.isEnabled() && !graph.isMouseDown && !graph.isEditing() && event.key === key) {
        func();
      }
    });
  }

  private readonly registerNode = (graph: IMxGraph): void => {
    this.customShape.forEach((shape) => {
      const style = graph.getStylesheet()
        .createDefaultVertexStyle(); // default
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      // style[mxConstants.STYLE_SHAPE] = shape.name;
      style[mxConstants.STYLE_PERIMETER] = "rectanglePerimeter";
      style[mxConstants.STYLE_ROUNDED] = true;
      Object.assign(style, shape.styleConfig);
      graph.getStylesheet()
        .putCellStyle(shape.name, style);
    });
  }

  private readonly registerCommand = (graph: IMxGraph): void => {
    this.customCommand.forEach((command) => {
      const config = command.config;
      if (customShortcutDictionary.hasOwnProperty(command.name) && customShortcutDictionary[command.name] && config.enable) {
        // tslint:disable-next-line: no-unbound-method
        this.addAction(graph, this.actions, command.name, config.execute, config.shortcutCodes);
        console.log(command);
      }
    });
  }

  private readonly insertVertex = (parent: ImxCell, graph: IMxGraph, node: ICanvasNode): ImxCell => {

    const model = graph.getModel();

    model.beginUpdate();
    try {
      const width = node.size ? node.size[0] : 200;
      const height = node.size ? node.size[1] : 200;
      let style = node.shape ? `${node.shape};shape=${node.shape};` : "";
      if (node.color) { style += `fillColor=${node.color}`; }
      const portSize = [8, 8];

      const vertex = graph.insertVertex(parent, node.id, node.label, node.x, node.y, width, height, style);
      vertex.setConnectable(false);
      // if preset collapse size -- vertex.geometry.alternateBounds = new mxReactangle(xx,xx,xx,xx);
      const points = graph.getCellStyle(vertex).points;
      // for insert port
      if (points) {
        points.forEach((point, index) => {
          let portStyle = "";
          if (point[0] === 1) { portStyle += "portConstraint=east;direction=east"; }
          else if (point[0] === 0) { portStyle += "portConstraint=west;direction=west"; }
          else if (point[1] === 0) { portStyle += "portConstraint=north;direction=north"; }
          else if (point[1] === 1) { portStyle += "portConstraint=south;direction=south"; }

          portStyle += ";shape=ellipse;perimeter=none;";
          portStyle += "opacity=50";
          const port = graph.insertVertex(vertex, null, `p${index}`, point[0], point[1], portSize[0], portSize[1], portStyle, true);
          port.geometry.offset = new mxPoint(-(portSize[0] / 2), -(portSize[1] / 2)); // set offset
          port.setConnectable(true);
        });
      }
      return vertex;
    } finally {
      model.endUpdate();
    }

  }

  private readonly insertEdge = (parent: ImxCell, graph: IMxGraph, edge: ICanvasEdge, source: ImxCell, target: ImxCell): ImxCell => {
    return graph.insertEdge(parent, edge.id, "", source, target);
  }

  private readonly readData = (graph: IMxGraph, data: ICanvasData): void => {
    graph
      .getModel()
      .beginUpdate();

    try {
      const parent = graph.getDefaultParent();

      const vertexes = data.nodes.map((node) => {
        return {
          vertex: this.insertVertex(parent, graph, node),
          id: node.id
        };
      });

      data.edges.forEach((edge) => {
        const source = vertexes.find((v) => v.id === edge.source);
        const target = vertexes.find((v) => v.id === edge.target);

        if (source && target) {
          graph.insertEdge(parent, edge.id, "", source.vertex, target.vertex);
        }
      });
    } finally {
      graph
        .getModel()
        .endUpdate();
    }
  }

  // tslint:disable-next-line: max-func-body-length
  private readonly setMouseEvent = (graph: IMxGraph): void => {
    function updatePortStyle(state: IMxState, isHover: boolean): void {
      state.style.opacity = (isHover) ? 100 : 50;
      state.style.strokeColor = (isHover) ? "#1976d2" : "grey";
    }

    function updateNodeStyle(state: IMxState, isHover: boolean): void {
      state.style.strokeColor = (isHover) ? "#1976d2" : "grey";
      state.style.strokeWidth = (isHover) ? 1 : 0;
    }

    function updateStyle(state: IMxState, isHover: boolean): void {

      if (graph.isPort(state.cell)) {
        updatePortStyle(state, isHover);
      } else {
        updateNodeStyle(state, isHover);
      }

    }
    function draw(state: IMxState): void {
      if (state.shape) {
        state.shape.apply(state);
        state.shape.redraw();

        if (state.text) {
          state.text.apply(state);
          state.text.redraw();
        }
      }
    }

    function drag(_evt, state: IMxState | null, isEnter: boolean): void {
      if (state) {

        updateStyle(state, isEnter);
        draw(state);

        if (state.cell && state.cell.children) {
          state.cell.children.forEach((port) => {
            if (graph.isPort(port)) {
              drag(_evt, graph.view.getState(port), isEnter);
            }
          });
        }
      }
    }

    graph.addMouseListener({
      currentState: null,
      mouseDown(_sender, me): void {
        if (this.currentState) {
          if (graph.isPort(me.getCell())) { return; }
          drag(me.getEvent(), this.currentState, false);
          this.currentState = null;
        }
      },
      mouseMove(_sender, me): void {
        if (this.currentState && me.getState() === this.currentState) {
          return;
        }
        const model = graph.getModel();
        let nextState = graph.view.getState(me.getCell());

        if (nextState && ((!model.isVertex(nextState.cell) && !model.isEdge(nextState.cell)) || graph.isPort(nextState.cell))) {
          nextState = null;
        }
        if (nextState !== this.currentState) {
          if (this.currentState) { // leave restore view
            drag(me.getEvent(), this.currentState, false);
          } else { // enter update view
            drag(me.getEvent(), nextState, true);
          }
          this.currentState = nextState;
        }
      },
      // tslint:disable-next-line: no-empty
      mouseUp(_sender, _me): void { },

    });

  }

  private readonly addAction = (graph: IMxGraph, actions: IMxActions, name: string, func: () => void, shortcuts?: string[]): void => {
    actions[name] = new Object();
    actions[name].func = func;
    if (!shortcuts) { return; }
    actions[name].shortcuts = shortcuts;
    shortcuts.forEach((shortcut) => {
      mxEvent.addListener(document, "keydown", (event: KeyboardEvent) => {
        if (graph.isEnabled() && !graph.isMouseDown && !graph.isEditing() && event.key === shortcut) {
          func();
        }
      });
    });
  }
}
