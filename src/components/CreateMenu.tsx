import * as React from "react";

// tslint:disable-next-line: export-name
export function createMenu(MenuComponent, name): React.PureComponent {
  return class extends React.PureComponent {
    public render(): React.ReactNode {
      return <MenuComponent name={name} {...this.props} />;
    }
  };
}
