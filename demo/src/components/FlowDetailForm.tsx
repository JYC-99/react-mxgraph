import * as React from "react";
import { withPropsApi } from "../../../src/index";
import { ICanvasData } from "../../../src/types/flow";
import { IPropsAPI } from "../../../src/types/propsAPI";

interface IProps {
  propsAPI: IPropsAPI;
}

import * as Fabric from "office-ui-fabric-react";
import { StackItem } from "office-ui-fabric-react";
import { ImxCell } from "../../../src/types/mxGraph";

const {
  TextField,
  Stack,
} = Fabric;

export class DetailForm extends React.PureComponent<IProps, { value: string }> {
  private _isEditing: boolean;
  get cell(): ImxCell {
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
    return (
      <Stack >
        <StackItem>
          <TextField label="label" type="text" placeholder="placeholder" value={this._getInputValue()} onFocus={this.startEditing} onChange={this._onChange} onBlur={this.stopEditing} />
        </StackItem>
      </Stack >
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
    update(cell, {label: this.state.value});
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
