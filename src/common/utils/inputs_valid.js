 /**
  * 基本表单的校验
  */
 
 
 export default class Valid{

    // 判断是否是数字 或者带有小数点的浮点数
    isNumber(val){  
        let  temp =val;
        let reg = /^\d+(\.\d+)?$/;
        return  reg.test(temp)
    }
    // 手机号
    isPhone(val){ 
        let  temp =val;
        let reg = /^1\d{10}$/;
        return  reg.test(temp)
    }
    // 固定手机号
    isTel(val){   
        let  temp =val;
        let reg = /^0\d{2,3}-?\d{7,8}$/;
        return  reg.test(temp)        
    }
    // 判断是否是邮箱
    isEmail(val){  
        let temp  = val;
        let reg = /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;
        return  reg.test(temp)
    }
    //  判断是否是 正整数
    isInt(val){
        let re = /^[0-9]+$/;
        return  re.test(val)
    }
    // 判断是否是 正的浮点数 
    isFloat(val){
        let re = /^\d+\.\d+$/;
        return re.test(val)
    }

}