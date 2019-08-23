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
          if (name === "edge") {
            // console.log(cells[0]);
          }
          if (name === "port") {
            // console.log(cells[0].style);
          }
          return (
            <SpecialPanelContext.Provider value={{enabled: true, cells, }}>
              <div>
                {`${name} panel:`}
                {this.props.children}
              </div>
            </SpecialPanelContext.Provider>
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
