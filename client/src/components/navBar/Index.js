//--------------------Imports-----------------------------//
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 50,
    minWidth:320,
    width:"100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(1),
    backgroundColor:"#000000",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: theme.spacing(1),
    },
  },
  toolbarTitle: {
    letterSpacing: 1.25,
    fontWeight: "bold",
    color:"white"
  },
  menuButtons: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  },
  item: {
    color:"white",  
    padding: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(3),
    },
  },
}));


export default function NavBar() {
    const classes = useStyles();
  
    return (
      <Container>
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="left"
            noWrap
            className={classes.toolbarTitle}
          >
            Personal CashFlow
          </Typography>
        </Toolbar>
      </Container>
    );
  }