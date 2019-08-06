import * as React from "react";

export class Toolbar extends React.PureComponent {

  public render(): React.ReactNode {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

}
