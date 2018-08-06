/**
 * 依赖：app_db.js  crypto-js.js aes.js
 * 系统配置
 */
/**
 * 去左右空格
 * @returns {string}
 */
String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
};
/**
 * 替换字符串
 * @param reallyDo 老字符串
 * @param replaceWith 新字符串
 * @param ignoreCase 是否区分大小写
 * @returns {string}
 */
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
  if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
    return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
  } else {
    return this.replace(reallyDo, replaceWith);
  }
};
/**
 * 日期格式化
 * @param fmt yyyyMMddHHmmss
 * @returns {*}
 */

Date.prototype.pattern = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  var week = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};
/**
 * 使用数据，动态
 */
var appBase = {
  log: function (msg) {
    var modelName = window.location.hash;
    if (modelName == "" || modelName.length < 2) {
      modelName = window.location.pathname;
    }
    appBase.debug(modelName, msg);
  },
  debug: function (modelName, msg) {
    if (msg == undefined || msg == null) return;
    if ((typeof msg) == "object") {
      appBase.debugObj(modelName, msg);
    } else {
      console.log("--" + modelName + ":" + msg);
    }
  },
  debugObj: function (modelName, obj) {
    var str = "";
    for (var tmp in obj) {
      str += tmp + "=" + obj[tmp] + "  ";
    }
    console.log("--" + modelName + ":" + str);
  },
  log2: function (msg) {
    console.log(msg);
  },

  //加密方式：
  //appBase.getRsaCoder().encrypt(XXX)  正常参数（参数短）
  //appBase.getRsaCoder().encryptLong(XXX)  参数过长
  //解密方式：
  //appBase.getRsaCoder().decrypt(XXX)  
  _rsacoder: null,
  getRsaCoder: function () {
    if (appBase._rsacoder == null) {
      appBase._rsacoder = new RSAClient();
    }
    return appBase._rsacoder;
  },

  server_onError: function (data, status) {//进行错误处理
    alert("错误：" + status);
  },

  //------------数组工具-------------------------------------------------------------
  getArrayItem: function (entityArray, fieldName, value) {
    //获取数组中特定项
    for (var i = 0; i < entityArray.length; i++) {
      if (entityArray[i][fieldName] == value) {
        return entityArray[i];
      }
    }
    return null;
  },
  getItem: function (entityArray, idName, id) {
    return appBase.getArrayItem(entityArray, idName, id);
  },
  removeItem: function (entityArray, idName, id) {
    if (entityArray == null || entityArray["length"] == undefined) {
      return false;
    }
    for (var i = 0; i < entityArray.length; i++) {
      if (entityArray[i][idName] == id) {
        entityArray.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  getArrayObj: function (arrayP, fieldName, value) {
    return appBase.getArrayItem(arrayP, fieldName, value);
  },
  copyField: function (srcObj, targetObj, fieldInfo, callBack) {
    //指定型复制属性
    var value = "";
    for (var field in fieldInfo) {
      value = srcObj[fieldInfo[field]];
      if (value) {
        if (callBack) {
          value = callBack(field, value);
        }
        targetObj[field] = value;
      }
    }
  },

  //----------------存储-------------------------------------------------------------
  setLocalItem: function (key, value, isRsa) {
    key = (key + "").toUpperCase();
    if (value && isRsa) {
      value = appBase.getRsaCoder().encrypt(value);
    }
    window.localStorage.setItem(key, value);
  },
  getLocalItem: function (key, isRsa) {
    key = (key + "").toUpperCase();
    var value = window.localStorage.getItem(key);
    if (value && isRsa) {
      value = appBase.getRsaCoder().decrypt(value);
    }
    return value;
  },

  removeLocalItem: function (key, isRsa) {
    key = (key + "").toUpperCase();
    var tmp = window.localStorage.getItem(key);
    if (tmp) {
      window.localStorage.removeItem(key);
      if (isRsa) {
        return appBase.getRsaCoder().decrypt(tmp);
      }
      return tmp;
    }
    return "";
  },

  clearLocalItem: function () {
    window.localStorage.clear();
    window.sessionStorage.clear();
  },
  /**
   * 添加值到 session
   * @param key 不区分大小写
   * @param value
   */
  setSessionItem: function (key, value) {
    key = (key + "").toUpperCase();
    if (value) {
      value = appBase.getRsaCoder().encrypt(value);
    }
    window.sessionStorage.setItem(key, value);
  },
  /**
   * 获取本地session变量
   * @param key
   * @returns key对应的值
   */
  getSessionItem: function (key) {
    key = (key + "").toUpperCase();
    var value = window.sessionStorage.getItem(key);
    if (value) {
      value = appBase.getRsaCoder().decrypt(value);
    }
    return value;
  },
  /**
   * 删除本地session变量
   * @param key  不区分大小写的字符串
   * @returns 被删除的value
   */
  removeSessionItem: function (key) {
    key = (key + "").toUpperCase();
    var tmp = window.sessionStorage.getItem(key);
    if (tmp) {
      window.sessionStorage.removeItem(key);
      return appBase.getRsaCoder().decrypt(tmp);
    }
    return tmp;
  },

  //---------请求参数工具------------------------------------
  getQueryString: function (name) {
    //获取请求头特定参数
    var url = window.location;
    return appBase.getUrlParam(url, name);
  },
  /**
   * 从get url连接中解析参数
   * @param url 带有get参数的 url
   * @param name 参数名称
   * @returns 参数值或 null
   */
  getUrlParam: function (url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = url.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
  },

  alertMsg: function (msg) {
    if (window.plugins && window.plugins.toast) {
      window.plugins.toast.showShortCenter(msg);
    } else {
      alert(msg);
    }
  },
  debounce: function (actionFn, delay) {
    /**
     * 去抖 事件发生期间只执行一次
     * @param actionFn {function}  请求关联函数，实际应用需要调用的函数
     * @param  delay   {number}    空闲时间，单位毫秒
     * @return {function}    返回客户调用函数
     */
    var timer = null;
    return function () {
      var self = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { actionFn.apply(self, args) }, delay);
    }
  },
  throttle: function (actionFn, delay, mustRunDelay) { //节流阀;
    /**
     * 节流  事件发生期间课程执行多次
     * @param actionFn {function}  请求关联函数，实际应用需要调用的函数
     * @param  delay   {number}    空闲时间，单位毫秒
     * @param  mustRunDelay {number}  执行间隔
     * @return {function}    返回客户调用函数
     */
    var timer = null, startTime;
    return function () {
      var self = this, args = arguments, currTime = new Date();
      clearTimeout(timer);
      if (!startTime) { startTime = currTime; }
      if (currTime - startTime >= mustRunDelay) {
        actionFn.apply(self, args);
        startTime = currTime;
      } else {
        timer = setTimeout(function () { actionFn.apply(self, args); }, delay);
      }
    };
  }
  , onceClick: function (actionFn, busyTime) {
    /**
     * 去抖 事件发生期间只执行一次
     * @param actionFn {function}  请求关联函数，实际应用需要调用的函数
     * @param  busyTime   {number}    调用后多少毫秒不再响应事件，单位毫秒
     * @return {function}    返回客户调用函数
     */
    var runFlag = false;
    if (!busyTime) { busyTime = 3000; }
    return function () {
      var self = this, args = arguments;
      if (runFlag == true) { return; }
      runFlag = true;
      try { actionFn.apply(self, args); } catch (e) { };
      setTimeout(function () { runFlag == false }, busyTime);
    }
  },
  /* czz 数组求和 */
  getSum: function (arr) {
    return eval(arr.join("+"));
  },
  /* zcf 两个数的百分比 */
  percentage: function (number1, number2) {
    if (isNaN(number1) || isNaN(number2)) {
      return '-';
    }
    return (Math.round(number1 / number2 * 10000) / 100.00);// 小数点后两位百分比
  },
  /* czz 数组去重 */
  unique: function (arr) {
    var res = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
      var repeat = false;
      for (var j = 0; j < res.length; j++) {
        if (arr[i] == res[j]) {
          repeat = true;
          break;
        }
      }
      if (!repeat) {
        res.push(arr[i]);
      }
    }
    return res;
  },


  /* wangating  千分位加逗号 */
  matchThousandth: function(str) {
    var re=/(?=(?!(\b))(\d{3})+$)/g;
        str=str.replace(re,",");
        return str;
  }


};


