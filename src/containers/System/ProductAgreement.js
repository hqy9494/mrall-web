export default {
  initialState: {
    title: "产品协议",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "ProductAgreement",
      getProps: ["rts"]
    }
  ]
};
