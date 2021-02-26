import React from 'react';
import {useHistory} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Axios from 'axios';
import {setUser} from '../../actions/user.js';
import {connect} from 'react-redux';
/*


*/

  
  //LOS ESTILOS DEL FORMULARIO SETEADOS
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  

  //LOGIN PRINCIPAL DE LA PAGINA!
  export function Login(props) {
    const history = useHistory()
    const classes = useStyles();
    const [input,setInput]=React.useState({
      username:'',
      password:''
    });

    //MANEJO DE ONCHANGE()
    const handleInputChange = function(e) {
      setInput({
        ...input,
        [e.target.name]:e.target.value
      })
    }

    const loginUser = function(e){
      e.preventDefault();
      Axios.post('http://localhost:3001/login',input,{withCredentials:true})
      .then(res=>{
        let data={
          username:res.data.email,
          name:res.data.name,
          lastName:res.data.lastName
        }
        props.setUser(data)
        history.push("/loading")
      })
      .catch(err=>{
        alert("Usuario o contraseña incorrecta. \nPor favor vuelva a intentar")
      })
    }

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingresar
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email"
              name="username"
              autoFocus
              onChange={(e) => handleInputChange(e)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e)=>handleInputChange(e)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={(e)=>loginUser(e)}
            >
              Ingresar
            </Button>
            <Grid container justify="space-evenly">
              <Grid item xs="12" sm="6" >
                <Link to="/forgotPassword" variant="body2">
                <span style={{color:'black'}}>
                  ¿Olvido la contraseña?
                </span>  
                </Link>
              </Grid>
              <Grid item xs="12" sm="6">
                <Link to = "/register">
                 <span style={{color:'black'}}>
                  ¿No tiene una cuenta? Registrese
                  </span>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>

      </Container>
    );
  }

  const mapStateToProps = state => {		
    return {		
      user: state.user,
    }		
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      setUser: (resp)=>dispatch(setUser(resp)),
    }
  }
      
  export default connect(mapStateToProps, mapDispatchToProps)(Login);  