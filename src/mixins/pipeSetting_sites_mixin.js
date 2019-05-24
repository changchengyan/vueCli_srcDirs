export let sitesAction = {
    data(){
        return{
            ifShowModel: false, //显示弹窗的控制
            fetchContent: '', //
            modelType: false, //保存成功或者失败的弹窗
            status: null,  //成功或者失败
            del_id: null, //删除的Id
            del_index:null, //删除的索引
            del_type:null , //删除的类型
            addFlag:true, //控制 新增的按钮
            editFlag:true, //控制 编辑的按钮
            delFlag:true, //控制  删除的按钮
            all: {
                totalPage: 1,
                search: '',
                list: [],
                currentPage:1
            },
            currentPage:1, //当前的页数
        };
    },
    methods: {
        closeModel(val) {
            this.ifShowModel = val.modelFlag;
        },
        configDel(obj) {
            let del_index = this.del_index;
            let del_type = this.del_type;
            this.deleteMonitor_(obj.num, del_index, del_type);
        },
        delate(id, index) {
            let flag = this.delFlag;
            if(!flag){
                return;
            }
            this.del_id = id;
            this.del_index = index;
            this.ifShowModel = true;
            this.del_type = '1';
        },
        gotoDetail(item){
            let flag = this.editFlag;
            if(!flag){
                return;
            }
            let temp_item = item;
            this.$router.push({
                name: 'addSites',params:{'edit':temp_item,'editAble':true}
            });
            this.$store.commit('set_asideStatus', false);
            this.$emit('hiddenAside');
        },
        gotoAddModel(num){
            let flag =  this.addFlag;
            if(!flag){
                return;
            }
            this.$router.push({
                name: 'addSites',
                params:{
                    'activedIndex':num
                }
            });
            this.$store.commit('set_asideStatus', false);
            this.$emit('hiddenAside');
        },
        search() {
            let temp_name = this.all.search;
            this.currentPage = 1;
            this.all.currentPage = 1;
            this.getPipeMonitorPoint_('1', temp_name, '');
        },
        handleCurrent(num) {
            this.currentPage = num;
            let temp_searchName = this.all.search;
            this.all.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '');
        },
        handlePrev(num) {
            this.currentPage = num;
            let temp_searchName = this.all.search;
            this.all.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '');
        },
        handleNext(num) {
            let temp_searchName = this.all.search;
            this.all.currentPage = num;
            this.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '');
        },
    }
};


