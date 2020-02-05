const router = require('koa-router')()
const API = require("../common/wxOpen");
const xml = require("../common/xml");

router.prefix("/event");

// 公众号授权开放平台的消息通知
router.post("/msg", xml, async (ctx, next) => {
  if (ctx.xml.ComponentVerifyTicket) {
    API.setComponentVerifyTicket(ctx.xml.ComponentVerifyTicket[0]); //非常重要
    ctx.body = "success";
  } else if (ctx.xml.InfoType) {
    if (ctx.xml.InfoType[0] == "authorized") {
      //公众号授权推送事件
      console.log("authorized");
      ctx.body = "success";
      let res = await API.auth(ctx.xml.AuthorizationCode[0]);
      console.log("res", res);
    } else if (ctx.xml.InfoType[0] == "unauthorized") {
      ctx.body = "success";
      console.log("unauthorized");
    } else if (ctx.xml.InfoType[0] == "updateauthorized") {
      ctx.body = "success";
    }
  }
});

//公众号事件
router.post("/:appid", xml, (ctx, next) => {
  const appid = ctx.params.appid;
  const xml = ctx.xml;
  return new Promise(async (resolve, reject) => {
    let msg, opt;
    //全网发布测试
    if (appid == "wx570bc396a51b8ff8") {
      //推送事件
      if (xml.MsgType[0] == "event") {
        opt = {
          ToUserName: xml.FromUserName[0],
          FromUserName: xml.ToUserName[0],
          CreateTime: parseInt(new Date().getTime() / 1000),
          MsgType: "text",
          Content: xml.Event[0] + "from_callback"
        };
        msg = API.encrypt(opt);
        resolve(msg);
      } else if (xml.Content[0] == "TESTCOMPONENT_MSG_TYPE_TEXT") {
        opt = {
          ToUserName: xml.FromUserName[0],
          FromUserName: xml.ToUserName[0],
          CreateTime: new Date().getTime() / 1000,
          MsgType: "text",
          Content: "TESTCOMPONENT_MSG_TYPE_TEXT_callback"
        };
        msg = API.encrypt(opt);
        resolve(msg);
      } else if (xml.Content[0].indexOf("QUERY_AUTH_CODE") > -1) {
        resolve("success");
        let component_access_token = await API.getComponentAccessToken();
        let index = xml.Content[0].indexOf(":");
        let auth_code = xml.Content[0].substring(index + 1);
        let result = await axios.post(
          "https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=" +
            component_access_token,
          {
            component_appid: plat.appid,
            authorization_code: auth_code
          }
        );
        result = JSON.parse(result.data);
        API.sendCustomMessage(appid, xml.FromUserName[0], "text", {
          text: auth_code + "_from_api"
        });
      } else {
        opt = {
          ToUserName: xml.FromUserName[0],
          FromUserName: xml.ToUserName[0],
          CreateTime: new Date().getTime() / 1000,
          MsgType: "text",
          Content: "LOCATIONfrom_callback"
        };
        msg = API.encrypt(opt);
        resolve(msg);
      }
    } else {
      resolve("success");
    }
  }).then(data => {
    ctx.body = data;
  });
});

module.exports = router
