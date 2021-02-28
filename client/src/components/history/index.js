import React,{useState} from "react";
import {useHistory} from 'react-router-dom';
import Axios from 'axios'
import Grid from "@material-ui/core/Grid";
import {Link} from 'react-router-dom' 
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TimelineIcon from '@material-ui/icons/Timeline';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {Toolbar,TextField,MenuItem} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
//---------------REDUX-----------------------------------------------
import {connect} from 'react-redux';
import {setHistory} from '../../actions/history.js';



//------------------Import Components----------------------------------
import History from './dataCard'

//----------This component reders the drawer toolbat to and perform the search functions 
//          to browse trough  transaction history ----------- 

let moveType=['todas',"ingreso", "egreso"]

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  cards: {
    minHeight: 50,
    minWidth:320,
    width:'100%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems:"center",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(1),
    backgroundColor:"#0077b3",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing(1),
    },
  },
  button: {
    margin: theme.spacing(1),
    width:'100%'
  },

}));

function NewMove(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory()
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [search,setSearch]=useState({})

  const handleInputChange = function(e) {
    setSearch({
      ...search,
      [e.target.name]:e.target.value
    })
    console.log(search)
  }

  const doSearch = function(e){

    Axios.get('http://localhost:3001/history/'+props.user.username+'/'+search.fromDate+'/'+search.toDate+"/"+search.type,{withCredentials:true})
    .then(res=>{
      props.setHistory(res.data)
     
    })
    .catch(err=>{
      alert("Error al buscar los movimientos solicitados")
    })
  
  }
  
  const logOut = async (e) =>{

    history.push("/logout")

  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <Grid container direction="row" alignItems="center" justify='center' >
        <Grid item xs={12} sm={10}>
        <Link to="/home">
              <Button
              size='medium'
              variant="contained"
              color="secondary"
                className={classes.button}
                startIcon={<AccountBalanceWalletIcon />}
              >
                {"Ver Saldo"}
              </Button>
            </Link>
        </Grid>
        <Grid item xs={12} sm={10}>
        <Link to="/newTransaction">
            <Button
              size='medium'
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<AddCircleIcon/>}
            >
              {"Nuevo Movimiento"}
            </Button>
            </Link>
        </Grid>
        <Grid item xs={12} sm={10}>
         <Link to="/history">
            <Button
              size='medium'
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<TimelineIcon/>}
            >
              {"Ver Historial"}   
            </Button>
          </Link>
        </Grid>

      </Grid>
      <Divider />
      <Grid container direction="row" alignItems="center" justify='center' >
        <Grid item  xs={12} sm={10} >
            <TextField
                name="fromDate"
                variant="outlined"
                required
                fullWidth
                id="fromDate"
                label="Desde"
                type="date"
                InputLabelProps={{
                                    shrink: true,
                                  }}
                autoFocus
                onChange={(e) => handleInputChange(e)}
                className={classes.button}
              />
            </Grid>
            <Grid item  xs={12} sm={10} >
            <TextField
                name="toDate"
                variant="outlined"
                required
                fullWidth
                id="toDate"
                label="Hasta"
                type="date"
                InputLabelProps={{
                                    shrink: true,
                                  }}
                autoFocus
                onChange={(e) => handleInputChange(e)}
                className={classes.button}
              />
            </Grid>
            <Grid item  xs={12} sm={10} >
              <TextField
                  id="type"
                  name="type"
                  select
                  label="Tipo de Operacion"
                  variant="outlined"
                  required
                  fullWidth
                  className={classes.button}
                  onChange={(e) => handleInputChange(e)}
                  helperText="Seleccione el tipo de Operación"
                  >
                  {moveType.map(item =>{
                      return <MenuItem value={item}>{item}</MenuItem>
                  })}
              </TextField>
            </Grid>
            <Grid item  xs={12} sm={10}>
              <Button
                size='medium'
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<SearchIcon/>}
                onClick={(e)=>doSearch(e)}
              >
                {"Buscar"}   
              </Button>
            </Grid>
          </Grid>
      <Divider />
      <Grid container direction="row" alignItems="center" justify='center'>
         <Grid item  xs={12} sm={10}>
          <Button
            size='medium'
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<ExitToAppIcon/>}
            onClick={(e)=>logOut(e)}
          >
            {"Salir"}   
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap>
            Personal Cashflow
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container spacing={1} className={classes.cards}>
          <Grid className={classes.cards} item xs={12}  >
            <History />
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

NewMove.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
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
    setHistory: (history)=>dispatch(setHistory(history)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewMove);