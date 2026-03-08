/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    "intro",
    {
      type: "category",
      label: "Sync",
      items: ["sync/intro", "sync/api"],
    },
    {
      type: "category",
      label: "Tween",
      items: ["tween/intro", "tween/api"],
    },
  ],
};

module.exports = sidebars;

