<template>
  <div id="bagUser_manage">
    <div class="left-table">
      <div class="wrap-top">
        <div class="area">
          <span>区域:</span>
          <el-select v-model="areaItem" @change="getAreaId_">
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="user">
          <span>用户名:</span>
          <el-input placeholder="请输入内容" v-model="user" clearable></el-input>
        </div>
        <el-button type="primary" class="search" @click="search">搜索</el-button>
      </div>
      <div class="table-content">
        <div class="table-head">
          <div class="ownArea">所属区域</div>
          <!-- <div class="wrap-lists"> -->
          <div class="users">
            <span>用户</span>
          </div>
          <div class="type">
            <span>用水类型</span>
          </div>
          <div class="contacts">
            <span>联系人</span>
          </div>
          <div class="contactWay">
            <span>手机号</span>
          </div>
          <div class="tel">
            <span>固定电话</span>
          </div>
          <div class="action">
            <span>操作</span>
          </div>
          <!-- </div> -->
        </div>
        <template v-if="table.length>0">
          <div class="area-item" v-for="(v,i) in table" :key="i">
            <div class="ownArea">
              <span>{{v.COMPANYNAMES}}</span>
            </div>
            <div class="users" :title="v.NAME">
              <span>{{v.NAME}}</span>
            </div>
            <div class="type" :title="v.type">
              <span>{{v.USE_TYPE|formateType}}</span>
            </div>
            <div class="contacts" :title="v.CONTACTS">
              <span>{{v.CONTACTS}}</span>
            </div>
            <div class="contactWay" :title="v.contactWay">
              <span>{{v.PHONE}}</span>
            </div>
            <div class="tel" :title="v.tel">
              <span>{{v.TELEPHONE}}</span>
            </div>
            <div class="action">
              <span class="btn" :class="{ifEdit:ifEdit===false}" @click="openModel(i,v)">编辑</span>
              <span class="btn" :class="{ifDel:ifDel===false}" @click="del(i,v.ID)">删除</span>
            </div>
          </div>
        </template>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout=" total, prev, pager, next"
          :total="totalPage"
          @prev-click="gottoPrev"
          @next-click="gotoNext"
          @current-change="gotoThisPage"
        ></el-pagination>
      </div>
    </div>
    <div class="right-tree">
      <div class="title">{{title}}</div>
      <div class="tree-content">
        <!-- <v-jstree :data="tree" show-checkbox multiple allow-batch whole-row @item-click="itemClick"></v-jstree> -->
        <el-tree
          :data="tree"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick"
          default-expand-all
        ></el-tree>
      </div>
    </div>
    <edit-model
      @hiddenSelf="hiddenModel"
      :showEditModel="edit_model"
      @saveUper="saveInputs_"
      :title="'大用户用水管理'"
    >
      <div class="inputs">
        <div class="row">
          <div class="col">
            <label for="name">用户名：</label>
            <input type="text" id="name" v-model="saveInputs.NAME" placeholder="请输入用户名">
          </div>
          <div class="col">
            <label for="name">简称：</label>
            <input type="text" id="name" v-model="saveInputs.SHORT_NAME" placeholder="请输入简称">
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="type">用水类型：</label>
            <el-select v-model="saveInputs.USE_TYPE" placeholder="请选择">
              <el-option
                v-for="item in waterSupply_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="col">
            <label for="old">联系人：</label>
            <input type="text" v-model="saveInputs.CONTACTS" id="old" placeholder="请输入联系人">
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="number">服务人口数(万人)：</label>
            <input type="text" v-model="saveInputs.SERVICE_NUM" id="number" placeholder="请输入服务人口数">
          </div>
          <div class="col">
            <label for="stablePhone">联系方式：</label>
            <input type="text" v-model="saveInputs.PHONE" id="stablePhone" placeholder="请输入联系方式">
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="old">计划用水(万/m³)：</label>
            <input type="text" v-model="saveInputs.WATER_PLAN" id="old" placeholder="请输入计划用水">
          </div>
          <div class="col">
            <label for="stablePhone">固定电话：</label>
            <input type="text" v-model="saveInputs.TELEPHONE" id="stablePhone" placeholder="请输入手机号">
          </div>
        </div>
        <div class="row">
          <div class="col hasPosition">
            <label>所属管道：</label>
            <span>{{saveInputs.PIPE_NAME}}</span>
            <!--<input placeholder="请输入内容" v-model="saveInputs.PIPE_NAME" @keyup.enter="fetchPipeList">
            <div class="subList" v-if="searchPipeList.length">
              <div
                class="pipeItem"
                v-for="(item,index) in searchPipeList"
                :key="index"
                @click="getPipeItem(item)"
              >{{item.PIPE_NAME}}</div>
            </div>-->
          </div>
          <div class="col">
            <label for="waterNum">所属区域:</label>
            <el-select v-model="saveInputs.AREA_ID" placeholder="请选择" @change="getAreaId">
              <el-option
                v-for="item in areaList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </edit-model>
    <save-model
      :showModel="show_Model"
      :delNum="delId"
      :type="type"
      :flag="flag"
      @delThis="colsedSelf"
      :content="content"
      @sureDelThis="sureDel"
    ></save-model>
  </div>
