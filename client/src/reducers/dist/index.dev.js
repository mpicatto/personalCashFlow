"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _user = _interopRequireDefault(require("./user"));

var _balance = _interopRequireDefault(require("./balance"));

var _transactions = _interopRequireDefault(require("./transactions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = (0, _redux.combineReducers)({
  user: _user["default"],
  balance: _balance["default"],
  moves: _transactions["default"]
});

exports["default"] = _default;