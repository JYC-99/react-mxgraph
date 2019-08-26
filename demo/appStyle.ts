
import * as Fabric from "office-ui-fabric-react";
const {
  DefaultPalette,
  mergeStyles,
  getTheme,
  mergeStyleSets,
} = Fabric;
import { IStackTokens } from "office-ui-fabric-react";
export const toolbarTokens: IStackTokens = {
  childrenGap: "sm8",
  padding: "s"
};

export const toolbarStyles = {
  root: {
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#a0aeb2",
    marginRight: "-1px",
    marginBottom: "-1px",
  }
};

const basicStyles = {
  root: {
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#a0aeb2",
    marginRight: "-1px",
    marginBottom: "-1px",
  }
};

export const panelAndMinimapStyles = {
  root: {
    width: "16.67%",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#a0aeb2",
    marginRight: "-1px",
    marginBottom: "-1px",
    height: "1000px",
  }
};

export const itemPanelStyles = {
  root: {
    width: "16.67%",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#a0aeb2",
    marginRight: "-1px",
    marginBottom: "-1px",
  }
};

export const flowContainerStyles = {
  root: {
    width: "66.67%",
    height: "800px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#a0aeb2",
    marginRight: "-1px",
    marginBottom: "-1px",
  }
}

export const verticalGapStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};

export const stackItemStyles: IStackItemStyles = {
  root: {
    // background: DefaultPalette.themePrimary,
    // color: DefaultPalette.white,
    // padding: 5
  }
};

export const detailPanelStyles = {
  root: {
    height: "600px",
    borderBottom: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "grey",
    backgroundColor: "grey",
  }
};

export const iconClass = mergeStyles({
  margin: '1 10px',
  
});

export const minimapStyles = {
  root: {
    height: "30%",
  }
};

// export const stackItemStyles = mergeStyles({
//   alignItems: 'center',
//   background: DefaultPalette.neutralPrimary,
//   color: DefaultPalette.white,
//   display: 'flex',
//   height: 30,
//   justifyContent: "center",
//   width: 60
// });

export const theme = getTheme();
export const headerAndFooterStyles: IRawStyle = {
  lineHeight: 40,
  paddingLeft: 16
};

export const windowContainerStyles: IRawStyle = {
  minHeigh: 800,
  minWeight: 800,
  Height: 1800,
}

export const classNames = mergeStyleSets({
  header: [headerAndFooterStyles, theme.fonts.medium],
  footer: [headerAndFooterStyles, theme.fonts.small],
  name: {
    display: 'inline-block',
    overflow: 'hidden',
    height: 40,
    cursor: 'default',
    padding: 8,
    boxSizing: 'border-box',
    verticalAlign: 'top',
    background: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    paddingLeft: 32
  },
  button: {
    border: 'none',
  },
  item: {
    backgroundColor: "gray",
    height: 22,
    width: 80,
  }
});
