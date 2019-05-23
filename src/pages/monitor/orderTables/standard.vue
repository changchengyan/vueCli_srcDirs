<template>
  <div id="dispatch">
    <div class="row first">
      <span class="col big">工单信息</span>
      <span class="col" @click="goHome">返回</span>
    </div>
    <div class="row last">
      <div class="col actions">
          <template v-if="haveDispatch=='false'">
            <span @click="dispatch_">派发</span>
          </template>
          <template v-else>
            <span class="finish">派发完成</span>
          </template>
        <div class="export" @click="exportPdf">
          <span>导出</span>
        </div>
        <div class="print" @click="print">
          <span>打印</span>
        </div>
        <template v-if="haveDispatch=='true'">
          <div class="upload">
            <span>
              <i class="el-icon-upload"></i>
              上传文件
              <input
                type="file"
                class="fullTab"
                @change="getFile($event)"
              >
            </span>
          </div>
        </template>
        <template v-else>
          <div class="upload">
            <span class="upload gray">
              <i class="el-icon-upload"></i>
              上传文件
            </span>
          </div>
        </template>
      </div>
    </div>
    <template v-if="haveDispatch=='false'">
      <div class="tables">
        <div class="table-item">
          <div class="inner-wrap">
            <div class="mainHead">
              <span>{{companyName}}检修派工单</span>
            </div>
            <div class="subHead">
              <div class="col">
                <span>检修单号:</span>
                <span>{{workOrder.orderNum}}</span>
              </div>
              <div class="col">
                <span>派单时间:</span>
                <span>{{workOrder.orderTime}}</span>
              </div>
            </div>
            <table>
              <tr>
                <td>
                  <span>检修地点</span>
                </td>
                <td>
                  <input type="text" placeholder="检修地点" v-model="workOrder.address">
                </td>
                <td>
                  <span>最迟处理时间</span>
                </td>
                <td colspan="5">
                  <el-date-picker
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-model="workOrder.lastDoTime"
                    type="datetime"
                    placeholder="选择日期"
                  ></el-date-picker>
                </td>
              </tr>
              <tr>
                <td>
                  <span>紧急程度</span>
                </td>
                <td>
                  <el-select v-model="workOrder.hurrySelect" placeholder="请选择">
                    <el-option
                      v-for="item in  workOrder.hurryList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </td>
                <td>
                  <span>检修类型</span>
                </td>
                <td colspan="5">
                  <el-select v-model="workOrder.typeSelect" placeholder="请选择">
                    <el-option
                      v-for="item in workOrder.typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>
                  <span>派单人</span>
                </td>
                <td>
                  <span>{{workOrder.orderer}}</span>
                </td>
                <td>
                  <span>处理人</span>
                </td>
                <td colspan="5" class="getWorker">
                  <input
                    type="text"
                    placeholder="处理人"
                    v-model="workOrder.doerName"
                    @focus="getWorkers"
                  >
                  <div class="subLists" v-if="workers.length&&colseFlag">
                    <div
                      class="listItem"
                      v-for="(item,index) in workers"
                      :key="index"
                      @click="selectThisWorker(item)"
                    >{{item.NAME}}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <span>检修内容</span>
                </td>
                <td colspan="4">
                  <input type="text" placeholder="请输入检修内容" v-model="workOrder.repireContent">
                </td>
              </tr>
              <tr>
                <td :rowspan="workOrder.productList.length+2">
                  <span>材料清单</span>
                </td>
                <td>
                  <span>材料名称</span>
                </td>
                <td>
                  <span>单位</span>
                </td>
                <td>
                  <span>数量</span>
                </td>
                <td>
                  <span>操作</span>
                </td>
              </tr>
              <tr v-for="(item,index) in workOrder.productList" :key="index">
                <td>
                  <input v-model="item.name" type="text" placeholder="材料名称">
                </td>
                <td>
                  <input v-model="item.unit" type="text" placeholder="单位">
                </td>
                <td>
                  <input
                    v-model="item.number"
                    @change="verifyNum($event,index)"
                    type="number"
                    min="0"
                    placeholder="数量"
                  >
                </td>
                <td class="del">
                  <span class="btn-del" @click="workOrder_del(index)">删除</span>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="addCol">
                  <span @click="workOrder_add" class="btn-add">新增</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>派发意见</span>
                </td>
                <td colspan="4">
                  <input type="text" placeholder="派发意见" v-model="workOrder.orderAdvice">
                </td>
              </tr>
              <tr class="noBorder">
                <td colspan="2">
                  <span>派发部门:{{workOrder.orderDept}}</span>
                </td>
                <td colspan="3">
                  <span>处理部门:{{workOrder.repairDept}}</span>
                </td>
              </tr>
              <tr class="noBorder">
                <td colspan="2">
                  <span>签字:</span>
                </td>
                <td colspan="3">
                  <span>签字:</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="tables">
        <div class="table-item">
          <div class="inner-wrap">
            <div class="mainHead">
              <span>{{companyName}}检修派工单</span>
            </div>
            <div class="subHead">
              <div class="col">
                <span>检修单号:</span>
                <span>{{workOrder.orderNum}}</span>
              </div>
              <div class="col">
                <span>派单时间:</span>
                <span>{{workOrder.orderTime}}</span>
              </div>
            </div>
            <table>
              <tr>
                <td>
                  <span>检修地点</span>
                </td>
                <td>
                  <input readonly type="text" placeholder="检修地点" v-model="workOrder.address">
                </td>
                <td>
                  <span>最迟处理时间</span>
                </td>
                <td colspan="2">
                  <span>{{workOrder.lastDoTime}}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>紧急程度</span>
                </td>
                <td>
                  <span>{{workOrder.hurrySelect|formateHurry}}</span>
                </td>
                <td>
                  <span>检修类型</span>
                </td>
                <td colspan="2">
                  <span>{{workOrder.typeSelect|formateRepairType}}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>派单人</span>
                </td>
                <td>
                  <span>{{workOrder.orderer}}</span>
                </td>
                <td>
                  <span>处理人</span>
                </td>
                <td colspan="2" class="getWorker">
                  <span>{{workOrder.doerName}}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>检修内容</span>
                </td>
                <td colspan="4">
                  <input type="text" placeholder="请输入检修内容" v-model="workOrder.repireContent">
                </td>
              </tr>
              <tr>
                <td :rowspan="workOrder.productList.length+2">
                  <span>材料清单</span>
                </td>
                <td>
                  <span>材料名称</span>
                </td>
                <td>
                  <span>单位</span>
                </td>
                <td>
                  <span>数量</span>
                </td>
              </tr>
              <tr v-for="(item,index) in workOrder.productList" :key="index">
                <td>
                  <input readonly :ref="'name'+(index+1)" type="text" placeholder="材料名称">
                </td>
                <td>
                  <input readonly :ref="'unit'+(index+1)" type="text" placeholder="单位">
                </td>
                <td>
                  <input readonly :ref="'number'+(index+1)" type="text" placeholder="数量">
                </td>
              </tr>
              <tr>
                <td>
                  <span>派发意见</span>
                </td>
                <td colspan="4">
                  <span>{{workOrder.orderAdvice}}</span>
                </td>
              </tr>
              <tr class="noBorder">
                <td colspan="2">
                  <span>派发部门:{{workOrder.orderDept}}</span>
                </td>
                <td colspan="3">
                  <span>处理部门:{{workOrder.repairDept}}</span>
                </td>
              </tr>
              <tr class="noBorder">
                <td colspan="2">
                  <span>签字:</span>
                </td>
                <td colspan="3">
                  <span>签字:</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </template>
    <save-model
      :showModel="save_model.toggleShowModel"
      :type="true"
      :flag="save_model.save_flag"
      :content="save_model.save_msg"
      @delThis="hiddenSaveModel"
    ></save-model>
    <iframe :src="makepdf_path" frameborder="0" height="0" width="0" style="position:absolute"></iframe>
  </div>
