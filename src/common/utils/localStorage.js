/**
 * localstorage，H5，本地存储工具类，H5的localstorage大小只有5M，要珍惜使用~！！！
 * 引用   import  Storage  from '@/common/utils/localStorage'
 */
export default {

    //set 设置 、替换、增加
    set: function(key, val) {
        localStorage.setItem(key, JSON.stringify(val))
    },

    remove: function(key) {
        localStorage.removeItem(key);
    },

    get: function(key) {
        return JSON.parse(localStorage.getItem(key))
    },
    getAll: function() {
        for (var i = 0; i < localStorage.length; i++) {
            // console.log(localStorage.key(i) + ' === ' + localStorage.getItem(localStorage.key(i)));
        }
    },

    // 清除本地存储
    removeAll: function() {
        localStorage.clear();
    }
}