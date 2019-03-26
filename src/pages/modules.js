import Index from "./Indexs/Index";

// System
import PaymentConfiguration from "./System/PaymentConfiguration";
import UserList from "./System/UserList";
import UserListDetail from "./System/UserListDetail";
import RoleList from "./System/RoleList";
import RoleListDetail from "./System/RoleListDetail";
import OperatorList from "./System/OperatorList";
import OperatorListDetail from "./System/OperatorListDetail";
import OperationRecord from "./System/OperationRecord";
import Logs from "./System/Logs";
import PrizeAgreement from "./System/PrizeAgreement";
import ProductAgreement from "./System/ProductAgreement";

//设置
import StaffManager from "./Setting/StaffManager";
import StaffManagerAdd from "./Setting/StaffManagerAdd";
import StaffManagerDetail from "./Setting/StaffManagerDetail";
import RoleManager from "./Setting/RoleManager";
import RoleManagerAdd from "./Setting/RoleManagerAdd";
import RoleManagerDetail from "./Setting/RoleManagerDetail";
import MenuManager from "./Setting/MenuManager";
import MenuManagerAdd from "./Setting/MenuManagerAdd";
import MenuManagerDetail from "./Setting/MenuManagerDetail";
import ApiManager from "./Setting/ApiManager";
import ApiManagerDetail from "./Setting/ApiManagerDetail";

// Account
import CollectAccount from "./Account/CollectAccount";
import CollectAccountDetail from "./Account/CollectAccountDetail";
import CollectManagement from "./Account/CollectManagement";
import CheckBill from "./Account/CheckBill";

const modules = {
  Index,
  // System
  PaymentConfiguration,
  UserList,
  UserListDetail,
  RoleList,
  RoleListDetail,
  OperatorList,
  OperatorListDetail,
  OperationRecord,
  Logs,
  ProductAgreement,
  PrizeAgreement,
  // 设置
  StaffManager,
  StaffManagerAdd,
  StaffManagerDetail,
  RoleManager,
  RoleManagerAdd,
  RoleManagerDetail,
  MenuManager,
  MenuManagerAdd,
  MenuManagerDetail,
  ApiManager,
  ApiManagerDetail,
  // Account
  CollectAccount,
  CollectAccountDetail,
  CollectManagement,
  CheckBill,
};

export default modules;
