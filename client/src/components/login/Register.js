import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import Axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

//----------This component register new users ----------- 

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
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export function Register(props) {
    const history = useHistory()
    const classes = useStyles();
    const [input,setInput]=useState({
        name:'',
        lastName:'',
        email:'',
        password:'',
        confirmPassword: ''
  
    });

    const verifyUser = function(e){
      e.preventDefault();
      let data = {
        name:input.name,
        lastName:input.lastName,
        email:input.email,
        password:input.password,
      }

      Axios.post("http://localhost:3001/users",data)
      .then(res=>{
        console.log(res.data)
        if(res.data==='ok'){
            alert("Usuario creado.")
            history.push("/")
          }else{alert("El Email ya esta en uso: utilize uno alternativo")}  
      })

    }

    const handleInputChange = function(e) {
        setInput({
          ...input,
          [e.target.name]:e.target.value
        })
   
        setErrors(validate({
          ...input,
          [e.target.name]: e.target.value,
        }));
      }

      const [errors, setErrors] = useState({});

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registro de Usuario
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={errors.cuit}
                  name="name"
                  variant="outlined"
                  required
                  helperText={errors.name}
                  fullWidth
                  id="name"
                  label="Nombre"
                  autoFocus
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={errors.lastName}
                  helperText={errors.lastName}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={errors.email}
                  helperText={errors.email}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={errors.password}
                  helperText={errors.password}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type="password"
                  id="password"
                  onChange={(e) => handleInputChange(e)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={(e)=>verifyUser(e)}
            >
              Registrar Usuario
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/" >
                  <span style={{color:'black'}}>
                  Ya tiene una cuenta? Ingresar
                  </span>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
}




    
export function validate(input) {
  let errors = {};
 if(!input.name){
   errors.cuit= 'Por favor introduzca su nombre'
 }
 if(!input.lastName){
  errors.lastname= 'Por favor introduzca su apellido'
}
  if (!input.email) {
    errors.email = 'Por favor introduzca su email';
  } else if (!/\S+@\S+\.\S+/.test(input.email)) {
    errors.email = 'El email es invalido';
  }
if(!input.password){
  errors.password = 'Por favor introduzca su contraseña';
} else if (!/([A-Za-z][A-Za-z0-9]*[0-9][A-Za-z0-9])/.test(input.password)) {
  errors.password = 'La contraseña debe contener una letra mayuscula y al menos dos numeros';

}else if(input.password !== input.confirmPassword){
  errors.password= "Las contraseñas no coinciden"

}
  return errors;
};

export default Register;