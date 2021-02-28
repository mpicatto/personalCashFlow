//----------------------------imports--------------------------------------------//
const moment =require('moment');
const server = require('express').Router();
const { Transactions, User,Categories } = require('../db.js');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

//-----------------------------get routes--------------------------------------------//



//---------------get current balance + last5 balances + last 10 moves------------------ 
server.get('/balance/:email/:last', getuser, getCategories, currentBalance,past5balances,getLast10movs  );

//--------getuser function gets user's id from db and creates req.data object------------ 
async function getuser(req,res,next){
    let data={currentBalance:{},movements:[], categories:[]}
    let userId

    await User.findAll({
        where:{email:req.params.email}
    })
    .then(user=>{
        userId=user[0].dataValues.id     
    })
    .catch(err=>{
        res.send("No se encuentra el Usuario")
        return
    })
    req.userId = userId
    req.data = data

    next()
  
}

//--------getCategories fuction get transaction categories from db and add the to req.data object------------ 
async function getCategories(req,res,next){
    
    let categoryList=[]
    await Categories.findAll({})
    .then(category=>{
        category.map(item=>{
            categoryList.push(item.dataValues)
        })
    })
    .catch(err=>{
        res.send("No se encuentran las categorias")
        return
    })
   
    req.data.categories=categoryList
    next()
}

// currentBalance calculates today's account balance substracting to the last balance saved in db
// the expenses register afterwards. ------
async function currentBalance(req,res,next){
    let pastBalance
    let pastBalanceDate
    let today = moment().format("YYYY-MM-DD")
    let expenses
    
    await Transactions.findAll({
        limit:1,
        order:[['date', 'DESC']],
        where:{
            userId:req.userId,
            type:["saldo"]
        }
    })
    .then(transaction=>{
        if (transaction){
            pastBalance = parseFloat(transaction[0].dataValues.amount)
            pastBalanceDate = transaction[0].dataValues.date
        }
    })
    .catch(err=>{
        pastBalance=0
        pastBalanceDate='1970/01/01'
    })

    await Transactions.findAll({
        order:[['date', 'DESC']],
        where:{
            userId:req.userId,
            date:{[Op.between]:[pastBalanceDate,today]},
            type:["egreso"]
        }
    })
    .then(egresos =>{
        expenses=0
        if (egresos){
            egresos.map(item=>{
                if(item.dataValues.date!=pastBalanceDate)
            expenses=expenses+parseFloat(item.dataValues.amount)
          })
        }
    })
    if (pastBalance===0 && expenses===0 ){
        res.json({currentBalance:{balance:0},
        categories:req.data.categories})
    }else{
        req.data.currentBalance.balance  = pastBalance - expenses
        req.data.currentBalance.pastBalanceDate = pastBalanceDate
        next()
    }

}
 // past5balances calculate the balance for each day and then (income - expenses for single date)
 // then calculate account balance for each date.
 async function past5balances(req,res,next){
    let last30Moves=[]
    let dailyMoves=[]
    let dailyBalance=[]
    let currentBalance=req.data.currentBalance.balance
    let i=0
    let j=0 

    await Transactions.findAll({
        limit:30,
        order:[['date', 'DESC']],
        where:{
            userId:req.userId,
            type:["egreso","ingreso"]
        }
    })
    .then(transaction=>{
        transaction.map(item=>{
            last30Moves.push(item.dataValues)
        }) 
    })
    .catch(err=>{
        res.send("No se encuentran los movimientos")
        return
    })

    
    do {
        if(last30Moves[i]){
            let moves={}
            const setMove =()=>{
                if (last30Moves[i].type==="egreso"){
                    moves.amount=parseFloat(last30Moves[i].amount ) 
                }else{
                    moves.amount=parseFloat(last30Moves[i].amount)
                    moves.amount=moves.amount-(moves.amount*2)
                }
            }
            moves.date=last30Moves[i].date
            dailyMoves.push(moves)
            
            setMove()

            i=i+1
            
            if (last30Moves[i]){
                while(dailyMoves[j].date===last30Moves[i].date){
                    if (last30Moves[i].type==="egreso"){
                        dailyMoves[j].amount=parseFloat(dailyMoves[j].amount)+parseFloat(last30Moves[i].amount)
                    }else{
                        dailyMoves[j].amount=parseFloat(dailyMoves[j].amount)-parseFloat(last30Moves[i].amount)
                    }            
                    i=i+1
                }
            }else{
                dailyMoves.push(false)
            }
            dailyMoves[j].amount=dailyMoves[j].amount.toString()
            j=j+1 
        }else{
            dailyMoves.push(false)
        }
             
      } while (dailyMoves.length < 5)

    i=0
    do {
         if(dailyMoves[i]){
            let balance={}
            balance.balance=currentBalance
            balance.date=dailyMoves[i].date
            dailyBalance.push(balance)
            currentBalance=currentBalance+parseFloat(dailyMoves[i].amount)
            i=i+1}else{
                dailyBalance.push(false)
            }
    }
    while(dailyBalance.length<5)
    req.data.dailyBalance=dailyBalance
    console.log(dailyBalance)
    next()
 }

 //getLast10movs retreives last 10 transactions
