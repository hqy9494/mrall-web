import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Button, Divider, Modal, Popconfirm, message, Card, Table,Form,Input,Icon } from "antd";
import { Panel } from 'react-bootstrap';
import moment from "moment";
import uuid from "uuid";
// import TableExpand from "../../components/TempTable"
import "./CollectManagement.scss"
import AsyncTable from "../../components/AsyncTable"
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item;
import { getParameterByName } from '../../utils/utils';

export class CollectManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentData: {},
      p:{},
      s:{},
      type:"position"
    };
    this.uuid = uuid.v1();
  }
  //初始化
  componentWillMount() {
    const { match } = this.props;
    const { path } = match;
    if(path.indexOf("/management/position/")<0){
      this.setState({type:"agent"})
    }
    const getId = match.params.id;
    if(getId){
      this.getPayment(getId);
    }
  }
  //获取弹出信息文字
  getModalText = (value) =>{
    const { type } = this.state;
    const text = {
      "info":{
        "position":"请确保捆绑设备点位无误，提交后收款策略将会立刻生效。",
        "agent":"请确保捆绑代理商无误，提交后收款策略将会立刻生效。"
      },
      "danger":{
        "position":"您现在绑定的点位已经有绑定的支付账号，若继续绑定将会覆盖，请谨慎选择。",
        "agent":"您现在绑定的代理商已经有绑定的支付账号，若继续绑定将会覆盖，请谨慎选择。"
      },
      "delete":{
        "position":"您正在解绑以下列表设备，解绑后设备将采用默认的微信支付宝账号收款。请谨慎操作。",
        "agent":"您正在解绑以下列表代理商收款账号，解绑后代理商将采用默认的微信支付宝账号收款。请谨慎操作。"
      }
    }
    return text[value][type];
  }
  //获取弹出警告的table配置
  getModalConfig = (value) => {
    //数据配置
    const { type } = this.state;
    const columnsObj = {
      "info":{
        "position":[
          {
            title: "设备编号",
            dataIndex: "code",
            key: "code",
            render: (text, record) => {
              if(record && record.terminal) {
                return <span>{ record.terminal.code }</span>
              }
              return <span>--</span>
            }
          },
          {
            title: "点位名称",
            dataIndex: "name",
            key: "name",
            align:"right"
          },
          {
            title: "现绑定账号",
            dataIndex: "payment.name",
            key: "payment.name",
            align:'right',
            render: (text, record) => {
              if(record && record.paymentRelation) {
                const { paymentRelation } = record;
                return <span style={{color:"red"}}>{ paymentRelation.payment.name }</span>
              }
              return <span>无</span>
            }
          }
        ],
        "agent":[
          {
            title: "代理商名称",
            key: "name",
            dataIndex: "name"
          },
          {
            title: "代理商属性",
            dataIndex: "direct",
            key: "direct",
            align:"right",
            render: (text, record) => {
              return text ? <span>直营</span> : <span>一般</span>
            }
          },
          {
            title: "现绑定账号",
            dataIndex: "payment.name",
            key: "payment.name",
            align:'right',
            render: (text, record) => {
              if(record && record.paymentRelation) {
                const { paymentRelation } = record;
                return <span style={{color:"red"}}>{ paymentRelation.payment.name }</span>
              }
              return <span>无</span>
            }
          }
        ]
      },
      "delete":{
        "position":[
          {
            title: "设备编号",
            key: "code",
            render: (text, record) => {
              if(record && record.position && record.position.terminal) {
                const { terminal } = record.position;
                return <span>{ terminal.code }</span>
              }
              return <span>--</span>
            }
          },
          {
            title: "点位名称",
            dataIndex: "position.name",
            key: "position.name",
            align:"right"
          }
        ],
        "agent":[
          {
            title: "代理商名称",
            key: "agent.name",
            dataIndex: "agent.name"
          },
          {
            title: "代理商属性",
            dataIndex: "agent.direct",
            key: "agent.direct",
            align:"right",
            render: (text, record) => {
              if(record.agent){
                return record.agent.text ? <span>直营</span> : <span>一般</span>
              }else{
                return "---";
              }
            }
          },
        ],
      }
      
      
    }
    return {
      locale:{
        filterTitle: '筛选',
        filterConfirm: '确定',
        filterReset: '重置',
        emptyText: '暂无数据'
      },
      rowKey:"id",
      scroll:{ y: 250 },
      className:"publicTable",
      pagination:false,
      columns:columnsObj[value][type]
    }
  }
  //获取数据基本信息
  getPayment = id => {
    id && this.props.rts({
      url: `/Payments/${id}`,
      method: 'get',
      params: {
        filter: {
          where: {
            agent: true,
          },
        }
      }
    }, this.uuid, 'getPayment', (v) => {
      if(v) this.setState({ paymentData: v })
    })
  }
  //绑定设备请求接口
  postPaymentBind = (id,params,cb) => {
    const { type } = this.state;
    let data = {ids:params,type}
   this.props.rts({
      method: 'post',
      url: `/PaymentRelations/${id}/bind`,
      data
    }, this.uuid, 'postPaymentBind', () => {
        message.success('保存成功');
        this.setState({visible:false,refreshTable:true,refreshModelTable:true,selectedPageKeys:[],selectedPage:[],selectedRowKeys:[],selectedRows:[]});
        cb();
    })
  }
  //删除设备请求接口
  postPaymentRelieve = (id, params,cb) => {
    let data = {ids:params}
    this.props.rts({
      method: 'post',
      url: `/PaymentRelations/${id}/relieve`,
      data
    }, this.uuid, 'postPaymentRelieve', () => {
      message.success('解绑成功');
      this.setState({refreshTable:true,refreshModelTable:true,selectedPageKeys:[],selectedPage:[],selectedRowKeys:[],selectedRows:[]});
      cb();
    })
  }
  //页面上的选中回调
  onPageRowKeys = (selectedPageKeys, selected) =>{
    let obj = {};
    let { selectedPage=[] } = this.state;
    selectedPage = selectedPage.concat(selected);
    selectedPage = selectedPage.filter((item) =>{
      if(!obj[item.sourceId] && selectedPageKeys.indexOf(item.sourceId)>-1){
        obj[item.sourceId] = 1;
        return true;
      }else{
        return false;
      }
    });
    this.setState({
      selectedPageKeys,
      selectedPage,
    });
  }
  //弹窗选中回调
  onSelectedRowKeysChange = (selectedRowKeys, selected) => {
    let obj = {};
    let { selectedRows = [] } = this.state;
    selectedRows = selectedRows.concat(selected);
    selectedRows = selectedRows.filter((item) =>{
      if(!obj[item.id] && selectedRowKeys.indexOf(item.id)>-1){
        obj[item.id] = 1;
        return true;
      }else{
        return false;
      }
    });
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }
  //判断是否存在被绑定的点位 true 弹出危险窗口，false弹出普通窗口
  changeDevice = (data = [], keys = [] ,name) => {
    if(!data.length){
      return message.error("至少选中一条");
    } 
    const hasPaymentId = data && data.some((item,i)=>item.paymentRelation && Object.keys(item.paymentRelation).length>0);
    if(hasPaymentId){
      this.setState({dangerModal:true})
    }else{
      this.setState({infoModal:true})
    }
  }
  //渲染
  render() {
    const isOperator = localStorage.me ? JSON.parse(localStorage.me).agentId===null : false;
    //state数据
    const { paymentData, selectedRowKeys, selectedRows,selectedPageKeys,selectedPage,dangerModal,infoModal,deleteModal,type } = this.state;
    
    const { match } = this.props;
    const getId = match.params.id
    //获取地址栏上的搜索数据并解析
    const s = getParameterByName('s')? JSON.parse(getParameterByName('s')) : undefined;
    const q = getParameterByName('q')? JSON.parse(getParameterByName('q')) : undefined;
    const { getFieldDecorator } = this.props.form;
    /*按钮组*/
    const ButtonGrop = (
      <div>
        <Button onClick={() => {this.setState({ visible: true })}} size="small" className="buttonListFirst">增加</Button>
        <Divider type="vertical" style={{margin:"0 10px"}}/>
        <Button onClick={() =>{
          if(selectedPage && selectedPage.length>0) return this.setState({deleteModal:true});
          else message.error("至少选中一条！");
        }} size="small" className="buttonListDanger">解绑所选点位</Button>
      </div>
    )
    /*代理商配置*/
    const agentConfig = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Agents",
        areaPath:"/tools/getAreaData",
        include:[
          {
              "relation": "paymentRelation", 
              "scope": {
                  "include": "payment"
              }
          }
        ]
      },
      search: [
        isOperator && {
          type: "field",
          field: "name",
          title: "代理商名称",
        },
        {
          type: "option",
          title: "代理商属性",
          field: "direct",
          options: [
            { title: "直营", value: true },
            { title: "一般", value: false }
          ]
        },
      ],
      columns: [
        {
          title: "代理商名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "代理商属性",
          dataIndex: "direct",
          key: "direct",
          render: (text, record) => {
            return text ? <span>直营</span> : <span>一般</span>
          }
        },
        {
          title: "全部设备数",
          dataIndex: "positionCount",
          key: "positionCount",
          align:"right"
        },
        {
          title: "现绑定账号",
          dataIndex: "payment.name",
          key: "payment.name",
          align:'right',
          render: (text, record) => {
            if(record && record.paymentRelation) {
              const { paymentRelation } = record;
              return <span>{ paymentRelation.payment.name }</span>
            }
            return <span>无</span>
          }
        }
      ]
    }
    /*设备点位配置*/
    const equipmentConfig = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Positions",
        areaPath:"/tools/getAreaData",
        include:[
          {
              "relation": "paymentRelation", 
              "scope": {
                  "include": "payment"
              }
          },"agent","place","terminal"
        ],
        where: {
          agent: true,
          active:true
        }
      },
      search: [
        {
          type: "relevance",
          field: "terminalId",
          title: "设备编号",
          model: {
            api: "/Terminals",
            field: "code",
          }
        },
        {
          type: "field",
          field: "name",
          title: "点位名称",
        },
        {
          type: "relevance",
          field: "placeId",
          title: "场地名称",
          model: {
            api: "/Places",
            field: "name",
            
          }
        },
        isOperator && {
          type: "relevance",
          field: "agentName",
          title: "代理商名称",
          fieldName:'agentId',
          add:{
            agent: false
          },
          model: {
            fieldName:'id',
            api: "/Agents",
            field: "name",
          }
        },
        {
          type: "areaRelevance",
          field: "areaName",
          title: "场地地址",
          fieldName:'placeId',
          model: {
            fieldName:'id',
            api: "/Places",
            field: ["province","city","district"],
          }
        },
        {
          type: "optionRelevance",
          title: "代理商属性",
          field: "direct",
          fieldName: "agentId",
          add:{agent:false},
          options: [
            { title: "直营", value: true },
            { title: "一般", value: false }
          ],
          model: {
            api: "/Agents",
            field: "direct",
            typeProps:["data"],
          }
        },
      ],
      columns: [
        {
          title: "设备编号",
          dataIndex: "code",
          key: "code",
          render: (text, record) => {
            if(record && record.terminal) {
              return <span>{ record.terminal.code }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "场地地址",
          dataIndex: "place.province",
          key: "place.province",
          render: (text, record) => {
            if(record && record.place) {
              return <span>{ `${record.place.province ? record.place.province: '' }${record.place.city ? record.place.city: ''}${record.place.district ? record.place.district:'' }`}</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "场地名称",
          dataIndex: "place.name",
          key: "place.name",
          align:'right',
          render: (text, record) => {
            if(record && record.place) {
              return <span>{ record.place.name }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "点位名称",
          dataIndex: "name",
          key: "name",
          align:'right',
        },
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name",
          render: (text, record) => {
            if(record && record.agent) {
              return <span>{ record.agent.name }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "代理商属性",
          dataIndex: "agent.direct",
          key: "agent.direct",
          align:'right',
          render: (text, record) => {
            if(record && record.agent) {
              return record.agent.direct ? <span>直营</span> : <span>一般</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "现绑定账号",
          dataIndex: "payment.name",
          key: "payment.name",
          align:'right',
          render: (text, record) => {
            if(record && record.paymentRelation) {
              const { paymentRelation } = record;
              return <span>{ paymentRelation.payment.name }</span>
            }
            return <span>无</span>
          }
        }
      ]
    }
    
    //弹窗的table配置
    const config = Object.assign(type==="position"?equipmentConfig:agentConfig,{
      hasParams:Object.assign(q?{"q":encodeURIComponent(JSON.stringify(q))}:{}),
      rowSelection:{
        selectedRowKeys,
        hideDefaultSelections: true,
        onChange: this.onSelectedRowKeysChange,
        selections: true,
      },
      path: this.props.match.url,
      replace: this.props.replace,
      refresh: this.state.refreshModelTable,
      onRefreshEnd: () => {
        this.setState({ refreshModelTable: false });
      },
      removeHeader:true,
      pathParam:"s"
    })
    const pageRowSelection = {
      hideDefaultSelections: true,
      onChange: this.onPageRowKeys,
      selections: true,
    }
    //页面上的table配置
    const pageAgent = {
      search: [
        isOperator && {
          type: "relevance",
          field: "agentName",
          fieldName: "sourceId",
          title: "代理商名称",
          model: {
            api: "/Agents",
            field: "name",
            removeWhere:true
          }
        },
        {
          type: "optionRelevance",
          field: "agentDirect",
          fieldName: "sourceId",
          title: "代理商属性",
          options: [
            { title: "直营", value: true },
            { title: "一般", value: false }
          ],
          model: {
            api: "/Agents",
            field: "direct",
            removeWhere:true
          }
        }
      ],
      columns:[
          {
            title: "代理商名称",
            dataIndex: "agent.name",
            key: "agent.name"
          },
          {
            title: "代理商属性",
            dataIndex: "agent.direct",
            key: "agent.direct",
            render: (text, record) => {
              if(record && record.agent) {
                const { agent } = record;
                return agent.direct ? <span>直营</span> : <span>一般</span>
              }
              return <span>--</span>
            }
          },
          {
            title: "全部设备数",
            dataIndex: "agent.positionCount",
            key: "agent.positionCount",
            align:"right"
          },
          {
            title: '操作',
            dataIndex: 'handle',
            render: (text, record) => {
              return (
                  <Popconfirm
                    title="确定解绑？"
                    onConfirm={() => this.postPaymentRelieve(getId,[record.sourceId])}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button className="buttonListDanger" size="small">解绑</Button>
                  </Popconfirm>
                )
            }
          }
        ]
    }
    const pagePosition = {
      search: [
        {
          type: "unrelevance",
          field: "terminalCode",
          fieldName: "sourceId",
          title: "设备编号",
          model: {
            api: "/Positions",
            field: "terminalId",
            removeWhere:true,
            add:{"agent":true},
            child:{
              api: "/Terminals",
              field: "code",
              removeWhere:true,
              add:{"agent":true},
            }
          }
        },
        {
          type: "relevance",
          field: "sourceId",
          title: "点位名称",
          model: {
            api: "/Positions",
            removeWhere:true,
            add:{"agent":true},
            field: "name",
          }
        },
        /*{
          type: "field",
          field: "name",
          title: "点位名称",
        },*/
        {
          type: "unrelevance",
          field: "placeName",
          fieldName: "sourceId",
          title: "场地名称",
          model: {
            api: "/Positions",
            field: "placeId",
            removeWhere:true,
            add:{"agent":true},
            child:{
              api: "/Places",
              field: "name",
              removeWhere:true,
              add:{"agent":true},
            }
          }
        },
        isOperator && {
          type: "unrelevance",
          field: "agentName",
          fieldName: "sourceId",
          title: "代理商名称",
          model: {
            api: "/Positions",
            field: "agentId",
            removeWhere:true,
            child:{
              api: "/Agents",
              field: "name",
              removeWhere:true,
            }
          }
        },
        /*{
          type: "unrelevance",
          field: "agentName",
          title: "代理商名称",
          fieldName:'agentId',
          add:{
            agent: false
          },
          model: {
            fieldName:'id',
            api: "/Agents",
            field: "name",
          }
        },*/
        /*{
          type: "areaRelevance",
          field: "areaName",
          title: "场地地址",
          fieldName:'placeId',
          model: {
            fieldName:'id',
            api: "/Places",
            field: ["province","city","district"],
          }
        },*/
        /*{
          type: "optionRelevance",
          title: "代理商属性",
          field: "direct",
          fieldName: "agentId",
          add:{agent:false},
          options: [
            { title: "直营", value: true },
            { title: "一般", value: false }
          ],
          model: {
            api: "/Agents",
            field: "direct",
            typeProps:["data"],
          }
        },*/
      ],
      columns:[
        {
            title: "设备编号",
            dataIndex: "code",
            key: "code",
            render: (text, record) => {
              if(record && record.position && record.position.terminal) {
                const { terminal } = record.position;
                return <span>{ terminal.code }</span>
              }
              return <span>--</span>
            }
          },
          {
            title: "场地地址",
            dataIndex: "place.province",
            key: "place.province",
            render: (text, record) => {
              if(record && record.position && record.position.place) {
                const { place } = record.position;
                return <span>{ `${place.province}${place.city}${place.district}`}</span>
              }
              return <span>--</span>
            }
          },
          {
            title: "场地名称",
            dataIndex: "place.name",
            key: "place.name",
            align:'right',
            render: (text, record) => {
              if(record && record.position && record.position.place) {
                const { place } = record.position;
                return <span>{ place.name }</span>
              }
              return <span>--</span>
            }
          },
          {
            title: "点位名称",
            dataIndex: "position.name",
            key: "position.name",
            align:'right',
          },
          {
            title: "代理商名称",
            dataIndex: "agent.name",
            key: "agent.name",
            render: (text, record) => {
              if(record && record.position && record.position.agent) {
                const { agent } = record.position;
                return <span>{ agent.name }</span>
              }
              return <span>--</span>
            }
          },
          {
            title: "代理商属性",
            dataIndex: "agent.direct",
            key: "agent.direct",
            align:'right',
            render: (text, record) => {
              if(record && record.position && record.position.agent) {
                const { agent } = record.position;
                return agent.direct ? <span>直营</span> : <span>一般</span>
              }
              return <span>--</span>
            }
          },
          {
            title: '操作',
            dataIndex: 'handle',
            render: (text, record) => {
              return (
                  <Popconfirm
                    title="确定解绑？"
                    onConfirm={() => this.postPaymentRelieve(getId,[record.sourceId])}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button className="buttonListDanger" size="small">解绑</Button>
                  </Popconfirm>
                )
            }
          }
        ]
    }
    /*公共页面配置*/
    const pageConfig = Object.assign({
      rowSelection:pageRowSelection,
      hasParams:Object.assign(s?{"s":encodeURIComponent(JSON.stringify(s))}:{}),
      tableKey:"sourceId",
      path: this.props.match.url,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      removeHeader:true,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/PaymentRelations",
        areaPath:"/tools/getAreaData",
        where:{
          type,
          paymentId:getId
        },
        success:(res)=>{
         /* this.setState({
            selectedPage: [],
            selectedPageKeys: []
          })*/
        }
      }
    },type==="position"?pagePosition:pageAgent);
    const child = (
      <Panel>
        <div className="project-title">收款账号信息</div>
          <Row gutter={24} style={{ padding: '10px'}}>
          	<Col span={24}>
          		<FormItem label={`收款账号名称`}>
	              {getFieldDecorator(`name`, {
	                initialValue: paymentData && paymentData.name || ''
	              })(
	                <Input disabled={true} style={{width:400}}/>
	              )}
	            </FormItem>
            </Col>
            <Col span={24}>
          		<FormItem label={`收款账号`}>
	              {getFieldDecorator(`user`, {
	                initialValue: paymentData && paymentData.caiBaoConfig && paymentData.caiBaoConfig.account || ''
	              })(
	                <Input disabled={true} style={{width:400,marginLeft:'27px'}}/>
	              )}
	            </FormItem>
            </Col>
          </Row>
        <div className="project-title">策略内容</div>
        <Card title={type==="position"?"绑定设备":"绑定代理商"} extra={ButtonGrop}>
          <AsyncTable
            {...pageConfig}
          />
        </Card>
        <Modal
          width="80%"
          height="80%"
          visible={this.state.visible}
          title={type==="position"?"选择设备":"选择代理商"}
          okText="确定"
          cancelText="取消"
          onOk={() => {
            this.changeDevice(selectedRows, selectedRowKeys, 'paymentId')
          }}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        >
          <AsyncTable
            {...config}          
            getArea
          />
        </Modal>
        <Modal
          width="40%"
          visible={this.state.dangerModal}
          title={
          <div>
            <Icon type="exclamation-circle" style={{color:"red"}}/>
            <span style={{color:"red",position:"relative",top:"3px",marginLeft:"10px"}}>警惕！</span>
          </div>
          }
          okText="仍要绑定"
          cancelText="取消"
          onOk={() => this.postPaymentBind(getId,selectedRowKeys,()=>this.setState({dangerModal: false}))}
          onCancel={() => this.setState({dangerModal: false})}
        >
          <div>
            <h5 style={{color:"red",textAlign:"center"}}>{this.getModalText("danger")}</h5>
            <Table dataSource={selectedRows} {...this.getModalConfig("info")} style={{marginTop:"30px"}}/>
          </div>
        </Modal>
        <Modal
          width="40%"
          visible={this.state.infoModal}
          title={
            <div>
              <Icon type="info-circle" className="statusBlueOne"/>
              <span className="statusBlueOne" style={{position:"relative",top:"3px",marginLeft:"10px"}}>请确定！</span>
            </div>
            }
          okText="绑定"
          cancelText="取消"
          onOk={() => this.postPaymentBind(getId,selectedRowKeys,()=>this.setState({infoModal: false}))}
          onCancel={() => this.setState({infoModal: false})}
        >
        <div>
            <h5 style={{textAlign:"center"}} className="statusBlueOne">{this.getModalText("info")}</h5>
            <Table dataSource={selectedRows} {...this.getModalConfig("info")} style={{marginTop:"30px"}}/>
          </div>
        </Modal>
        <Modal
          width="40%"
          visible={this.state.deleteModal}
          title={
          <div>
            <Icon type="exclamation-circle" style={{color:"red"}}/>
            <span style={{color:"red",position:"relative",top:"3px",marginLeft:"10px"}}>确定删除！</span>
          </div>
          }
          okText="删除"
          cancelText="取消"
          onOk={() => this.postPaymentRelieve(getId,selectedPageKeys,()=>this.setState({deleteModal: false}))}
          onCancel={() => this.setState({deleteModal: false})}
        >
          <div>
            <h5 style={{color:"red",textAlign:"center"}}>{this.getModalText("delete")}</h5>
            <Table dataSource={selectedPage} {...this.getModalConfig("delete")} style={{marginTop:"30px"}}/>
          </div>
        </Modal>
      </Panel>
    )
    return (
      <section className="CollectManagement-page">
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {paymentData && paymentData.name || this.props.title}
	      	child={child}
	      	removeAllButton
	      />
        
	  </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getPayment: state => state.get("rts").get("getPayment"),
  getPositions: state => state.get("rts").get("getPositions"),
});
const CollectManagementForm = Form.create()(CollectManagement)
export default connect(mapStateToProps, mapDispatchToProps)(CollectManagementForm);
