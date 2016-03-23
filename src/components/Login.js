import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import RetinaImage from 'react-retina-image';
import Header from './Header';
import validator from 'validator';
import shell from 'shell';
import _ from 'lodash';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {}
    };
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.usernameInput).focus();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errors: nextProps.errors });
  }

  validate() {
    const errors = {};
    if (!validator.isEmail(this.state.username)) {
      errors.username = 'Must be an email address';
    }

    // Your password must be 8 - 16 characters,
    // and include at least one lowercase letter,
    // one uppercase letter, and a number
    if (!validator.matches(this.state.password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/)) {
      errors.password = `Your password must be 8 - 16 characters,
        and include at least one lowercase letter, one uppercase
        letter, and a number`;
    }

    return errors;
  }

  handleChange(event) {
    const state = this.state;
    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  handleBlur() {
    this.setState({ errors: _.omitBy(this.validate(), (val, key) => !this.state[key].length) });
  }

  handleLogin() {
    const errors = this.validate();
    this.setState({ errors });

    if (_.isEmpty(errors)) {
      this.context.router.push('/players');
    }
  }

  handleClickForgotPassword() {
    shell.openExternal('https://signin.ea.com/p/web/resetPassword');
  }

  render() {
    return (
      <div className="setup">
        <Header hideLogin />
        <div className="setup-content">
          <div className="form-section">
            <RetinaImage src={'connect-to-hub.png'} checkIfRetinaImgExists={false} />
            <form className="form-connect">
              <input ref="usernameInput"maxLength="30" name="username" placeholder="Username"
                type="text" onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
              />
              <p className="error-message">{this.state.errors.username}</p>
              <input ref="passwordInput" name="password" placeholder="Password" type="password"
                onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
              />
              <p className="error-message">{this.state.errors.password}</p>
              <a className="link" onClick={this.handleClickForgotPassword}>Forgot your password?</a>
              <p className="error-message">{this.state.errors.detail}</p>
              <div className="submit">
                <button className="btn btn-action" onClick={this.handleLogin.bind(this)} type="submit">Log In</button>
              </div>
            </form>
          </div>
          <div className="desc">
            <div className="content">
              <h1>Connect to EA Sports</h1>
              <p>Automate your transfer market bidding by connecting your Origin account to FIFA Autobuyer.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Login;
