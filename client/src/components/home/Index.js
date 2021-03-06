import React from "react";
import {useHistory} from 'react-router-dom';
import Grid from "@material-ui/core/Grid";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom' 
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TimelineIcon from '@material-ui/icons/Timeline';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

//------------------Import Components----------------------------------
import Balance from './currentBalance'
import LastMoves from './lastMoves'

//----------This component renders the drawer tool bar and the component to render the balance and the last movements ----------- 

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

function Home(props) {
  const history = useHistory()
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const logOut = async (e) =>{

    history.push("/logout")

  }
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
{props.balance?
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
        </Grid>:null}
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
            <Balance />
          </Grid>
          <Grid className={classes.cards} item xs={12} >
            {props.balance?<LastMoves />:null}
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

Home.propTypes = {
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
    balance:state.balance.balance
  }		
}

export default connect(mapStateToProps)(Home);