</template>

<script>
import saveModel from "@/common/components/poupe/save_status";
import editModel from "@/common/components/poupe/edit";
import {
  getPipeWaterUserInfo,
  getPipeBaseInfo,
  saveOrUpdate,
  updateWaterUser
} from "@/api/pipeNet_msg/bagUser_manage";

import { getOrganDictTree } from "@/api/common/get_area";
export default {
  components: {
    saveModel,
    editModel
  },
  data() {
    return {
      type: false,
      flag: false,
      ifEdit: true,
      ifDel: true,
      content: "XXX",
      delId: null, //要删除的ID
      del_index: null, //要删除的索引
      areaIndex: null, // 要删除的区域ID
      show_Model: false,
      edit_model: false,
      areaList: [], // 选中的区域
      areaItem: "", // 选中的区域
      title: "", //树的题目
      user: "",
      table: [],
      tree: [],
      defaultProps: {
        children: "children",
        label: "label",
        id: "id"
      },
      selected: null,
      totalPage: 1,
      saveInputs: {
        AREA_ID: "",
        COMPANYNAMES: "",
        COMPANY_ID: "",
        CONTACTS: "",
        CREATE_TIME: "",
        CREATE_USER: null,
        ID: "",
        INSERT_TIME: null,
        LGTD: null,
        LTTD: null,
        NAME: "",
        PHONE: "",
        PIPE_CODE: "",
        PIPE_NAME: "",
        POINT_ID: null,
        SERVICE_NUM: null,
        SHORT_NAME: "",
        STATUS: "",
        TELEPHONE: "",
        UPDATE_TIME: null,
        UPDATE_USER: null,
        USE_TYPE: "",
        WATER_PLAN: null
      },
      waterSupply_type: [], //用水类型
      waterSupply_typeItem: "", //选择的用水类型
      ownLoad: {
        //所属管线
        label: "",
        value: ""
      },
      searchPipeList: [], // 待选中的查询管道列表
      search_pipe_type: null, //用户属性 类型  水司或水厂 1.水司 2.水厂
      componyID: null, //水司或水厂id
      searchPipeName: "" //管道的名字
    };
  },
  methods: {
    cancelSelect(arr, selectIndex) {
      let temp_arr = arr;
      let len = temp_arr.length;
      if (temp_arr.length > 0) {
        for (let i = 0; i < len; i++) {
          if (i != selectIndex) {
            temp_arr[i].selected = false;
            if (temp_arr[i].children && temp_arr[i].children.length) {
              for (let j = 0; j < temp_arr[i].children.length; j++) {
                temp_arr[i].children[j].selected = false;
              }
            }
          }
        }
      }
      return temp_arr;
    },
    pearentFlag(arr) {
      let temp_arr = arr;
      let flag = false;
      if (temp_arr.length) {
        for (let i = 0; i < temp_arr.length; i++) {
          if (temp_arr[i].selected == true) {
            flag = true;
            break;
          }
        }
      }
      return flag;
    },
    itemClick(node, item, e) {
      let that = this;
      let temp_index = parseInt(item.id) - 1;
      let subItem_index = "";
      let temp_str = item.id;
      if (temp_str.length == 1) {
        that.tree[temp_index].opened = that.tree[temp_index].selected
          ? true
          : false;
        that.tree = that.cancelSelect(that.tree, temp_index);
      } else {
        temp_index = parseInt(temp_str.substring(0, 1)) - 1;
        subItem_index = parseInt(temp_str.substring(1)) - 1;
        let flag = that.pearentFlag(that.tree[temp_index].children);
        if (flag) {
          that.tree[temp_index].selected = true;
        } else {
          that.tree[temp_index].selected = false;
        }
        that.tree = that.cancelSelect(that.tree, temp_index);
      }
      let temp_search = "";
      let temp_selectList = that.tree[temp_index].children.filter(item => {
        return item.selected == true;
      });
      if (temp_selectList.length) {
        for (let i = 0; i < temp_selectList.length; i++) {
          temp_search += temp_selectList[i].text + ",";
        }
        if (temp_selectList.length == that.tree[temp_index].children.length) {
          temp_search = that.tree[temp_index].text;
        }
      }
    },
    sureDel(obj) {
      let that = this;
      let temp_id = obj.num;
      this.configDel(temp_id);
    },
    openModel(index, item) {
      let flag = this.ifEdit;
      if (!flag) {
        return;
      }
      this.num = index;
      // this.show_Model = true;
      this.edit_model = true;
      this.saveInputs = item;
    },
    hiddenModel(flag) {
      this.edit_model = flag;
    },
    validate(){
        	let reg = /^[1-9]\d*$/;//正整数
					let regnum = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
					let regtelephone = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
					let regphone =  /^1\d{10}$/;
					if (this.saveInputs.NAME == "") {
						this.$message.error("用户名称不能为空!")
		                return false
					}else if (this.saveInputs.SHORT_NAME == "") {
						this.$message.error("用户简称不能为空!")
		                return false
					}else if (this.saveInputs.USE_TYPE == "") {
						this.$message.error("用水类型不能为空!")
		                return false
					}else if (this.saveInputs.CONTACTS == "") {
						this.$message.error("联系人不能为空!")
		                return false
					}else if (this.saveInputs.PIPE_CODE == "") {
						this.$message.error("请在输入关键字后回车选取管道!")
		                return false
					}else if (!regtelephone.test(this.saveInputs.TELEPHONE)) {
						this.$message.error("固定电话格式不对!")
		                return false
					}else if (!regphone.test(this.saveInputs.PHONE)) {
						this.$message.error("手机号为1开头的十一位数!")
		                return false
					}else if (!regnum.test(this.saveInputs.WATER_PLAN)) {
						this.$message.error("计划用水为正数且最多保留两位小数!")
		                return false
					}else if (!regnum.test(this.saveInputs.SERVICE_NUM)) {
						this.$message.error("服务人口为正数且最多保留两位小数!")
		                return false
					}else{
						return true
					}
    },
    saveInputs_(flag) {
    	
    	let isFull = this.validate();
    	if(isFull){ 
    		let temp_json = this.saveInputs;
//    if (
//      this.saveInputs.NAME == "" ||
//      this.saveInputs.SHORT_NAME == "" ||
//      this.saveInputs.USE_TYPE == "" ||
//      this.saveInputs.CONTACTS == "" ||
//      this.saveInputs.SERVICE_NUM == "" ||
//      this.saveInputs.PHONE == "" ||
//      this.saveInputs.WATER_PLAN == "" ||
//      this.saveInputs.TELEPHONE == "" ||
//      this.saveInputs.PIPE_CODE == "" ||
//      this.saveInputs.AREA_ID == ""
//    ) {
//      this.$message.error("填写不完整或缺项!!!!");
//      return;
//    }
		
      this.saveEdit(temp_json);
    }
    },
    getAreaUserList(id_, name, areaId, page) {
      let that = this;
      let temp_id = that.componyID;
      let temp_type = that.search_pipe_type;

      if (areaId == "全部城区" || areaId == undefined) {
        areaId = "";
      }
      getPipeWaterUserInfo({
        id: "" + id_,
        name: "" + name,
        areaId: "" + areaId,
        pageSize: "10",
        page: "" + page,
        type: "" + temp_type,
        factoryId: "" + temp_id
      })
        .then(res => {
          if (res.msg == "no user") {
            window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
            return;
          }
          if (res.msg == "操作失败") {
            that.$message.error("服务错误!");
            return;
          }
          let data = res.data;
          if (data) {
            let { rows } = data;
            that.table = rows;
            let { total } = data;
            if (total) {
              that.totalPage = parseInt(total) || 1;
            }
          } else {
            that.table = [];
          }
        })
        .catch(function(error) {
        console.log(error)
        });
    },
    search() {
      let that = this;
      let temp_areaItem = this.areaItem;
      let temp_user = this.user;
      let temp_compId = this.selected.id;
      this.getAreaUserList("", temp_user, temp_areaItem, "1");
    },
    openEditModel() {
      this.edit_model = true;
    },
    gottoPrev(val) {
      let temp_areaItem = this.areaItem;
      let temp_user = this.user;
      let temp_compId = this.selected.id;
      if (val) {
        this.getAreaUserList("", temp_user, temp_user, val + "");
      }
    },
    gotoNext(val) {
      let temp_areaItem = this.areaItem;
      let temp_user = this.user;
      let temp_compId = this.selected.id;
      if (val) {
        this.getAreaUserList("", temp_user, temp_user, val + "");
      }
    },
    gotoThisPage(val) {
      let temp_areaItem = this.areaItem;
      let temp_user = this.user;
      let temp_compId = this.selected.id;
      if (val) {
        this.getAreaUserList("", temp_user, temp_user, val + "");
      }
    },
    configDel(id) {
      let that = this;
      updateWaterUser({
        id: "" + id,
        status: "" + 3
      })
        .then(res => {
          if (res.msg == "no user") {
            window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
            return;
          }
          if (res.msg == "操作失败") {
            that.$message.error("服务错误!");
            return;
          }
          let temp_status = res.status;
          if (temp_status) {
            that.show_Model = false;
            // let temp_areaIndex = that.areaIndex;
            // that.table[temp_areaIndex].userList.splice(that.del_index, 1);
            that.search()
          }
          that.areaIndex = null;
          that.del_index = null;
        })
        .catch(function(error) {
          console.log(error)
        });
    },
    del(i,  id) {
      let that = this;
      let flag = this.ifDel;
      if (!flag) {
        return;
      }
      that.show_Model = true;
      this.areaIndex = i;
      this.delId = id;
      this.del_index = i;
    },
    handleNodeClick(data) {
      this.selected = data;
      // console.log(data);
      this.componyID = data.id;
      this.title = data.label;
      this.getOrganDictTree_(data.id);
      this.getAreaUserList("", "", "", "1");
    },
    saveEdit(obj) {
      let temp_json = obj;
      let that = this;
      updateWaterUser({
        id: "" + temp_json.ID,
        name: "" + (temp_json.NAME ? temp_json.NAME : ""),
        shortName: "" + (temp_json.SHORT_NAME ? temp_json.SHORT_NAME : ""),
        pointId: "" + (temp_json.POINT_ID ? temp_json.POINT_ID : ""),
        contacts: "" + (temp_json.CONTACTS ? temp_json.CONTACTS : ""),
        phone: "" + (temp_json.PHONE ? temp_json.PHONE : ""),
        areaId: "" + (temp_json.AREA_ID ? temp_json.AREA_ID : ""),
        waterPlan: "" + (temp_json.WATER_PLAN ? temp_json.WATER_PLAN : ""),
        insertTime: "" + (temp_json.INSERT_TIME ? temp_json.INSERT_TIME : ""),
        pipeCode: "" + (temp_json.PIPE_CODE ? temp_json.PIPE_CODE : ""),
        serviceNum: "" + (temp_json.SERVICE_NUM ? temp_json.SERVICE_NUM : ""),
        status: "" + (temp_json.status ? temp_json.status : ""),
        telephone: "" + (temp_json.TELEPHONE ? temp_json.TELEPHONE : ""),
        useType: "" + (temp_json.USE_TYPE ? temp_json.USE_TYPE : ""),
        lgtd: "",
        lttd: ""
      }).then(res => {
        if (res.msg == "no user") {
          window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
            dse.baseURL
          }?id=${id}`;
          return;
        }
        if (res.msg == "操作失败") {
          that.$message.error("服务错误!");
          return;
        }
        if (res.status == 1) {
          that.edit_model = false;
          that.$message.success("保存成功!");
          // that.getAreaUserList("", "", "", "1");
        }
      });
    },
    getPipeList(name) {
      let that = this;
      let compyID = this.componyID;
      getPipeBaseInfo({
        pipeName: "" + name,
        code: "",
        type: "1",
        factoryId: "" + compyID
      })
        .then(res => {
          if (res.msg == "no user") {
            window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }`;
            return;
          }
          if (res.msg == "操作失败") {
            that.$message.error("服务错误!");
            return;
          }
          if (res.status == 1 && res.data) {
            let arr = res.data;
            let len = arr.length;
            if (len > 10) {
              arr = arr.splice(0, 10);
            }
            that.searchPipeList = arr || [];
          }
        })
        .catch(function(error) {
          // if (error == "Error: Network Error") {
          //     that.$message.error("网络错误")
          //     return;
          // }
          // that.$message.error("逻辑错误!")
        });
    },
    fetchPipeList(val) {
      let name = val.target.value;
      this.getPipeList(name);
    },
    getPipeItem(item) {
      this.saveInputs.PIPE_NAME = item.PIPE_NAME;
      this.saveInputs.PIPE_CODE = item.ID;
      this.searchPipeList = [];
    },
    colsedSelf(val) {
      this.show_Model = false;
    },
    getAreaId(val) {
      this.saveInputs.useType = val;
    },
    getAreaId_(val) {
      this.areaItem = val;
    },
    getOrganDictTree_(id) {
      let that = this;
      getOrganDictTree({
        code: "CQ",
        organizationId: "" + id
      })
        .then(res => {
          if (res.msg == "操作失败") {
            that.$message.error("服务错误!");
            return;
          }
          if (res.msg == "no user") {
            window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
            return;
          }
          let { data } = res;
          let tempList = [];
          if (data.length > 0) {
            tempList.push({
              label: "全部城区",
              id: ""
            });
            for (let i = 0; i < data.length; i++) {
              let temp_json = {};
              temp_json.label = data[i].label;
              temp_json.value = data[i].id;
              tempList.push(temp_json);
            }
            that.areaList = tempList;
            that.saveInputs.AREA_ID = "";
          } else {
            that.areaList = [
              {
                label: "全部城区",
                value: ""
              }
            ];
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  filters: {
    formateType(val) {
      let temp = dse.waterSupply_type;
      if (temp.length > 0) {
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].value == val) {
            return temp[i].label;
            break;
          }
        }
      }
    }
  },
  created() {
    let that = this;
    // that.componyID = this.DSE.tree[0].id;
    that.componyID = this.$store.getters.get_companyId;
    // this.initCompony = this.DSE.tree[0].label;

    let temp_tree = (this.tree = this.$store.getters.get_orgTree);
    this.search_pipe_type = temp_tree[0].type;
    that.selected = {
      id: temp_tree[0].id,
      label: temp_tree[0].label,
      type: temp_tree[0].type
    };
    that.title = temp_tree[0].label;
    this.ifEdit = this.$store.getters.get_pages_btn_allow.waterInformation.edit;
    this.ifDel = this.$store.getters.get_pages_btn_allow.waterInformation.del;

    this.getAreaUserList("", "", "", "1");

    let temp_list = JSON.parse(JSON.stringify(this.$store.getters.get_cityAreas))
    if(temp_list[0].label==="全部城区"){
        this.areaList = temp_list.splice(1) 
    }else{
       this.areaList = temp_list
    }
    this.waterSupply_type = dse.waterSupply_type;
  },
  mounted() {
    // this.saveInputs.AREA_ID = "";
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

#bagUser_manage {
  width: 100%;
  height: 100%;
  background: #ebebeb;
  display: flex;
  justify-content: space-between;
  padding: 10px 1% 0;

  .left-table {
    width: 80%;
    background: #fff;
    padding: 10px; // height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .wrap-top {
      width: 100%;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: flex-start;
      font-size: 12px;

      & > div {
        width: 200px;
        display: flex;
        justify-content: space-between;
        margin-right: 10px;

        span {
          width: 70px;
          display: inline-block;
        }
      }
    }

    .table-content {
      width: 100%;
      height: calc(100% - 100px);
      overflow-y: auto;
      line-height: 30px;
      font-size: 14px;
      color: #333;
      text-align: center;
      border: 1px solid #ccc; // border-top: none;

      .table-head {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 30px;
        background: #e2edef;
        font-weight: 600;

        .ownArea {
          width: 100px;
          border-bottom: 1px solid #ccc;
        }

        // .wrap-lists {
        //     width: calc(100% - 100px);
        //     display: flex;
        //     justify-content: space-between;
        //     align-items: center;

        & > div {
          flex: 1;
          line-height: 30px;
          border-left: 1px solid #ccc;
          height: 30px;

          span {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        & > div.users {
          flex: none;
          width: 40%; // padding: 0 10px;
        }

        & > div {
          border-bottom: 1px solid #ccc;

          &:last-child {
            border-right: none;
          }
        }

        // }
      }

      .area-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;

        .ownArea {
          width: 100px;
        }

        & > div {
          flex: 1;
          line-height: 30px;
          border-right: 1px solid #ccc;
          display: flex;
          align-items: center;

          span {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 30px;
          }

          &:last-child {
            border-right: none;
          }
        }

        & > div.users {
          flex: none;
          width: 40%; // padding: 0 10px;

          span {
            display: inline-block;
            line-height: 30px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        &:last-child {
          border-bottom: none;
        }

        .action {
          font-size: 12px;
          display: flex;
          justify-content: space-around;
          align-items: center;

          span {
            display: inline-block;
            line-height: 25px; // border: 1px solid blue;
            color: #0984fe;
            cursor: pointer;

            &.ifEdit {
              background: gray;
              color: #fff;
              cursor: not-allowed;
            }

            &.ifDel {
              background: gray;
              color: #fff;
              cursor: not-allowed;
            }
          }
        }

        &:last-child {
          border-bottom: 1px solid #ccc;
        }
      }
    }

    .pagination {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: center;
    }
  }

  .right-tree {
    width: 19%;
    background: #fff;

    .title {
      height: 30px;
      width: 100%;
      background: #e2edef;
      line-height: 30px;
      padding-left: 10px;
      font-weight: 600;
      font-size: 14px;
    }

    .tree-content {
      padding: 10px;
      width: 100%;
      height: calc(100% - 30px);
    }
  }

  .inputs {
    width: 100%;
    height: 100%; // padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .col {
        width: 50%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: 600;
        color: #333;

        label {
          display: inline-block;
          width: 135px;
          text-align: right;
        }

        input {
          display: inline-block;
          width: calc(100% - 140px);
          border-radius: 4px;
          height: 30px;
          padding-left: 5px;
          border: 1px solid #ccc;
        }

        .el-select {
          width: calc(100% - 140px);
        }

        .el-input {
          width: calc(100% - 140px);
        }

        &.hasPosition {
          position: relative;

          .subList {
            position: absolute;
            top: 35px;
            left: 40px;
            margin-left: 100px;
            width: calc(100% - 140px);
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            z-index: 100;
            max-height: 200px;
            overflow-y: auto;

            .pipeItem {
              border-bottom: 1px solid #ccc;
              text-align: center;
              width: 100%;
              overflow-x: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;

              &:hover {
                background: #0984fe;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
