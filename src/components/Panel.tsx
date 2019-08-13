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
            <SpecialPanelContext.Provider value={{enabled: true, cells, }}>
              <div className="node-panel-container" >
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

function createPanel(PanelComponent, name: string): React.PureComponent {
  // tslint:disable-next-line: max-classes-per-file
  return class extends React.PureComponent {
    public render(): React.ReactNode {
      return <PanelComponent name={name} {...this.props} />;
    }
  };
}

export const NodePanel = createPanel(Panel, "vertex");
export const EdgePanel = createPanel(Panel, "edge");
export const CanvasPanel = createPanel(Panel, "canvas");
