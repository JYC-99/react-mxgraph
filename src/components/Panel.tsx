import * as React from "react";
import {
  IPanelContext,
  PanelContext,
} from "../context/PanelContext";

class Panel extends React.PureComponent<{ name: string }> {
  public key?: string;

  public render(): React.ReactNode {
    // console.log("render");
    // const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {}))
    return (
      <PanelContext.Consumer>{(value: IPanelContext) => {
        const {
          name, cells,
        } = value;
        this.key = cells && cells.length ? cells[0].id : undefined;
        if (name && cells && name === this.props.name) {
          // console.log("render panel", this.props.children);
          if (React.isValidElement(this.props.children)) {
            return (
              <div>
                {React.cloneElement(this.props.children, {key: this.key, })}
              </div>
            );
          }
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
