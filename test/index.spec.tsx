import "jest";
import * as React from "react";
import { shallow } from "enzyme";

import { Example, SfcExample } from "../src/index";

describe("Example", () => {
  it("renders correctly", () => {
    const wrapper = shallow(
      <Example />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe("SfcExample", () => {
  it("renders correctly", () => {
    const wrapper = shallow(
      <SfcExample />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});