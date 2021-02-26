"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBalance = setBalance;
exports.cleanBalance = cleanBalance;
exports.CLEAN_BALANCE = exports.SET_BALANCE = void 0;
var SET_BALANCE = 'SET_BALANCE';
exports.SET_BALANCE = SET_BALANCE;
var CLEAN_BALANCE = 'CLEAN_BALANCE';
exports.CLEAN_BALANCE = CLEAN_BALANCE;

function setBalance(balance) {
  return {
    type: SET_BALANCE,
    payload: balance
  };
}

function cleanBalance() {
  return {
    type: CLEAN_BALANCE
  };
}