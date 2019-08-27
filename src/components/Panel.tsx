import * as React from "react";
import {
  IPanelContext,
  PanelContext,
  SpecialPanelContext,
} from "../context/PanelContext";

class Panel extends React.PureComponent<{name: string}> {
  public render(): React.ReactNode {
    return (
      <PanelContext.Consumer>{(value: IPanelContext) => {
        const {
          name, cells,
        } = value;

        if (name && cells && name === this.props.name) {
          return (
            <div>
              {this.props.children}
            </div>
          );
        }
        return null;
      }}</PanelContext.Consumer>

    );
  }
}

import {
  withNameProps
} from "./WithNameProps";
export const NodePanel = withNameProps(Panel, "vertex");
export const EdgePanel = withNameProps(Panel, "edge");
export const CanvasPanel = withNameProps(Panel, "canvas");
export const PortPanel = withNameProps(Panel, "port");
