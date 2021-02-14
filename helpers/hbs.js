const globalVars = require("../helpers/globalVars");

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
};
