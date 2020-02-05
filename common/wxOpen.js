const wxapp_open = require("wxapp_open");
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
