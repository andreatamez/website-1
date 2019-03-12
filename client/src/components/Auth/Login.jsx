import React, { Component, Fragment } from "react";
// Router
import { Link, withRouter } from "react-router-dom";
// Material UI Components
import {
  Paper,
  Button,
  FormControl,
  MuiThemeProvider,
  createMuiTheme,
  CssBaseline,
  TextField
} from "@material-ui/core";
import ErrorDialog from "./ErrorDialog";
// Icons
import ArrowBack from "@material-ui/icons/ArrowBack";
//Style
import signinStyle from "./signinStyle";
import { withStyles } from "@material-ui/core/styles";
// Images
import Logo from "../../assets/logo.jpg";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#388e3c"
    }
  }
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
      openDialog: false
    };
  }

  componentDidMount() {
    /* If logged in and user navigates to Login page,
      should redirect them to dashboard
    */
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/store");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      // push user to store when they login
      this.props.history.push("/store");
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  dialogPromptOpen = message => {
    this.setState({
      openDialog: true,
      error: message
    });
  };

  dialogClose = () => {
    this.setState({ openDialog: false });
  };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    console.log(userData);
    /* since we handle the redirect within our component,
      we don't need to pass in this.props.history as a parameter
    */
    this.props.loginUser(userData);
  };

  render() {
    const { classes, context } = this.props;
    const { errors } = this.state;

    return (
      <Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <div className={classes.container}>
            <Paper className={classes.paper}>
              <Link to="/" className={classes.backBtn}>
                <ArrowBack />
              </Link>
              <img src={Logo} alt="Logo" className={classes.heroLogo} />
              <p>
                Don't have an account?{" "}
                <Link to="/Register" className={classes.green}>
                  Register
                </Link>
              </p>
              <form className={classes.form}>
                <MuiThemeProvider theme={theme}>
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      autoFocus
                      autoComplete="email"
                      type="email"
                      name="email"
                      id="email"
                      label="Email"
                      onChange={this.onChange}
                      value={this.state.name}
                      error={errors.name}
                      className={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      autoComplete="current-password"
                      id="password"
                      label="Password"
                      name="password"
                      type="password"
                      onChange={this.onChange}
                      value={this.state.password}
                      error={errors.password}
                      className={classnames("", {
                        invalid: errors.password || errors.passwordincorrect
                      })}
                    />
                  </FormControl>
                  <Button
                    fullWidth
                    className={classes.submit}
                    variant="contained"
                    onClick={context.logIn}
                    type="submit"
                    color="primary"
                  >
                    Sign in
                  </Button>
                </MuiThemeProvider>
              </form>
            </Paper>
            <ErrorDialog
              error={this.state.error}
              openDialog={this.state.openDialog}
              dialogClose={this.dialogClose}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(withStyles(signinStyle)(Login)));
