import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import {cleanHistory} from './../../actions/history'
import Axios from 'axios'
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {MenuItem,Button,IconButton,TextField,InputAdornment} from '@material-ui/core';

//----------Card imports------------------------------------------------------
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useContainedCardHeaderStyles } from '@mui-treasury/styles/cardHeader/contained';
import { useSoftRiseShadowStyles } from '@mui-treasury/styles/shadow/softRise';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
//-----------------------------Dialog Imports-------------------------------------------------------------------------
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

//--------------Table Imports--------------------------------------------------
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';

//------------------------------Other imports----------------------------------------------------------
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CancelIcon from '@material-ui/icons/Cancel';


const useStyles = makeStyles(({ spacing }) => ({
  card: {
    marginTop: 40,
    borderRadius: spacing(0.5),
    transition: '0.3s',
    width: '90%',
    overflow: 'initial',
    background: '#ffffff',
  },
  content: {
    paddingTop: 0,
    textAlign: 'center',
    overflowX: 'auto',
    '& table': {
      marginBottom: 0,
    }
  },
  button: {
    margin: spacing(1),
    width:"80%"
  },
}));

let historicMoves=[]
let rows = [];
let moveType=["ingreso", "egreso"]
let move = {id:"",date:"",categoryId:"",amount:"",type:"",concept:""}


const columns = [
  {id: 'fecha', label: 'Fecha', minWidth: 50 },
  {id: 'concepto', label: 'Concepto', minWidth: 100 },
  {id: 'categoria', label: 'Categoria', minWidth: 50,align: 'right'},
  {id: 'monto',label: 'Monto',minWidth: 100,align: 'right'},
  {id: 'editar',label: 'Editar',minWidth: 50,align: 'right'}
]

function createData(fecha,concepto,categoria,monto,editar) {
  return {fecha,concepto,categoria,monto,editar};
}

export function HistoryTable(props) {

  useEffect(()=>{
    populate(props)
  },[])

  const history = useHistory()

  const classes = useStyles();
  const cardHeaderStyles = useContainedCardHeaderStyles();
  const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
  const cardHeaderShadowStyles = useFadedShadowStyles();
  const [since,setSince]=useState();
  const [untill,setUntill]=useState()
  const [open, setOpen] = React.useState(false);
  const [transaction,setTransaction]=useState({date:"",categoryId:"",amount:"",type:"",concept:""})



  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (index) => {
    
    move = {
      id:historicMoves[index].id,
      date:historicMoves[index].date,
      categoryId:historicMoves[index].categoryId,
      amount:historicMoves[index].amount,
      type:historicMoves[index].type,
      concept:historicMoves[index].concept}

      props.categories.map(cat=>{
        if (cat.id==move.categoryId){
          move.categoryName=cat.name
        }
      })
      setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = function(e) {
    setTransaction({
      ...transaction,
      [e.target.name]:e.target.value
    })
    console.log(transaction)
  }

  const saveOp = function(e){

    let data={}
    data.id=move.id
    data.date=transaction.date
    data.categoryId=transaction.categoryId
    data.amount=transaction.amount
    data.type=transaction.type
    data.concept=transaction.concept

  if(transaction.date===""){
    data.date=move.date
  }
  if(transaction.categoryId===""){
    data.categoryId=move.categoryId
  }
  if(transaction.type===""){
    data.type=move.type
  }
  if(transaction.amount===""){
    data.amount=move.amount
  }
  if(transaction.concept===""){
    data.concept=move.concept
  }

    Axios.put('http://localhost:3001/transactions/update_transaction/'+props.user.username,data,{withCredentials:true})
    .then(res=>{
      props.cleanHistory()
      history.push("/loading")
    })
    .catch(err=>{
      alert("Error al actualizar transacción. Por favor vuelva a intentar")
    })
 
  }

  function populate(props){
    rows =[]
    historicMoves = []
    let categorie=''

    if(props.history.length > 0){
      historicMoves = props.history
    }else{
      historicMoves = props.moves
    }

    setSince(historicMoves[historicMoves.length-1].date)
    setUntill(historicMoves[0].date)
    historicMoves.map(item=>{
      if(rows.includes(item)===false){
        props.categories.map(cat=>{
          if (cat.id==item.categoryId){
            categorie=cat.name
          }
        })
        rows.unshift(
          createData(
          item.date,
          item.concept,
          categorie,
          "$ "+ item.amount,
          <IconButton variant="outlined" onClick={()=>handleClickOpen(historicMoves.indexOf(item))} >
            <EditIcon color="black" />
          </IconButton>
          ))
        }  
      })
    } 

   
  return (
    
    <Card className={cx(classes.card, cardShadowStyles.root)}>
      <CardHeader
        className={cardHeaderShadowStyles.root}
        classes={cardHeaderStyles}
        title={'Historial de Movimientos'}
        subheader={'Desde: '+since+' Hasta: '+untill}
      />
      <CardContent className={classes.content}>
      <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell align="left">Concepto</TableCell>
              <TableCell align="right">Categoria</TableCell>
              <TableCell align="right">Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <Dialog 
          open={open} 
          onClose={handleClose} 
          aria-labelledby="form-dialog-title"
          maxWidth='md'
          fullWidth
            >
            <DialogTitle id="form-dialog-title" style={{backgroundColor:'#bdbdbd'}} >Editar Movimiento</DialogTitle>
            <DialogContent style={{backgroundColor:'#bdbdbd'}}>
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
              placeholder={move.date}
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
                placeholder={move.type}
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
                  placeholder={move.categoryId}
                  onChange={(e) => handleInputChange(e)}
                  helperText="Seleccione la categoria de la Operación"
                  >
                  <MenuItem value={move.categoryId}>{move.categoryName}</MenuItem>
                  {props.categories.map(item =>{
                    if(item.name !== move.categoryName){
                      return <MenuItem value={item.id}>{item.name}</MenuItem>}
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
                placeholder={move.concept}
                onChange={(e) => handleInputChange(e)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">-</InputAdornment>,
                }}
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
                placeholder={move.amount}
                onChange={(e) => handleInputChange(e)}
                helperText="Ingrese el Monto de la Operación"
                >
              </TextField>
          </Grid>
        </Grid>
        </DialogContent>
        <DialogActions style={{backgroundColor:'#bdbdbd'}} >
        <Grid container direction="row" justify="center"  className={classes.grid}>
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
                onClick={()=>handleClose()}
              >
                Cancelar
            </Button>
          </Grid>
        </Grid>
        </DialogActions>
      </Dialog>  
      </CardContent>
    </Card>
  );
};

const mapStateToProps = state => {		
  return {		
    user: state.user.user,
    moves:state.moves.moves,
    categories:state.moves.categories,
    history:state.history.history
  }		
}

const mapDispatchToProps = dispatch => {
  return {
    cleanHistory: ()=>dispatch(cleanHistory()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(HistoryTable);