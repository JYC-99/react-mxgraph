import initStoryshots, { snapshotWithOptions } from "@storybook/addon-storyshots";

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock: (element) => {
      document.createElement(element.type);
    },
  }),
});
