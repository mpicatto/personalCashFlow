import React,{useEffect} from "react";
import {useHistory} from 'react-router-dom';
import Axios from 'axios'
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
//---------------REDUX-----------------------------------------------
import {connect} from 'react-redux';
import {cleanHistory} from './../../actions/history';
import {cleanBalance} from './../../actions/balance';
import {cleanMoves} from './../../actions/transactions';
import {cleanUser} from './../../actions/user';

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
    logOut()
    
  },[])
  const history = useHistory()
  const styles = useStyles();

  const logOut = async (e) =>{
  
    props.cleanHistory()
    props.cleanBalance()
    props.cleanMoves()
    props.cleanUser()
    await Axios.get('http://localhost:3001/logout',{withCredentials:true})
    .then( res=>{
      sessionAlert()
    })
    .catch(err=>{
      alert(err);
    })
    
    backToStart()
    
    
  }

  const backToStart =() =>{
    history.push("/")
  }

  const sessionAlert = () =>{
    alert("Sesión cerrada")
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
    cleanHistory:()=>dispatch(cleanHistory()),
    cleanBalance:()=>dispatch(cleanBalance()),
    cleanMoves:()=>dispatch(cleanMoves()),
    cleanUser:()=>dispatch(cleanUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);