"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMoves = setMoves;
exports.setCategories = setCategories;
exports.cleanMoves = cleanMoves;
exports.CLEAN_MOVES = exports.SET_CATEGORIES = exports.SET_MOVES = void 0;
var SET_MOVES = 'SET_MOVES';
exports.SET_MOVES = SET_MOVES;
var SET_CATEGORIES = 'SET_CATEGORIES';
exports.SET_CATEGORIES = SET_CATEGORIES;
var CLEAN_MOVES = 'CLEAN_MOVES';
exports.CLEAN_MOVES = CLEAN_MOVES;

function setMoves(moves) {
  return {
    type: SET_MOVES,
    payload: moves
  };
}

function setCategories(categories) {
  return {
    type: SET_CATEGORIES,
    payload: categories
  };
}

function cleanMoves() {
  return {
    type: CLEAN_MOVES
  };
}