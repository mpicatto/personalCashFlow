import React,{useEffect} from "react";
import {useHistory} from 'react-router-dom';
import Axios from 'axios'
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {setCategories,setMoves} from '../../actions/transactions';
import {setBalance,setChartData,setChartLabels} from '../../actions/balance';

//------------------Import Components----------------------------------


const useStyles = makeStyles((theme) => ({
    cards: {
      minHeight: 50,
      minWidth:320,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems:"center",
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
      backgroundColor:"#0077b3",
      [theme.breakpoints.up("md")]: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: theme.spacing(9),
      },
    },

  }));

export function Loader(props) {
   useEffect(()=>{
    getBalance(props)
  },[])
  const history = useHistory()
  const styles = useStyles();

    const getBalance = (props)=>{
     Axios.get('http://localhost:3001/transactions/balance/'+props.user.username+'/10',{withCredentials:true})
    .then(res=>{
      console.log(res.data)
      if(res.data.currentBalance.balance===0){
        props.setBalance({balance:res.data.currentBalance.balance})
        props.setCategories(res.data.categories)
        props.setChartData([undefined])
        history.push("/home")
      }else{
        let data =[]
        let labels=[]
        res.data.dailyBalance.map(item=>{
          data.unshift(item.balance)
          labels.unshift(item.date)
        })
        props.setMoves(res.data.movements)
        props.setBalance(res.data.currentBalance)
        props.setCategories(res.data.categories)
        props.setChartData(data)
        props.setChartLabels(labels)
        history.push("/home")
      }
    })
  }

  return (
    <Grid container spacing={3} className={styles.cards}>

    </Grid>
  );
}

const mapStateToProps = state => {		
  return {		
    user: state.user.user,
  }		
}

const mapDispatchToProps = dispatch => {
  return {
    setBalance: (balance)=>dispatch(setBalance(balance)),
    setMoves: (moves)=>dispatch(setMoves(moves)),
    setCategories: (categories)=>dispatch(setCategories(categories)),
    setChartData: (data)=>dispatch(setChartData(data)),
    setChartLabels:(labels)=>dispatch(setChartLabels(labels))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);