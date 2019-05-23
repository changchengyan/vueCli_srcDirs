/**
 * sessionStorage，H5，本地存储工具类，H5的sessionStorage大小只有5M，要珍惜使用~！！！
 * 引用   import  SStorage  from '@/common/utils/sessionStorage'
 */
export default {

    //set 设置 、替换、增加
    set: function(key, val) {
        sessionStorage.setItem(key, JSON.stringify(val))
    },

    remove: function(key) {
        sessionStorage.removeItem(key);
    },

    get: function(key) {
        return JSON.parse(sessionStorage.getItem(key))
    },
    getAll: function() {
        for (var i = 0; i < sessionStorage.length; i++) {
            // console.log(sessionStorage.key(i) + ' === ' + sessionStorage.getItem(sessionStorage.key(i)));
        }
    },

    // 清除本地存储
    removeAll: function() {
        sessionStorage.clear();
    }
}