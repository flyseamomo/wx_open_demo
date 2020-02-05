const wxapp_open = require("wx_open_app");
const redisConfig = require("./redisConfig");
const {
  componentAppid,
  componentAppSecret,
  componentKey,
  componentToken
} = require("./constants");

module.exports = new wxapp_open(
  componentAppid,
  componentAppSecret,
  componentKey,
  componentToken,
  redisConfig
);
