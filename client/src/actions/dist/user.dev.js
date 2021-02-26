"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addUser = addUser;
exports.setUser = setUser;
exports.cleanUser = cleanUser;
exports.CLEAN_USER = exports.SET_USER = exports.ADD_USER = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ADD_USER = 'ADD_USER';
exports.ADD_USER = ADD_USER;
var SET_USER = 'SET_USER';
exports.SET_USER = SET_USER;
var CLEAN_USER = 'CLEAN_USER'; //CREAR USUARIO

exports.CLEAN_USER = CLEAN_USER;

function addUser(data) {
  return function (dispatch) {
    console.log(data);

    _axios["default"].post("http://localhost:3001/user", data).then(function (resp) {
      dispatch({
        type: ADD_USER,
        payload: resp.data
      });
      alert("Usuario creado.");
    }).then(_reactRouterDom.useHistory.push("/"))["catch"](function (err) {
      alert(err);
    });
  };
}

function setUser(user) {
  console.log(user);
  return {
    type: SET_USER,
    payload: user
  };
}

function cleanUser() {
  return {
    type: CLEAN_USER
  };
}