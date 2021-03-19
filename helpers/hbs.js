const globalVars = require("../helpers/globalVars");
const moment = require("moment");

module.exports = {
  getTopLoginMsg: function () {
    return globalVars.topLoginMsg;
  },
  isInvalidLogin: function () {
    if (globalVars.topLoginMsg.length == 0) {
      return false;
    } else {
      return true;
    }
  },
  removeErrMsg: function () {
    globalVars.topLoginMsg = "";
  },
  isNotZero(value) {
    if (value == 0) return false;
    else return true;
  },
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
};
