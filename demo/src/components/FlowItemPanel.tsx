import * as React from "react";

import {
  Item,
} from "../../../src/index";

import * as Fabric from "office-ui-fabric-react";

const {
  GroupedList,
  DefaultButton,
  FontIcon,
  Label,
} = Fabric;

import { createGroups, } from 'office-ui-fabric-react/lib/utilities/exampleData';

import {
  iconClass,
  classNames,
} from "../../appStyle";


export class FlowItemPanel extends React.PureComponent {
  private _items: object[] = [
    {
      shape: "rounded",
      size: "70*30",
      model: { color: "#FA8C16", label: "Item 1", },
    }, {
      shape: "rounded2",
      size: "100*40",
      model: { color: "#FA8C16", label: "Item 2", },
    }, {
      shape: "ellipse",
      size: "50*50",
      model: { color: "#FA8C16", label: "Item 3", },
    },
  ];
  private _groups = createGroups(1, 1, 0, 3);

  public render(): JSX.Element {
    return (
      <GroupedList
        items={this._items}
        onRenderCell={this.onRenderCell}
        groupProps={{
          onRenderHeader: this.onRenderHeader,
          onRenderFooter: this.onRenderFooter
        }}
        groups={this._groups}
      />
    );
  }

  private onRenderCell(nestingDepth: number, item: IItemProps, itemIndex: number): JSX.Element {
    return (
      <div data-selection-index={itemIndex}>
        <span className={classNames.name}>
          <div className={classNames.item}>
          <Item shape={item.shape} size={item.size} model={item.model}>
            {item.shape}
          </Item>
          </div>
        </span>
      </div>
    );
  }

  // tslint:disable-next-line: max-func-body-length
  private onRenderHeader(props: IGroupHeaderProps): JSX.Element {
    const toggleCollapse = (): void => {
      props.onToggleCollapse!(props.group!);
    };

    return (
      <div className={classNames.header}>
        <DefaultButton onClick={toggleCollapse} className={classNames.button}>
          <Label>Item Panel</Label>
          {
            props.group.isCollapsed ?
            <FontIcon iconName={"ChevronDown"} className={iconClass} /> :
            <FontIcon iconName={"ChevronUp"} className={iconClass} />
          }
        </DefaultButton>
      </div>
    );
  }

  private onRenderFooter(props: IGroupFooterProps): JSX.Element {
    // return <div className={classNames.footer}>{props.group!.name}</div>;
    return null;
  }
}