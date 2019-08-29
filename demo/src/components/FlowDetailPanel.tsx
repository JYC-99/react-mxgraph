import * as React from "react";
import {
  DetailPanel,
  EdgePanel,
  NodePanel,
  PortPanel,
<<<<<<< HEAD
=======
  TextEditor,
>>>>>>> d58ba78728f17d45b6be1d0f5a481c8c5fdbe82f
} from "../../../src/index";

import {
  FlowDetailForm
} from "./FlowDetailForm";

export const FlowDetailPanel = () => {
  return (
    <DetailPanel >
      <NodePanel >
<<<<<<< HEAD
        <FlowDetailForm name="node"/>
      </NodePanel>
      <EdgePanel >
        <FlowDetailForm name="edge"/>
      </EdgePanel>
      <PortPanel>
        <FlowDetailForm name="port"/>
=======
        <FlowDetailForm />
      </NodePanel>
      <EdgePanel >
        <FlowDetailForm />
      </EdgePanel>
      <PortPanel>
        <FlowDetailForm />
>>>>>>> d58ba78728f17d45b6be1d0f5a481c8c5fdbe82f
      </PortPanel>
    </DetailPanel>
  );
};
