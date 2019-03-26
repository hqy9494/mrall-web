export default {
  initialState: {
    title: "奖品协议",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PrizeAgreement",
      getProps: ["rts"]
    }
  ]
};
