import * as React from "react";

export function createMenu(MenuComponent, name): React.PureComponent {
  return class extends React.PureComponent {
    public render(): React.ReactNode {
      return <MenuComponent name={name} {...this.props} />;
    }
  };
}
