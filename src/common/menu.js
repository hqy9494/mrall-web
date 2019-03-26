const menu = [
  {
    id: "System",
    icon: "profile",
    name: "系统",
    component: "System",
    children: [
      {
        id: "PaymentConfiguration",
        name: "支付配置",
        component: "PaymentConfiguration"
      },
      {
        id: "UserList",
        name: "用户列表",
        component: "UserList"
      },
      {
        id: "OperatorList",
        name: "运营商列表",
        component: "OperatorList"
      },
      {
        id: "RoleList",
        name: "角色权限",
        component: "RoleList"
      },
      {
        id: "OperationRecord",
        name: "操作记录",
        component: "OperationRecord"
      },
      {
        id: "Logs",
        name: "日志管理",
        component: "Logs"
      },
    ]
  },
  {
    id: "setting",
    icon: "profile",
    name: "设置",
    component: "Setting",
    children: [
      {
        id: "setting/roleManager",
        name: "角色管理",
        component: "RoleManager"
      },
      {
        id: "setting/menuManager",
        name: "菜单管理",
        component: "MenuManager"
      },
      {
        id: "setting/apiManager",
        name: "接口管理",
        component: "ApiManager"
      },
    ]
  },
];

export default menu;