async function getLast10movs(req,res){
    
    let last=parseInt((req.params.last))
    let movementList=[]

    await Transactions.findAll({
        limit:last,
        order:[['date', 'DESC']],
        where:{
            userId:req.userId,
            type:["egreso","ingreso"]
        }
    })
    .then(transaction=>{
        let movement={}

        transaction.map(transaction=>{
            movement ={}
            movement.id = transaction.dataValues.id
            movement.date=transaction.dataValues.date
            movement.categoryId=transaction.dataValues.categoryId
            movement.amount=transaction.dataValues.amount
            movement.type=transaction.dataValues.type
            movement.concept=transaction.dataValues.concept
            movementList.push(movement)
        })     
    })
    .catch(err=>{
        res.send("No se encuentran los movimientos")
        return
    })
    req.data.movements=movementList
    res.json(req.data)
}

//-----------------------Save New Expenses Transactions---------------------------------------

server.post("/new_egreso/:email",getuser, saveData,ifLastExpenseChecker)

//save date save new expense data into database
async function saveData(req,res,next){
    let{date,type,categoryId,concept,amount} = req.body
    let userId = req.userId

    await Transactions.create({
        userId,
        type,
        categoryId,
        concept,
        amount,
        date
    })
    .then(transaction=>{
                next()
    })
    .catch(err=>{
        res.sendStatus(400)
    })
}
//ifLastExpenseChecker verifies if record saved in cronologically the last one;
// if not, and if there are later balances in the db, the balances are 
//recalculated with the new expense

async function ifLastExpenseChecker(req,res,next){

    let date=req.body.date
    let today = moment().format("YYYY-MM-DD")
    let nextBalances=[]

    await Transactions.findAll({
        order:[['date', 'ASC']],
        where:{
            userId:req.userId,
            date:{[Op.between]:[date,today]},
            type:["saldo"]
        }
    })
    .then(transaction=>{
        transaction.map(item=>{
            nextBalances.push(item.dataValues)
        })

    })
    .catch(err=>{
        res.sendStatus(400)
    })

    if (nextBalances.length===0){
        res.sendStatus(200)
    }else{
        nextBalances.map(saldo=>{
            let newSaldo = ""
            saldo.amount=parseFloat(saldo.amount) - parseFloat(req.body.amount)
            newSaldo=saldo.amount.toString()
           Transactions.findByPk(saldo.id)
           .then(saldo=>{
               saldo.amount=newSaldo
               saldo.save()
           })
           .catch(err=>{
               res.sendStatus(400)
           })
        })
        res.sendStatus(200)
    }
   
}

//-----------------------Save New Income Transactions---------------------------------------
 
server.post("/new_ingreso/:email",getuser, saveData,ifLastIncomeChecker,newBalance)

//ifLastIncomeChecker verifies if income saved is the last record in cronological order, 
//if so later balances are recomputed
async function ifLastIncomeChecker(req,res,next){
    let userId = req.userId
    let date=req.body.date
    let today = moment().format("YYYY-MM-DD")
    let nextBalances=[]
    req.ifPost=false
    

    await Transactions.findAll({
        order:[['date', 'ASC']],
        where:{
            userId:req.userId,
            date:{[Op.between]:[date,today]},
            type:["saldo"]
        }
    })
    .then(transaction=>{
        transaction.map(item=>{
            nextBalances.push(item.dataValues)
        })

    })
    .catch(err=>{
        res.sendStatus(400)
    })

    if (nextBalances.length===0){
        next()
    }else{
        nextBalances.map(saldo=>{
            saldo.amount=parseFloat(saldo.amount) + parseFloat(req.body.amount)
            newSaldo=saldo.amount.toString()
           Transactions.findByPk(saldo.id)
           .then(saldo=>{
               saldo.amount=newSaldo
               saldo.save()
           })
           .catch(err=>{
               res.sendStatus(400)
           })
        })
        req.nextBalances=nextBalances
        req.ifPost=true
        next()

    }
   
}

