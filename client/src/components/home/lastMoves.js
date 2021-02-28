import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom' 
import {connect} from 'react-redux';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
//----------Card imports------------------------------------------------------
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useContainedCardHeaderStyles } from '@mui-treasury/styles/cardHeader/contained';
import { useSoftRiseShadowStyles } from '@mui-treasury/styles/shadow/softRise';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
//--------------Table Imports--------------------------------------------------
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

//------------------------------Other imports----------------------------------------------------------
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Grid } from '@material-ui/core';

//----------This component renders the last 10 balances ----------- 

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
    width:'100%'
  },
}));


let rows = [];

function createData(fecha,concepto,categoria,monto) {
  return {fecha,concepto,categoria,monto};
}

export function LastMoves(props) {

  useEffect(()=>{
    populate(props)

  },[])


  const classes = useStyles();
  const cardHeaderStyles = useContainedCardHeaderStyles();
  const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
  const cardHeaderShadowStyles = useFadedShadowStyles();
  const [since,setSince]=useState();
  const [untill,setUntill]=useState()



  function populate(props){
    rows =[]
    let categorie=''
    setSince(props.moves[props.moves.length-1].date)
    setUntill(props.moves[0].date)
    props.moves.map(item=>{
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
          item.amount
          ))
        }  
      })
    } 

   
  return (
    <Card className={cx(classes.card, cardShadowStyles.root)}>
      <CardHeader
        className={cardHeaderShadowStyles.root}
        classes={cardHeaderStyles}
        title={'Ultimos 10 Movimientos'}
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
            {rows.map(row => (
              <TableRow key={row.fecha}>
                <TableCell component="th" scope="row">
                  {row.fecha}
                </TableCell>
                <TableCell align="left">{row.concepto}</TableCell>
                <TableCell align="right">{row.categoria}</TableCell>
                <TableCell align="right">${row.monto}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Grid container direction="row" alignItems="center" justify="center" >
          <Grid item justify={"right"} xs={12} sm={3}>
            <Link to="/history">
              <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<AddCircleIcon/>}
                  >
                  Ver Historial 
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = state => {		
  return {		
    user: state.user.user,
    moves:state.moves.moves,
    categories:state.moves.categories
  }		
}

export default connect(mapStateToProps)(LastMoves);