</template>

<script>
import {
  saveOrUpdateWorkorder,
  queryPersonByDept,
  expWorkWorder2xls
} from "@/api/rushrepair/workOrder";
import { uploadFiles } from "@/api/common/upload";
import saveModel from "@/common/components/poupe/save_status";

export default {
  components: {
    saveModel
  },
  data() {
    return {
      id: "", //工单id
      makepdf_path: "",
      deptId: "", //部门ID
      companyName: "", //公司名字
      haveDispatch: "false", //是否已派单
      tabs: [],
      tableIndex: 0,
      workOrder: {
        orderNum: "", //工单单号
        orderTime: "", // 派单时间
        lastDoTime: "", //最近处理时间
        address: "", //检修地点
        tel: "", //派发人手机号
        hurryList: [],
        hurrySelect: "",
        typeList: [],
        typeSelect: "",
        reporter: "", //上报人
        contacts: "", //联系电话
        orderer: "", //派单人
        doer: "", // 处理人ID
        doerName: "", //处理人名字
        dangerDesc: "", // 隐患描述
        repireContent: "", // 检修内容
        productList: [
          {
            name: "",
            unit: "",
            number: ""
          },
          {
            name: "",
            unit: "",
            number: ""
          },
          {
            name: "",
            unit: "",
            number: ""
          }
        ], // 材料
        orderAdvice: "", //派发意见
        orderDept: "", //派发部门
        repairDept: "" //处理部门
      },
      workers: [],
      workerName: "",
      colseFlag: true,
      save_model: {
        toggleShowModel: false,
        save_flag: false,
        save_msg: ""
      },
      tableType: 0 // 默认选择是原有工单
    };
  },
  beforeDesdivoy() {
    this.$router.push({
      name: "pipe_monitor_earlyWarning"
    });
    this.$store.commit("setAside_status", true);
    this.$emit("showAside");
  },
  methods: {
    goHome() {
      this.$router.go(-1);
      this.$store.commit("setAside_status", true);
      this.$emit("showAside");
      sessionStorage.setItem("haveDispatch", "false");
    },
    print() {
      let flag = this.tableType;
      let temp_workOrder = this.getOrderInputs();
      let type = this.workOrder.typeSelect;
      let temp_type = null;
      let list = dse.problem_type;
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === type) {
          temp_type = list[i].label;
        }
      }

      let temp_data = {
        orgName: this.companyName,
        orderNum: this.workOrder.orderNum,
        orderTime: this.workOrder.orderTime,
        lastDoTime: this.workOrder.lastDoTime,
        address: this.workOrder.address,
        tel: this.workOrder.tel,
        hurrySelect:
          this.workOrder.hurrySelect == "0"
            ? "紧急"
            : this.workOrder.hurrySelect == "1"
            ? "较急"
            : "一般",
        typeSelect: temp_type,
        reporter: this.workOrder.reporter,
        contacts: this.workOrder.contacts,
        orderer: this.workOrder.orderer,
        doerName: this.workOrder.doerName,
        dangerDesc: this.workOrder.dangerDesc,
        repireContent: this.workOrder.repireContent,
        productList: temp_workOrder,
        orderAdvice: this.workOrder.orderAdvice,
        orderDept: this.workOrder.orderDept,
        repairDept: this.workOrder.repairDept
      };
      sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
      let pageUrl = dse.static_baseUrl + "/tables/standard.html";
      window.open(pageUrl);
    },
    exportPdf() {
      let that = this;
      let temp_id = this.workOrder.id;
      this.expWorkWorder2xls_(temp_id);
    },
    thisTab(index) {
      this.tableIndex = index;
    },
    workOrder_add() {
      this.workOrder.productList.push({
        name: "",
        unit: "",
        number: ""
      });
    },
    workOrder_del(index) {
      this.workOrder.productList.splice(index, 1);
    },
    feedBack_add() {
      this.feedBack.productList.push({
        name: "",
        unit: "",
        number: ""
      });
    },
    feedBack_del(index) {
      this.feedBack.productList.splice(index, 1);
    },
    queryPersonByDept_() {
      let that = this;
      queryPersonByDept({
        id: "" + that.deptId
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
          let { data } = res;
          that.workers = data || [];
        }
      });
    },
    selectThisWorker(val) {
      this.workOrder.doer = val.ID;
      this.workOrder.doerName = val.NAME;
      this.colseFlag = false;
    },
    getWorkers(val) {
      this.colseFlag = true;
      this.queryPersonByDept_();
    },
    hiddenSaveModel(val) {
      this.save_model.toggleShowModel = false;
    },
    saveOrUpdateWorkorder_(formData_) {
      let that = this;
      saveOrUpdateWorkorder(formData_).then(res => {
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
        that.save_model.toggleShowModel = true;
        that.save_model.save_flag = res.status == 1;
        that.save_model.save_msg = res.msg;
        if (res.status == 1) {
          let { data } = res;
          that.haveDispatch = "true";
          sessionStorage.setItem("haveDispatch", "true");
          that.workOrder.orderTime = data.dispatchTime || "";
          that.workOrder.orderNum = data.orderCode || "";
          that.workOrder.id = data.id;

          let temp_arr = JSON.parse(res.data.materialArr);
          let temp_getList = [];
          for (let i = 0; i < temp_arr.length; i++) {
            let temp_json = {};
            temp_json.content = temp_arr[i].content;
            temp_json.name = temp_arr[i].name;
            temp_json.unit = temp_arr[i].unit;
            temp_json.number = temp_arr[i].num;
            temp_json.remark = temp_arr[i].remark;
            temp_getList.push(temp_json);
          }
          that.workOrder.productList = temp_getList;
        }
      });
    },
    getOrderInputs() {
      let that = this;
      let temp_list = that.workOrder.productList;
      let temp_arr = [];
      if (temp_list.length > 0) {
        for (let i = 0; i < temp_list.length; i++) {
          if (temp_list[i].name != "") {
            temp_arr.push({
              name: "" + temp_list[i].name,
              unit: "" + temp_list[i].unit,
              num: "" + temp_list[i].number,
              content: "",
              remark: ""
            });
          }
        }
      }
      return temp_arr;
    },
    dispatch_() {
      let that = this;
      if (
        this.workOrder.address == "" ||
        this.workOrder.hurrySelect == "" ||
        this.workOrder.typeSelect == "" ||
        this.workOrder.doerName == "" ||
        this.workOrder.repireContent == "" ||
        this.workOrder.orderAdvice == ""
      ) {
        this.$message.error("请把基本填写完整!");
        return;
      }
      let temp_arr = this.getOrderInputs();
      let formData_ = new FormData();
      formData_.append("questionId", that.id);
      formData_.append("checkAddr", that.workOrder.address);
      formData_.append("lastHandleTime", that.workOrder.lastDoTime);
      formData_.append("lev", that.workOrder.hurrySelect);
      formData_.append("orderType", that.workOrder.typeSelect);
      formData_.append("handleUser", that.workOrder.doer);
      formData_.append("checkContent", that.workOrder.repireContent);
      formData_.append("materialArr", JSON.stringify(temp_arr));
      formData_.append("dispatchAdvice", that.workOrder.orderAdvice);
      formData_.append("orderStatus", "1");
      formData_.append("proFrom", "3");
      this.saveOrUpdateWorkorder_(formData_);
    },
    dispatch_feedBack() {},
    getFile(e) {
      let that = this;
      let temp_file = e.target.files[0];
      let temp_fileName = temp_file.name;

      let temp_fileType = temp_file.type;

      if (temp_file.size / 1024 / 1024 > 10) {
        that.$message.error("您上传的文件不能大于10M!");
        return;
      }

      if (
        temp_fileType == "image/jpeg" ||
        temp_fileType == "application/pdf" ||
        temp_fileType == "application/msword" ||
        temp_fileType == "application/vnd.ms-excel" ||
        temp_fileType ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        let post_formdata = new FormData();
        post_formdata.append("fileBiz", that.workOrder.id);
        post_formdata.append("fileName", temp_fileName);
        post_formdata.append("files", temp_file);
        uploadFiles(post_formdata).then(res => {
          that.save_model.toggleShowModel = true;
          that.save_model.save_flag = res.status == 1;
          that.save_model.save_msg = res.msg;
        });
      } else {
        that.$message.error(
          "您上传的文件格式应该为：png、jpg、pdf、word、excel"
        );
      }
    },
    expWorkWorder2xls_(id) {
      let that = this;
      let formdata = new FormData();
      formdata.append("id", id);
      formdata.append("questionId", "");
      formdata.append("exportType", "1");
      expWorkWorder2xls(formdata)
        .then(res => {
          if (res.status === 1) {
            let sub_url = res.data.path ? res.data.path : "";
            if (sub_url) {
              let main_url = that.$store.getters.get_filePath;
              let complate_url = main_url + sub_url;
              window.location.href = complate_url;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    verifyNum(event, i) {
      let temp_value = event.target.value;
      temp_value = Math.abs(temp_value);
      this.workOrder.productList[i].number = temp_value;
    }
  },
  created() {
    let temp_id = this.$route.params.id;
    this.id = temp_id;
    this.deptId = this.$store.getters.get_deptId;
    this.filePath = this.$store.getters.get_filePath;
    this.haveDispatch = sessionStorage.getItem("haveDispatch") || "false";
    this.workOrder.orderer = this.$store.getters.getUserName;
    this.$store.getters.get_tel;
    this.workOrder.orderDept = this.workOrder.repairDept = this.$store.getters.get_dept;
    this.companyName = this.$store.getters.getCompyName;

    this.workOrder.hurryList = dse.dangerlist;
    this.workOrder.typeList = dse.problem_type;
  },
  beforeDestroy() {
    sessionStorage.setItem("haveDispatch", "false");
  },
  filters: {
    formateHurry(val) {
      let temp = "";
      let list = dse.dangerlist;
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === val) {
          temp = list[i].label;
        }
      }
      return temp;
    },
    formateRepairType(val) {
      let temp = "";
      let list = dse.problem_type;
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === val) {
          temp = list[i].label;
        }
      }
      return temp;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

input {
  display: inline-block;
  height: 30px;
  width: 100%;
  border: none;
  padding-left: 5px;
}

textarea {
  border: none;
  width: 100%;
}

#dispatch {
  width: 100%;
  height: 100%;
  background: #ccc;

  .row.first {
    width: 100%;
    height: 40px;
    background: #ccc;
    display: flex;
    justify-content: space-between;
    position: relative;
    font-size: 14px;

    span {
      display: inline-block;
      padding: 10px 15px;
      position: absolute;
      bottom: 0;
      background: #0b83fe;
      color: #fff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      cursor: pointer;

      &:first-child {
        left: 20px;
      }

      &:last-child {
        right: 20px;
        padding: 5px 15px;
        background: #ff8901;
      }
    }
  }

  .row.last {
    width: 100%;
    height: 30px;
    padding: 0 20px;
    background: #cafafc;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;

    .tabs {
      width: 150px;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #333;
      font-weight: 600;
      font-size: 16px;

      .tab-item {
        height: 100%;
        line-height: 30px;
        cursor: pointer;

        &.active {
          color: red;
          border-bottom: 2px solid red;
        }
      }
    }

    .actions {
      // width: 200px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        display: inline-block;
        width: 70px;
        line-height: 25px;
        background: #0b83fe;
        border-radius: 5px;
        cursor: pointer;
        color: #fff;
        text-align: center;
        margin-right: 20px;
      }

      div {
        width: 80px;
        height: 25px;
        position: relative;
        margin-right: 20px;

        span {
          width: 100%;
          margin-right: 0px;

          &.gray {
            background: gray;
            cursor: not-allowed;
          }
        }

        input {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
      }
    }
  }

  .tables {
    width: 100%;
    height: calc(100% - 80px);
    padding: 0 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;

    .table-item {
      width: 800px;
      height: 100%;

      .inner-wrap {
        width: 100%;
        height: 100%;
        background: #fff;
        font-size: 14px;
        padding: 0 10px;
        overflow-y: auto;

        .mainHead {
          font-size: 16px;
          line-height: 40px;
          text-align: center;
          font-weight: 600;
          border-bottom: 1px solid #ccc;

          &.old {
            border-bottom: none;
          }
        }

        .subHead {
          height: 30px;
          line-height: 30px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
        }

        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
          border-top: 1px solid #ccc;
          margin-bottom: 20px;

          tr {
            border: 1px solid #ccc;
            border-top: none;

            &.noBorder {
              border: none;

              td {
                padding-left: 20px;
                border-right: none;
                text-align: center;
              }
            }

            td {
              min-height: 40px;
              line-height: 40px;
              text-align: center;
              border-right: 1px solid #ccc;
              text-align: center;
              span {
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
              }
              span.btn-add,
              span.btn-del {
                width: 60px;
              }

              &.sm {
                width: 80px;
              }

              .inLine {
                width: calc(100% - 76px);
                display: inline-block;
              }

              &.lang {
                width: 140px;
              }

              &.middle {
                width: 100px;
              }

              &.largeText {
                padding: 0 5px;
                position: relative;

                .limitText {
                  position: absolute;
                  bottom: 10px;
                  right: 10px;
                }

                textarea {
                  margin-top: 10px;
                  height: 50px;
                  resize: none;
                }
              }

              &.addCol {
                span {
                  padding: 0 5px;
                  line-height: 20px;
                  border: 1px solid blue;
                  border-radius: 5px;
                  cursor: pointer;
                }
              }

              &.del {
                color: #333;
                font-size: 12px;

                span {
                  padding: 0 5px;
                  line-height: 20px;
                  border: 1px solid blue;
                  border-radius: 5px;
                  cursor: pointer;
                }
              }

              &.getWorker {
                position: relative;

                .subLists {
                  width: 80%;
                  position: absolute;
                  top: 40px;
                  left: 10px;
                  background: #fff;
                  min-height: 100px;
                  max-height: 200px;
                  overflow-y: auto;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

                  .listItem {
                    width: 100;
                    line-height: 30px;
                    height: 30px;
                    border-bottom: 1px solid #ccc;
                    cursor: pointer;

                    &:hover {
                      background: #0b83fe;
                      color: #fff;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
