import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
// import { Col, Row, Icon, Button, Transfer, Modal, Popconfirm, message } from "antd";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable"
import moment from "moment"
export class CheckBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      button: '查询无编号代理商',
      flag: false,
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}


  render() {
    const id = this.props.params.id || null;
    const {button,flag} = this.state;
    const config = {
      hasParams:{"id":id},
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Positions",
        include:["agent","agent",{"relation": "paymentRelation", "scope": {"include": "payment"}}, {"relation": "agentPaymentRelation", "scope": {"include": "payment"}}],  //点位绑定优先代理商绑定
        where: id ? {agentId: id} : {agent: true}
      },
      // buttons:[
      //   {
      //     title: button,
      //     onClick: () => {
      //       if(flag){
      //         this.setState({
      //           flag: false,
      //           button: '查询无编号代理商',
      //           refreshTable: true
      //         })
      //       }else{
      //         this.setState({
      //           flag: true,
      //           button: '查询代理商编号',
      //           refreshTable: true
      //         })
      //       }
            
      //     }
      //   }
      // ],
      search: [
        {
          field: "name",
          title: "点位名称",
          type: "field",
        },
        // {
        //   type: "relevance",
        //   field: "agentName",
        //   title: "代理商名称",
        //   fieldName:'agentId',
        //   add:{
        //     agent: false
        //   },
        //   model: {
        //     fieldName:'id',
        //     api: "/Agents",
        //     field: "name",
        //   },
        // },
        // flag?
        // {
        //   type: "optionRelevance",
        //   title: "代理商是否有编号",
        //   field: "agentName",
        //   fieldName: "agentId",
        //   options: [
        //     { title: "无编号", value: '-' },
        //     // { title: "有编号", value: true }
        //   ],
        //   model: {
        //     api: "/Agents",
        //     field: "cusnumber"
        //   },
        //   add:{
        //     agent:false
        //   }
        // } : {
        //   type: "relevance",
        //   field: "agentName",
        //   title: "代理商编号",
        //   fieldName:'agentId',
        //   add:{
        //     agent: false
        //   },
        //   model: {
        //     fieldName:'id',
        //     api: "/Agents",
        //     field: "cusnumber",
        //   },
         
        // }
        
      ],

      columns: [
        {
          title: "点位名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name",
          align: "center",
          render: (text, record) => {
            if(record && record.agent) {
              return <div><strong>{ record.agent.name }</strong><p>{`(${record.agent.cusnumber || '-'})`}</p></div>
            }
            return <span>--</span>
          }
        },
        {
          title: "捆绑策略",
          dataIndex: "paymentRelation.payment.name",
          align: "center",
          key: "createAt", 
          render: (text, record) => {
            if(record && record.paymentRelation && record.paymentRelation.payment && record.paymentRelation.payment.name) {
              return <a onClick={()=>this.props.to(`/Account/CollectAccount/management/position/${record.paymentRelation.payment.id}`)}><u>{record.paymentRelation.payment.name}</u></a>
            }
            else if(record && record.agentPaymentRelation && record.agentPaymentRelation.payment && record.agentPaymentRelation.payment.name) {
              return <a onClick={()=>this.props.to(`/Account/CollectAccount/management/position/${record.agentPaymentRelation.payment.id}`)}><u>{record.agentPaymentRelation.payment.name}</u></a>
            }
            else {
              return <span style={{color: "red"}}>暂未捆绑策略</span>
            }
            
          }
        },
        {
          title: '捆绑时间',
          dataIndex: 'paymentRelation.updatedAt',
          key: 'paymentRelation.updatedAt',
          render: (text, record, index) => {
            if(record && record.paymentRelation && record.paymentRelation && record.paymentRelation.updatedAt){
              return  <span>{moment(record.paymentRelation.updatedAt).format("YYYY-MM-DD HH:mm:ss")} </span> 
            }
            else if(record && record.agentPaymentRelation && record.agentPaymentRelation && record.agentPaymentRelation.updatedAt){
              return  <span>{moment(record.agentPaymentRelation.updatedAt).format("YYYY-MM-DD HH:mm:ss")} </span> 
            }
            else {
              return <span>--</span>
            }
             
          }
      },
       
      ],
      path: this.props.match.url,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
      title:this.props.title
    }
    return (
      <section className="CollectAccount-page">
        <TableExpand
          {...config}
        />
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid")
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckBill);
