"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------imports--------------------------------------------//
var moment = require('moment');

var server = require('express').Router();

var _require = require('../db.js'),
    Transactions = _require.Transactions,
    User = _require.User,
    Categories = _require.Categories;

var bodyParser = require('body-parser');

var _require2 = require('sequelize'),
    Sequelize = _require2.Sequelize;

var Op = Sequelize.Op; //-----------------------------get routes--------------------------------------------//

server.get('/:email/:from/:to/:type', getuser, getMoves);

function getuser(req, res, next) {
  var userId;
  return regeneratorRuntime.async(function getuser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findAll({
            where: {
              email: req.params.email
            }
          }).then(function (user) {
            userId = user[0].dataValues.id;
          })["catch"](function (err) {
            res.send("No se encuentra el Usuario");
            return;
          }));

        case 2:
          req.userId = userId;
          next();

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getMoves(req, res, next) {
  var from, to, type, data;
  return regeneratorRuntime.async(function getMoves$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          from = req.params.from;
          to = req.params.to;
          type = [req.params.type];
          data = [];

          if (req.params.type === "todas") {
            type = ["ingreso", "egreso"];
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(Transactions.findAll({
            order: [['date', 'DESC']],
            where: {
              userId: req.userId,
              date: _defineProperty({}, Op.between, [from, to]),
              type: type
            }
          }).then(function (moves) {
            if (moves) {
              var movement = {};
              moves.map(function (move) {
                movement = {};
                movement.id = move.dataValues.id;
                movement.date = move.dataValues.date;
                movement.categoryId = move.dataValues.categoryId;
                movement.amount = move.dataValues.amount;
                movement.type = move.dataValues.type;
                movement.concept = move.dataValues.concept;
                data.push(movement);
              });
            } else {
              res.send("No se encuentran resultados");
            }
          })["catch"](function (err) {
            res.sendStatus(400);
          }));

        case 7:
          console.log(data.length);
          res.send(data);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}

module.exports = server;