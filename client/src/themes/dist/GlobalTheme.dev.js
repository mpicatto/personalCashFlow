"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _styles = require("@material-ui/core/styles");

var _colors = require("@material-ui/core/colors");

var theme = (0, _styles.createMuiTheme)({
  palette: {
    primary: {
      main: _colors.yellow[400]
    },
    secondary: {
      main: '#000000'
    },
    background: {
      "default": _colors.grey[400]
    }
  }
});
var _default = theme;
exports["default"] = _default;