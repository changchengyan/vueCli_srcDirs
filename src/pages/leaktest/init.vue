<template>
  <div id="init">
    <div class="stage">
      <div class="dot-pulse"></div>
    </div>
    <div class="tips">数据加载中...</div>
  </div>
</template>

<script>
import { getSessionUser } from "@/api/pipeNet_msg/home";
import { getFilePathUrl } from "@/api/common/getFilePath";
import { listAllUserChildrenById, getOrgTree } from "@/api/leaktest/menu";

import { getResourceByIdAndUser } from "@/api/common/getRouter";

export default {
  data() {
    return {};
  },
  methods: {
    btns_allowed(arr) {
      let temp_json = {
        information: {
          add: true
        },
        hiddenDanger: {
          add: true,
          checked: true,
          repair: true
        },
        repair: {
          add: true,
          dispatch: true //派单
        }
      };
      let local_json = dse.allowBtns.rushrepair;
      let temp_arr = JSON.parse(JSON.stringify(arr));
      for (let i = 0; i < temp_arr.length; i++) {
        if (temp_arr[i] === local_json.information.add) {
          temp_json.information.add = false;
        } else if (temp_arr[i] === local_json.hiddenDanger.add) {
          temp_json.hiddenDanger.add = false;
        } else if (temp_arr[i] === local_json.hiddenDanger.checked) {
          temp_json.hiddenDanger.checked = false;
        } else if (temp_arr[i] === local_json.hiddenDanger.repair) {
          temp_json.hiddenDanger.repair = false;
        } else if (temp_arr[i] === local_json.repair.add) {
          temp_json.repair.add = false;
        } else if (temp_arr[i] === local_json.repair.dispatch) {
          temp_json.repair.dispatch = false;
        }
      }
      return temp_json;
    },
    setSession() {
      let that = this;
      getSessionUser()
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
          } else if (res.status == 1) {
            let temp_session = JSON.stringify(res);
            sessionStorage.setItem("user", temp_session);
            that.$store.commit("set_comanyID", res.organizationIds[0]);
            let orgId = res.organizationIds[0]
            if(orgId==='402881d162b284680162b3a41362012a'||orgId==="8ae4b2d5645e202701645ec426720013"){
                that.$store.commit("set_pipe_defaultLayer",orgId)
                that.$store.commit("set_xfs_defaultLayer",orgId)
                that.$store.commit("set_fm_defaultLayer",orgId)
            }else{
                  that.$store.commit("set_pipe_defaultLayer",'402881d162b284680162b3a41362012a')
                  that.$store.commit("set_xfs_defaultLayer",'402881d162b284680162b3a41362012a')
                  that.$store.commit("set_fm_defaultLayer",'402881d162b284680162b3a41362012a')
            }

            that.$store.commit("set_compyName", res.organizationName);
            that.$store.commit("set_userName", res.name);
            that.$store.commit("set_dept", res.departmentName);
            that.$store.commit("set_deptID", res.mainDepartmentIds[0]);
            that.$store.commit("set_tel", res.mobile);
            that.$store.commit("set_btnsIds", res.resourceIds);
            // that.getOrganizationTree_();

            let temp_arr = res.positions[0] ? res.positions[0].split(',') : []
            if(temp_arr.length>0){
                temp_arr[0] =  parseFloat(temp_arr[0]) 
                temp_arr[1] =  parseFloat(temp_arr[1]) 
            }else{
                  temp_arr = [106.290351, 36.001819]
            }
            that.$store.commit("set_cityPosition", temp_arr);

            that.getOrgTree_(res.organizationIds[0]);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getRouters() {
      let that = this;
      getResourceByIdAndUser({
        id: "" + id,
        flag: "",
        pid: ""
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
          let temp_data =res&&res.length ? res : [];
          let routes = [];
          if (res&&res.length) {
            for (let i = 0; i < temp_data.length; i++) {
              routes.push({
                path: temp_data[i].url,
                name: temp_data[i].name,
                icon: temp_data[i].img,
                status: false
              });
            }
            routes[0].status = true;
          }
          sessionStorage.setItem("routelist", routes);
          // that.MenuData = routes;
          that.$store.commit("set_menuList",routes)

        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getFilePathUrl_() {
      let that = this;
      getFilePathUrl().then(res => {
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
        if (res.status == 1) {
          let { data } = res;
          that.$store.commit("set_filePath", data.filePathUrl);
        }
      });
    },
    getOrgTree_(id) {
      let that = this;
      getOrgTree({
        companyId: "" + id
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
          that.$store.commit("set_orgTree", [res.data]);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    let that = this;
    setTimeout(() => {
      that.$router.push({
        path: "/pipe/leaktest"
      });
    }, 1000 * 1.5);
  },
  created() {
    if(window.personalTimer){
      clearInterval(personalbar)
    }
    sessionStorage.setItem("initRoute", 0);
     this.setSession();
    this.getRouters();
    this.getFilePathUrl_();
  }
};
</script>

<style lang="scss" scoped>
@keyframes dotPulse {
  0% {
    box-shadow: 9964px 0 0 -10px #0b83ff, 9999px 0 0 0 #0b83ff,
      10044px 0 0 2px #0b83ff;
  }

  25% {
    box-shadow: 9964px 0 0 0 #0b83ff, 9999px 0 0 2px #0b83ff,
      10044px 0 0 0 #0b83ff;
  }

  50% {
    box-shadow: 9964px 0 0 2px #0b83ff, 9999px 0 0 0 #0b83ff,
      10044px 0 0 -10px #0b83ff;
  }

  75% {
    box-shadow: 9964px 0 0 0 #0b83ff, 9999px 0 0 -10px #0b83ff,
      10044px 0 0 0 #0b83ff;
  }

  100% {
    box-shadow: 9964px 0 0 -10px #0b83ff, 9999px 0 0 0 #0b83ff,
      10044px 0 0 2px #0b83ff;
  }
}

#init {
  width: 100%;
  height: 100%;
  position: relative;
  .stage {
    width: 200px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -50px;
    margin-left: -100px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .dot-pulse {
      position: relative;
      left: -9999px;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      background-color: #0b83ff;
      color: #0b83ff;
      box-shadow: 9964px 0 0 0 #0b83ff, 9999px 0 0 0 #0b83ff,
        10044px 0 0 0 #0b83ff;
      animation: dotPulse 1.5s infinite linear;
    }
  }
  .tips {
    width: 100px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: 30px;
    margin-left: -40px;
  }
}
</style>

