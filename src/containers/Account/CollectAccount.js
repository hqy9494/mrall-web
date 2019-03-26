export default {
  initialState: {
    title: "收款策略列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "CollectAccount",
      getProps: ["rts"]
    }
  ]
};