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
import { IMxActions, initAction } from "../types/action";
import { customShortcutDictionary, ICustomCommand } from "../types/command";
import { ICanvasData, ICanvasEdge, ICanvasNode } from "../types/flow";
import {
  ImxCell,
  IMxEventObject,
  IMxGraph,
  IMxState,
  IMxUndoManager,
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
  private action: IMxActions;
  private readonly customShape: ICustomShape[];
  private readonly customCommand: ICustomCommand[];
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
    this.action = initAction(graph, this.context, this.undoManager);
    this.addUndoEvent(graph);
    this.addCopyEvent(graph);
    this.setKeyHandler(graph);
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
  // tslint:disable-next-line: max-func-body-length
  public addCopyEvent = (graph: IMxGraph) => { // , textInput: HTMLTextAreaElement, copy: ICopy) => {
    // tslint:disable-next-line: deprecation
    const { copy, textInput } = this.context;
    copy.gs = graph.gridSize;
    this.initTextInput(textInput);

    // For jest
    // tslint:disable-next-line: strict-type-predicates
    if (graph.container !== undefined) {
      mxEvent.addListener(graph.container, "mousemove", mxUtils.bind(this, (evt: MouseEvent) => {
        this.mouseX = evt.offsetX;
        this.mouseY = evt.offsetY;
      }));
    }

    // tslint:disable-next-line: cyclomatic-complexity
    mxEvent.addListener(document, "keydown", (evt: KeyboardEvent) => {
      const source = mxEvent.getSource(evt);
      if (graph.isEnabled() && !graph.isMouseDown && !graph.isEditing() && source.nodeName !== "INPUT") {
        // tslint:disable-next-line: deprecation
        if (evt.keyCode === 224 /* FF */ || (!mxClient.IS_MAC && evt.keyCode === 17 /* Control */) || (mxClient.IS_MAC && evt.keyCode === 91 /* Meta */)) {
          // tslint:disable-next-line: deprecation
          this.context.beforeUsingClipboard(graph, copy, textInput);
        }
      }
    });

    mxEvent.addListener(document, "keyup", (evt: KeyboardEvent) => {
      // tslint:disable-next-line: deprecation
      if (copy.restoreFocus && (evt.keyCode === 224 || evt.keyCode === 17 || evt.keyCode === 91)) {
        // tslint:disable-next-line: deprecation
        this.context.afterUsingClipboard(graph, copy, textInput);
      }
    });

    mxEvent.addListener(textInput, "copy", mxUtils.bind(this, (_evt: ClipboardEvent) => {
      // tslint:disable-next-line: deprecation
      this.context.copyFunc(graph, copy, textInput);
    }));

    mxEvent.addListener(textInput, "cut", mxUtils.bind(this, (_evt: ClipboardEvent) => {
      // tslint:disable-next-line: deprecation
      this.context.cutFunc(graph, copy, textInput);
    }));

    mxEvent.addListener(textInput, "paste", (evt: ClipboardEvent) => {
      // tslint:disable-next-line: deprecation
      this.context.pasteFunc(evt, graph, copy, textInput, this.mouseX, this.mouseY);
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
            action: this.action,
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

  private readonly setKeyHandler = (graph: IMxGraph): void => {
    const keyHandler = new mxKeyHandler(graph);
    keyHandler.bindControlKey(90, (evt) => {
      this.action.undo.func();
    });
    keyHandler.bindKey(8, (evt) => {
      this.action.deleteCell.func();
    });
    keyHandler.bindKey(9, (evt) => {
      if (graph.isEnabled()) {
        if (graph.isEditing()) {
          graph.stopEditing(false);
        }
        graph.selectCell(true);
      }
    });
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
        this.addAction(this.action, command.name, config.execute);
        if (config.shortcutCodes) {
          config.shortcutCodes.forEach((shortcutCode) => {
            // tslint:disable-next-line: no-unbound-method
            this.addCustomKeyEvent(graph, config.execute, shortcutCode);
          });
        }
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

  private readonly addAction = (action: IMxActions, name: string, func: () => void): void => {
    action[name] = new Object();
    action[name].func = func;
  }
}
