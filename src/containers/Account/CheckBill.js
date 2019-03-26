export default {
    initialState: {
      title: "收款账号列表",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "CheckBill",
        getProps: ["rts"]
      }
    ]
  };