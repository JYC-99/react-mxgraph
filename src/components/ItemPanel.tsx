import * as React from "react";

export class ItemPanel extends React.PureComponent {
  public render(): React.ReactNode {

    return (
      <div className="testPanel">
          {this.props.children}
      </div>
    );
  }

}
