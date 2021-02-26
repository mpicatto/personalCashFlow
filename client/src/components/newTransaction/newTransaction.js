import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import Axios from 'axios'; 
import {connect} from 'react-redux';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
//-----------Card Imports----------------------------------------------------------------------------------
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useContainedCardHeaderStyles } from '@mui-treasury/styles/cardHeader/contained';
import { useSoftRiseShadowStyles } from '@mui-treasury/styles/shadow/softRise';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
//---------------------------Other Imports------------------------------------------
import {TextField,MenuItem,InputAdornment} from '@material-ui/core'
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(({ spacing }) => ({
  card: {
    marginTop: 40,
    borderRadius: spacing(0.5),
    transition: '0.3s',
    width: '90%',
    minHeight: 445,
    overflow: 'initial',
    background: '#ffffff',
  },
  content: {
    textAlign:"center",
    alignItems:"center",
    overflow:"auto"
  },
  button: {
    margin: spacing(1),
    width:"80%"
  },
  grid:{
    padding:'20px',
  },
  formControl: {
    margin: spacing(1),
    maxWidth: "100%",
    minWidth:"100%"
  },
  
}));

let moveType=["ingreso", "egreso"]

export function Balance(props) {
  
  const history = useHistory()
  const classes = useStyles();
  const cardHeaderStyles = useContainedCardHeaderStyles();
  const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
  const cardHeaderShadowStyles = useFadedShadowStyles();
  const [transaction,setTransaction]=useState({balance:props.balance})

  const handleInputChange = function(e) {
    setTransaction({
      ...transaction,
      [e.target.name]:e.target.value
    })
    console.log(transaction)
  }

  const saveOp = function(e){
    if(transaction.type==="egreso"){
    Axios.post('http://localhost:3001/transactions/new_egreso/'+props.user.username,transaction,{withCredentials:true})
    .then(res=>{
      history.push("/loading")
    })
    .catch(err=>{
      alert("Error al crear nueva transacción. Por favor vuelva a intentar")
    })
    return}
    else{
      Axios.post('http://localhost:3001/transactions/new_ingreso/'+props.user.username,transaction,{withCredentials:true})
      .then(res=>{
        history.push("/loading")
      })
      .catch(err=>{
        alert("Error al crear nueva transacción. Por favor vuelva a intentar")
      })
    }

  }

  const cancelOp = function(e){
    history.push("/home")
  }


  return (

  <Card className={cx(classes.card, cardShadowStyles.root)}>
      <CardHeader
        className={cardHeaderShadowStyles.root}
        classes={cardHeaderStyles}
        title={'Nuevo Movimiento'}
        subheader={moment().format("DD-MM-YYYY")}
      />
      <CardContent className={classes.content}>
        <Grid container direction="row" justify="space-evenly" className={classes.grid}>
          <Grid item  xs={12} sm={3} >
           <TextField
              name="date"
              variant="outlined"
              required
              fullWidth
              id="date"
              label="Fecha "
              type="date"
              InputLabelProps={{
                                  shrink: true,
                                }}
              autoFocus
              onChange={(e) => handleInputChange(e)}
              helperText="Selecione Fecha de la Operación"
            />
          </Grid>
          <Grid item  xs={12} sm={3} >
            <TextField
                id="type"
                name="type"
                select
                label="Tipo de Operacion"
                variant="outlined"
                required
                fullWidth
                onChange={(e) => handleInputChange(e)}
                helperText="Seleccione el tipo de Operación"
                >
                {moveType.map(item =>{
                    return <MenuItem value={item}>{item}</MenuItem>
                })}
            </TextField>
          </Grid>
          <Grid item  xs={12} sm={3} >
            <TextField
                  id="categoryId"
                  name="categoryId"
                  select
                  label="Categoria"
                  variant="outlined"
                  required
                  fullWidth
                  onChange={(e) => handleInputChange(e)}
                  helperText="Seleccione la categoria de la Operación"
                  >
                  {props.categories.map(item =>{
                      return <MenuItem value={item.id}>{item.name}</MenuItem>
                  })}
              </TextField>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-evenly" className={classes.grid}>
          <Grid item  xs={12} sm={6} >
            <TextField
                id="concept"
                name="concept"
                label="Concepto"
                variant="outlined"
                required
                fullWidth
                onChange={(e) => handleInputChange(e)}
                helperText="Ingrese el Concepto de la Operación"
                >
            </TextField>
          </Grid>
          <Grid item  xs={12} sm={3} >
            <TextField
                id="amount"
                name="amount"
                label="monto"
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
                fullWidth
                onChange={(e) => handleInputChange(e)}
                helperText="Ingrese el Monto de la Operación"
                >
              </TextField>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center" className={classes.grid}>
          <Grid item  xs={12} sm={3} >
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<CheckBoxIcon/>}
                onClick={(e)=>saveOp(e)}

              >
                Aceptar       
            </Button>
          </Grid>
          <Grid item  xs={12} sm={3} >
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<CancelIcon/>}
                onClick={(e)=>cancelOp(e)}
              >
                Cancelar
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

  );
};

const mapStateToProps = state => {		
  return {		
    user: state.user.user,
    balance:state.balance.balance,
    categories:state.moves.categories,
  }		
}

export default connect(mapStateToProps)(Balance);
