export default {
  global: {
    sideBorders: 8,
    tabSetHeaderHeight: 26,
    tabSetTabStripHeight: 26,
    enableEdgeDock: false,
    borderBarSize: 0,
    tabEnableDrag: false
  },
  layout: {
    type: "row",
    id: "root",
    weight: 100,
    children: [{
      type: "tabset",
      id: "leftPanel",
      weight: 60,
      enableDeleteWhenEmpty: false,
      tabSetEnableMaximize: true,
    },
    {
      type: "tabset",
      id: "rightPanel",
      weight: 40,
      enableDeleteWhenEmpty: false,
      tabSetEnableMaximize: true,
    }]
  }
};
