import 'babel-polyfill';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import RetinaImage from 'react-retina-image';
import Header from './Header';
import { getApi } from '../utils/ApiUtil';
import validator from 'validator';
import shell from 'shell';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountActions from '../actions/account';

class Account extends Component {
  constructor(props) {
    super(props);
    this.next = undefined;
    this.state = {
      username: props.account.username || '',
      password: props.account.password || '',
      secret: props.account.secret || '',
      platform: props.account.platform || '',
      code: '',
      twoFactor: false,
      loading: false,
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.account.platform) {
      ReactDOM.findDOMNode(this.refs.platformSelect).style.color = '#556473';
    } else {
      ReactDOM.findDOMNode(this.refs.usernameInput).focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errors: nextProps.errors || {} });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.twoFactor !== this.state.twoFactor
      || nextState.loading !== this.state.loading
      || nextState.errors && nextState.errors !== this.state.errors);
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
      errors.password = (<span>Your password must be 8 - 16 characters, and include at least<br />
        one lowercase letter, one uppercase letter, and a number<br /><br /></span>);
    }

    if (validator.isNull(this.state.secret)) {
      errors.secret = 'The answer to your secret question is required.';
    }

    if (validator.isNull(this.state.platform)) {
      errors.platform = 'The platform you play on is required.';
    }

    if (this.state.twoFactor && validator.isNull(this.state.code)) {
      errors.code = 'Code is invalid.  Must be 6 numbers.';
    }

    return errors;
  }

  handleChange(event) {
    const nextState = {};
    nextState[event.target.name] = event.target.value;
    this.setState(nextState);

    // Change color back to dark gray on change
    if (event.target.name === 'platform') {
      const node = event.target;
      node.style.color = '#556473';
    }
  }

  handleBlur() {
    this.setState({ errors: _.omitBy(this.validate(), (val, key) => !this.state[key].length) });
  }

  async handleLogin() {
    if (this.next !== undefined) {
      this.setState({ loading: true });
      this.next(this.state.code);
    } else {
      const errors = this.validate();
      this.setState({ errors });

      if (_.isEmpty(errors)) {
        this.setState({ loading: true });
        const apiClient = getApi(this.state.username);
        await apiClient.loginAsync(
          this.state.username,
          this.state.password,
          this.state.secret,
          this.state.platform,
          (next) => {
            this.setState({ twoFactor: true, loading: false });
            this.next = next;
          }
        );
        this.props.saveAccount(this.state);
        const creditResponse = await apiClient.getCreditsAsync();
        this.setState({ twoFactor: false, loading: false });
        this.props.setCredits(creditResponse.credits);
        this.context.router.push('/players');
      }
    }
  }

  handleSkip() {
    this.context.router.push('/players');
  }

  handleClickForgotPassword() {
    shell.openExternal('https://signin.ea.com/p/web/resetPassword');
  }

  render() {
    const loading = this.state.loading ? <div className="spinner la-ball-clip-rotate la-dark"><div></div></div> : null;
    let skip = '';
    if (process.env.NODE_ENV === 'development') {
      skip = (
        <a className="btn btn-action btn-skip" disabled={this.state.loading} onClick={this.handleSkip.bind(this)}>
          Skip
        </a>
      );
    }
    let fields;
    if (this.state.twoFactor) {
      fields = (
        <div key="two-factor">
          <input ref="codeInput" maxLength="6" name="code" placeholder="Two Factor Code" defaultValue=""
            type="text" onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
          />
          <p className="error-message">{this.state.errors.code || 'A code was sent to your email or smartphone'}</p>
        </div>
      );
    } else {
      fields = (
        <div key="initial-credentials">
          <input ref="usernameInput" maxLength="30" name="username" placeholder="Username"
            defaultValue={this.props.account.username} type="text"
            onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
          />
          <p className="error-message">{this.state.errors.username}</p>
          <input ref="passwordInput" name="password" placeholder="Password"
            defaultValue={this.props.account.password} type="password"
            onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
          />
          <p className="error-message">{this.state.errors.password}</p>
          <a className="link" onClick={this.handleClickForgotPassword}>Forgot your password?</a>
          <input ref="secretInput" name="secret" placeholder="Secret Question Answer"
            defaultValue={this.props.account.secret} type="password"
            onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
          />
          <p className="error-message">{this.state.errors.secret}</p>
          <select ref="platformSelect" name="platform"
            defaultValue={this.props.account.platform} onChange={this.handleChange.bind(this)}
          >
            <option disabled value="">Platform</option>
            <option value="pc">PC</option>
            <option value="xone">Xbox One</option>
            <option value="x360">Xbox 360</option>
            <option value="ps4">Playstation 4</option>
            <option value="ps3">Playstation 3</option>
          </select>
          <p className="error-message">{this.state.errors.platform}</p>
        </div>
      );
    }
    return (
      <div className="setup">
        <Header hideLogin />
        <div className="setup-content">
          {skip}
          <div className="form-section">
            <RetinaImage src={'connect-to-hub.png'} checkIfRetinaImgExists={false} />
            <form className="form-connect">
              {fields}
              <p className="error-message">{this.state.errors.detail}</p>
              <div className="submit">
                {loading}
                <button className="btn btn-action" disabled={this.state.loading}
                  onClick={this.handleLogin.bind(this)} type="submit"
                >Log In</button>
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

Account.propTypes = {
  setCredits: PropTypes.func.isRequired,
  saveAccount: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired
};

Account.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    account: state.account
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
