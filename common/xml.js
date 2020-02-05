const API = require("./wxOpen");

module.exports = (ctx, next) => {
  return new Promise((resolve, reject) => {
    if (ctx.is("text/xml")) {
      ctx.req.on("data", async data => {
        let xml = await API.decrypt(data);
        resolve(xml);
      });
    } else resolve(1);
  }).then(data => {
    if (data != 1) ctx.xml = data;
    next();
  });
};