//new balance recor is saved
async function newBalance(req,res){
    let date = req.body.date    

    let lastYearDate=""
    let userId = req.userId
    let newBalance=0
    let pastBalance=0
    let pastBalanceDate=''

    function pastYear(date){
        let prevYear=parseInt(date.split('-')[0]) -1
        lastYearDate=date.split('-')
        lastYearDate[0]=prevYear.toString()
    }

    if(req.ifPost===false){
        newBalance = parseFloat(req.body.amount) + req.body.balance
    }else{
        pastYear(date)
        await Transactions.findAll({
            limit:1,
            order:[['date', 'DESC']],
            where:{
                userId:req.userId,
                date:{[Op.between]:[lastYearDate,date]},
                type:["saldo"]
            }
        })
        .then(transaction=>{
            if (transaction)
            console.log(transaction[0].dataValues)
            pastBalance = parseFloat(transaction[0].dataValues.amount)
            pastBalanceDate = transaction[0].dataValues.date
        })
        .catch(err=>{
            res.send("No se encuentran movimientos")
            return
        })

        await Transactions.findAll({
            order:[['date', 'DESC']],
            where:{
                date:{[Op.between]:[pastBalanceDate,date]},
                type:["egreso"]
            }
        })
        .then(egresos =>{
            expenses=0
            if (egresos){
                egresos.map(item=>{
                expenses=expenses+parseFloat(item.dataValues.amount)
              })
            }
        })

        newBalance = pastBalance + parseFloat(req.body.amount) - expenses


    }

    await Transactions.create({
        userId:userId,
        type:"saldo",
        categoryId:"15",
        concept:"saldo",
        amount:newBalance,
        date:date
    })
    .then(balance=>{
        if (balance){
            res.sendStatus(200)
        }
    })
    .catch(err=>{
        res.sendStatus(400)
    })
}

//---------------------------------Update transactios---------------------------------------

server.put("/update_transaction/:email",getuser,updateData,updateBalances)

//updateData update data transactions and calculate the difference in the "amount"
// to recalculate later balances
async function updateData(req,res,next){
    let{id,date,type,categoryId,concept,amount} = req.body
    let diff
    await Transactions.findByPk(id)
    .then (transaction=>{
        console.log(transaction.amount)
        console.log(amount)
        console.log(type)
        if (type==="ingreso"){
            console.log("entro al ingreso")
            if (amount==="0"){
            console.log("entra al 0 ")
            diff = parseInt(transaction.amount)-parseInt(transaction.amount)*2 
        }else if(transaction.amount <= amount) {
            diff = parseInt(transaction.amount)-parseInt(amount)
            diff = diff - diff*2
        }else{
            diff = parseInt(transaction.amount)-parseInt(amount)
            diff = diff - diff*2
        }}else{console.log("entro al egreso")
            if (amount==="0"){
                console.log("entra al 0 ")
                diff = parseInt(transaction.amount) - parseInt(transaction.amount)*2
                diff = diff - diff*2
            }else  {
                diff = parseInt(transaction.amount)-parseInt(amount)
            }
        }
        
        console.log(diff)
        transaction.date = date;
        transaction.type = type;
        transaction.categoryId = categoryId;
        transaction.concept = concept;
        transaction.amount = amount;
        transaction.save();
       //   next() 
    })
    .catch(err=>{
        res.sendStatus(400)
    })

    req.diff=diff
    req.date=date
    next()
}

async function updateBalances (req,res,next){

    let date=req.date
    let today = moment().format("YYYY-MM-DD")
    let nextBalances=[]
    console.log("entro al update balances")
    console.log(date)
    await Transactions.findAll({
        order:[['date', 'ASC']],
        where:{
            userId:req.userId,
            date:{[Op.between]:[date,today]},
            type:["saldo"]
        }
    })
    .then(transaction=>{
        transaction.map(item=>{
            nextBalances.push(item.dataValues)
        })

    })
    .catch(err=>{
        res.sendStatus(400)
    })

    if (nextBalances.length===0){
        res.sendStatus(200)
    }else{
        nextBalances.map(saldo=>{
            let newSaldo = ""
            saldo.amount=parseFloat(saldo.amount) + req.diff
            newSaldo=saldo.amount.toString()
            Transactions.findByPk(saldo.id)
            .then(saldo=>{
                saldo.amount=newSaldo
                saldo.save()
            })
            .catch(err=>{
                res.sendStatus(400)
            })
        })
        res.sendStatus(200)
    }
    
}

//---------------------------------delete transactios---------------------------------------

server.delete("/delete_transaction/:email/:id",getuser,deleteData,updateBalances)


//deleteData erases data transactions and calculate the difference in the "amount"
// to recalculate later balances
async function deleteData(req,res,next){
    let id = req.params.id
    let type="egreso"
    let date
    let diff
    await Transactions.findByPk(id)
    .then (transaction=>{
        date=transaction.date
        id=parseInt(id)+1
        if (transaction.type==="ingreso"){
            diff=parseInt(transaction.amount) - parseInt(transaction.amount)*2
            type="ingreso"
        }else{
            diff = parseInt(transaction.amount)
        }
        
        console.log(diff)
        transaction.destroy();
    })
    .catch(err=>{
        res.sendStatus(400)
    })

    if (type==="ingreso"){
        await Transactions.findByPk(id)
        .then(transaction=>{
            transaction.destroy()
        }
        )

    }
    req.diff=diff
    req.date=date
    next()
    
}


module.exports = server;