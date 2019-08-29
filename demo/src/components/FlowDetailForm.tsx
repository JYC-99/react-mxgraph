import * as React from "react";
import { withPropsApi } from "../../../src/index";
import { ICanvasData } from "../../../src/types/flow";
import { IPropsAPI, IEdgeModel } from "../../../src/types/propsAPI";

interface IProps {
  propsAPI: IPropsAPI;
  name: string;
}

import * as Fabric from "office-ui-fabric-react";

import { IMxCell } from "../../../src/types/mxGraph";

const {
  TextField,
  Stack,
  StackItem,
  Label,
  Text,
} = Fabric;

export class DetailForm extends React.PureComponent<IProps, { value: string }> {
  private _isEditing: boolean;
  get cell(): IMxCell {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      value: "...",
    };
    this._isEditing = false;
  }
  public render(): React.ReactNode {
    console.log("render");
    const { name } = this.props;
    return (
      <Stack >
        {name === "node" && this.renderNodeDetail()}
        {name === "edge" && this.renderEdgeDetail()}
        {name === "port" && this.renderPortDetail()}
        {name === "canvas" && this.renderCanvasDetail()}
      </Stack >
    );
  }

  public renderNodeDetail = () => {
    const { propsAPI } = this.props;
    const model = propsAPI.getCellModel(this.cell);
    console.log(model);
    return [
      (
        <StackItem key="1">
          <TextField label="label" type="text" placeholder="placeholder" value={this._getInputValue()} onFocus={this.startEditing} onChange={this._onChange} onBlur={this.stopEditing} />
        </StackItem>
      ),
      (
        <StackItem key="2">
          <Label>id</Label>
          <Text>{model.id}</Text>
        </StackItem>
      )
    ];
  }

  public renderEdgeDetail = () => {
    const { propsAPI } = this.props;
    const model = propsAPI.getCellModel(this.cell);
    console.log(model);
    return [
      (
        <StackItem key="1">
          <TextField label="label" type="text" placeholder="placeholder" value={this._getInputValue()} onFocus={this.startEditing} onChange={this._onChange} onBlur={this.stopEditing} />
        </StackItem>
      ),
      (
        <StackItem key="2">
          <Label>id</Label>
          <Text>{model.id}</Text>
          <Label>source id</Label>
          <Text> {(model as IEdgeModel).source}</Text>
          <Label>target id</Label>
          <Text> {(model as IEdgeModel).target}</Text>
          <Label>source port id</Label>
          <Text> {(model as IEdgeModel).sourcePort}</Text>
          <Label>target port id</Label>
          <Text> {(model as IEdgeModel).targetPort}</Text>
        </StackItem>
      )
    ];
  }

  public renderPortDetail = () => {
    const { propsAPI } = this.props;
    const model = propsAPI.getCellModel(this.cell);
    console.log(model);
    console.log(propsAPI.graph.getTerminalForPort(this.cell, false));
    console.log(propsAPI.graph.getTerminalForPort(this.cell, true));
    return [
      (
        <StackItem key="1">
          <TextField label="label" type="text" placeholder="placeholder" value={this._getInputValue()} onFocus={this.startEditing} onChange={this._onChange} onBlur={this.stopEditing} />
        </StackItem>
      ),
      (
        <StackItem key="2">
          <Label>id</Label>
          <Text>{model.id}</Text>
        </StackItem>
      )
    ];
  }

  public renderCanvasDetail = () => {
    const { propsAPI } = this.props;
    console.log(propsAPI);
    return (
      <StackItem>
        {"canvas"}
      </StackItem>
    );
  }

  private readonly _onChange = (event) => {
    this.setState({ value: event.target.value });
  }

  private readonly _getInputValue = (): string => {
    const value = this._isEditing ? this.state.value : this._getCellValue();
    return value === null ? "" : value;
  }

  private readonly stopEditing = () => {
    const { update, } = this.props.propsAPI;
    const cell = this.cell;
    if (!cell) {
      throw new Error("no cell to get value");
    }
    update(cell, { label: this.state.value });
    this._isEditing = false;
  }
  private readonly _getCellValue = () => {
    const { getCellModel, } = this.props.propsAPI;
    const cell = this.cell;
    // const model = graph.getModel();
    if (!cell) {
      throw new Error("no cell to get value");
    }
    const model = getCellModel(cell);

    return model.label;
  }

  private readonly startEditing = () => {
    const cell = this.cell;
    if (!cell) {
      throw new Error("no cells to get value");
    }

    const value = this._getCellValue();
    this.setState({ value, });

    this._isEditing = true;
  }
}

export const FlowDetailForm = withPropsApi(DetailForm);
