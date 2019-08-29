import * as React from "react";
import {
  DetailPanel,
  EdgePanel,
  NodePanel,
  PortPanel,
} from "../../../src/index";

import {
  FlowDetailForm
} from "./FlowDetailForm";

export const FlowDetailPanel = () => {
  return (
    <DetailPanel >
      <NodePanel >
        <FlowDetailForm name="node"/>
      </NodePanel>
      <EdgePanel >
        <FlowDetailForm name="edge"/>
      </EdgePanel>
      <PortPanel>
        <FlowDetailForm name="port"/>
      </PortPanel>
    </DetailPanel>
  );
};
