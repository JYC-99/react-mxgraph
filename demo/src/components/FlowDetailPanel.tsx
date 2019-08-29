import * as React from "react";
import {
  DetailPanel,
  EdgePanel,
  NodePanel,
  PortPanel,
  TextEditor,
} from "../../../src/index";

import {
  FlowDetailForm
} from "./FlowDetailForm";

export const FlowDetailPanel = () => {
  return (
    <DetailPanel >
      <NodePanel >
        <FlowDetailForm />
      </NodePanel>
      <EdgePanel >
        <FlowDetailForm />
      </EdgePanel>
      <PortPanel>
        <FlowDetailForm />
      </PortPanel>
    </DetailPanel>
  );
};
