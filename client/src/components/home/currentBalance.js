import React from 'react';
import {Link} from 'react-router-dom' 
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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chart from './balanceChart'

//----------This component displays the current balance and the Chart component ----------- 

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
    textAlign:"center",
    alignItems:"center",
    overflowX:"auto",
    '& table': {
      marginBottom: 0,
    }
  },
  button: {
    margin: spacing(1),
    width:'100%'
  },
  
}));

export function Balance(props) {


  const classes = useStyles();
  const cardHeaderStyles = useContainedCardHeaderStyles();
  const cardShadowStyles = useSoftRiseShadowStyles({ inactive: true });
  const cardHeaderShadowStyles = useFadedShadowStyles();

  console.log(props.chartData)

  return (

  <Card className={cx(classes.card, cardShadowStyles.root)}>
      <CardHeader
        className={cardHeaderShadowStyles.root}
        classes={cardHeaderStyles}
        title={'Saldo'}
        subheader={moment().format("DD-MM-YYYY")}
      />
      <CardContent className={classes.content}>
        <Grid container direction="row" alignItems="center" justify="space-around"  >
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" component="h2">
                $ {props.balance}
            </Typography>
          </Grid>
          {!props.chartData.includes(undefined)?
          <Grid item xs={12} sm={9}>
            <Chart data={props.chartData} labels={props.chartLabels}/>
          </Grid>:null}

        </Grid>
        <Grid container direction="row" alignItems="center" justify="center" >
          <Grid item xs={12} sm={3}>
            <Link to="/newTransaction">
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<AddCircleIcon/>}
              >
                Nuevo Movimiento
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
    balance:state.balance.balance,
    chartData:state.balance.chartData,
    chartLabels:state.balance.chartLabels
  }		
}



export default connect(mapStateToProps)(Balance);
