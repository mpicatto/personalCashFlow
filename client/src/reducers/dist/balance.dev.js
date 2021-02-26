"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = user;

var _balance = require("../actions/balance");

var initialState = {
  balance: 0,
  date: ""
};

function user() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  if (action.type === _balance.SET_BALANCE) {
    return {
      balance: action.payload.balance,
      date: action.payload.date
    };
  }

  if (action.type === _balance.CLEAN_BALANCE) {
    return state = initialState;
  }

  return state;
}