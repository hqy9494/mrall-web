export default {
  home: {
    module: "",
    path: "/",
    redirect: "/Equipment/EquipmentManagement",
    subs: {
      //主页
      dashboard: {
        path: "dashboard",
        module: "Indexs",
        component: "Index",
        title: "主页"
      },
      //设置
      Setting:{
      	path: "Setting",
        module: "Setting",
        title: "设置",
        subs:{
		      StaffManager: {
		        path: "/StaffManager",
		        module: "Setting",
		        component: "StaffManager",
		        title: "员工管理",
		        subs: {
		          StaffManagerAdd: {
		            path: "/add",
		            module: "Setting",
		            component: "StaffManagerAdd",
		            title: "新建员工"
		          },
		          StaffManagerDetail: {
		            path: "/detail/:id",
		            module: "Setting",
		            component: "StaffManagerDetail",
		            title: "员工详情"
		          }
		        }
		      },
		      RoleManager: {
		        path: "/RoleManager",
		        module: "Setting",
		        component: "RoleManager",
		        title: "角色管理",
		        subs: {
		          RoleManagerAdd: {
		            path: "/add",
		            module: "Setting",
		            component: "RoleManagerAdd",
		            title: "新建角色"
		          },
		          RoleManagerDetail: {
		            path: "/detail/:id",
		            module: "Setting",
		            component: "RoleManagerDetail",
		            title: "角色详情"
		          }
		        }
		      },
		      MenuManager: {
		        path: "/MenuManager",
		        module: "Setting",
		        component: "MenuManager",
		        title: "菜单管理",
		        subs: {
		          MenuManagerAdd: {
		            path: "/add",
		            module: "Setting",
		            component: "MenuManagerAdd",
		            title: "新建菜单"
		          },
		          MenuManagerDetail: {
		            path: "/detail/:id",
		            module: "Setting",
		            component: "MenuManagerDetail",
		            title: "菜单详情"
		          }
		        }
		      },
		      ApiManager: {
		        path: "/ApiManager",
		        module: "Setting",
		        component: "ApiManager",
		        title: "接口管理",
		        subs: {
		          ApiManagerDetail: {
		            path: "/detail/:id",
		            module: "Setting",
		            component: "ApiManagerDetail",
		            title: "接口详情"
		          }
		        }
		      }
		    }
      },
      System: {
        path: "System",
        module: "System",
        // component: "System",
        title: "系统",
        subs: {
          PaymentConfiguration: {
            path: "/PaymentConfiguration",
            module: "System",
            component: "PaymentConfiguration",
            title: "支付配置"
          },
          UserList: {
            path: "/UserList",
            module: "System",
            component: "UserList",
            title: "用户管理",
            subs:{
              UserListAdd: {
                path: "/add",
                module: "System",
                component: "UserListAdd",
                title: "新建用户"
              },
              UserListDetail: {
                path: "/detail/:id",
                module: "System",
                component: "UserListDetail",
                title: "用户详情"
              },
            }
          },
          RoleList: {
            path: "/RoleList",
            module: "System",
            component: "RoleList",
            title: "角色权限",
            subs:{
              RoleListDetail: {
                path: "/detail/:id",
                module: "System",
                component: "RoleListDetail",
                title: "角色权限编辑"
              },
            }
          },
          OperatorList: {
            path: "/OperatorList",
            module: "System",
            component: "OperatorList",
            title: "运营商列表",
            subs:{
              OperatorListAdd: {
                path: "/add",
                module: "System",
                component: "OperatorListAdd",
                title: "新建运营商"
              },
              OperatorListDetail: {
                path: "/detail/:id",
                module: "System",
                component: "OperatorListDetail",
                title: "运营商详情"
              },
            }
          },
          OperationRecord: {
            path: "/OperationRecord",
            module: "System",
            component: "OperationRecord",
            title: "操作记录"
          },
          Logs: {
            path: "/Logs",
            module: "System",
            component: "Logs",
            title: "操作日志"
          },
          PrizeAgreement: {
            path: "/PrizeAgreement",
            module: "System",
            component: "PrizeAgreement",
            title: "奖品协议"
          },
          ProductAgreement: {
            path: "/ProductAgreement",
            module: "System",
            component: "ProductAgreement",
            title: "产品协议"
          },
        }
      },
      Account: {
        path: "Account",
        module: "Account",
        // component: "Account",
        title: "收款策略",
        subs: {
          CheckBill:{
            path: "/CheckBill",
            module: "Account",
            component: "CheckBill",
            title: "收款账号列表",
          },
          CollectOrder: {
            path: "/CollectAccount",
            module: "Account",
            component: "CollectAccount",
            title: "收款策略列表",
            subs: {
              CollectAccountDetail: {
                path: "/:id",
                module: "Account",
                component: "CollectAccountDetail",
                title: "新建收款策略",
              },
              CollectManagement: {
                path: "/management/position/:id",
                module: "Account",
                component: "CollectManagement",
                title: "绑定设备",
              },
              CollectAgent: {
                path: "/management/agent/:id",
                module: "Account",
                component: "CollectManagement",
                title: "绑定代理商",
              },
            }
          }
        }
      },
    }
  }
};
