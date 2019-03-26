export default {
  initialState: {
    title: "收款策略",
    subtitle: "",
    breadcrumb: [{
      name: '收款策略列表',
      url: '/#/Account/CollectAccount'
    }]
  },
  component: [
    {
      module: "CollectManagement",
      getProps: ["rts"]
    }
  ]
};