import * as React from "react";
import {
  DetailPanel,
  EdgePanel,
  NodePanel,
  PortPanel,
  TextEditor,
} from "../../../src/index";

export const FlowDetailPanel = () => {
  return (
    <DetailPanel >
      <NodePanel >
        <TextEditor />
      </NodePanel>
      <EdgePanel >
        <TextEditor />
      </EdgePanel>
      <PortPanel>
        <TextEditor />
      </PortPanel>
    </DetailPanel>
  );
};
