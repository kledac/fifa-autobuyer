import React, { PropTypes, Component } from 'react';
import PlayerCard from './PlayerCard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../actions/players';
import Promise from 'bluebird';
import classNames from 'classnames';

let _searchPromise = null;

class PlayerSearch extends Component {
  static propTypes = {
    saveResults: PropTypes.func,
    search: PropTypes.func,
    results: PropTypes.object
  };

  constructor(props) {
    super(props);
    const results = this.props.results || {};
    this.state = {
      query: '',
      loading: false,
      players: results.items || [],
      currentPage: results.page || 0,
      totalPages: results.totalPages || 0,
      error: false
    };
  }

  componentDidMount() {
    this.refs.searchInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results.items.length) {
      this.setState({
        loading: false,
        players: nextProps.results.items,
        currentPage: nextProps.results.page,
        totalPages: nextProps.results.totalPages
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.results === this.props.results && nextState.loading === this.state.loading) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    if (_searchPromise) {
      _searchPromise.cancel();
    }
  }

  search(query, page = 1) {
    if (_searchPromise) {
      _searchPromise.cancel();
      _searchPromise = null;
    }

    if (query !== '') {
      this.setState({ loading: true });
      _searchPromise = Promise.delay(200).cancellable().then(() => {
        _searchPromise = null;
        this.props.search(query, page);
      }).catch(Promise.CancellationError, () => {});
    }
  }

  handleChange(e) {
    const query = e.target.value;
    if (query === this.state.query) {
      return;
    }
    this.setState({ query });
    this.search(query);
  }

  handlePage(page) {
    const query = this.state.query;
    this.search(query, page);
  }

  render() {
    const filter = 'all';
    let players = this.state.players;

    let results;
    let paginateResults;
    const previous = [];
    const next = [];
    if (this.state.currentPage > 1) {
      let previousPage = this.state.currentPage - 7;
      if (previousPage < 1) {
        previousPage = 1;
      }
      previous.push((
        <li>
          <a href="" onClick={this.handlePage.bind(this, 1)} aria-label="First">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
      ));
      for (previousPage; previousPage < this.state.currentPage; previousPage++) {
        previous.push((
          <li><a href="" onClick={this.handlePage.bind(this, previousPage)}>{previousPage}</a></li>
        ));
      }
    }
    if (this.state.currentPage < this.state.totalPages) {
      let nextPage = this.state.currentPage + 1;
      for (nextPage; nextPage < this.state.totalPages; nextPage++) {
        next.push((
          <li><a href="" onClick={this.handlePage.bind(this, nextPage)}>{nextPage}</a></li>
        ));
        if (nextPage > this.state.currentPage + 7) {
          break;
        }
      }
      next.push((
        <li>
          <a href="" onClick={this.handlePage.bind(this, this.state.totalPages)} aria-label="Last">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      ));
    }

    const current = (
      <li className="active">
        <span>{this.state.currentPage} <span className="sr-only">(current)</span></span>
      </li>
    );
    paginateResults = (next.length || previous.length) && (this.state.query !== '') ? (
      <nav>
        <ul className="pagination">
          {previous}
          {current}
          {next}
        </ul>
      </nav>
    ) : null;

    if (this.state.error) {
      results = (
        <div className="no-results">
          <h2>There was an error searching.  Check your internet connection.</h2>
        </div>
      );
      paginateResults = null;
    } else if (this.state.loading) {
      results = (
        <div className="no-results">
          <div className="loader">
            <h2>Loading Players</h2>
            <div className="spinner la-ball-clip-rotate la-dark la-lg"><div></div></div>
          </div>
        </div>
      );
    } else if (players.length) {
      players = players
        .map(player => <PlayerCard key={player.id} player={player} />);

      let playerResults;
      if (players.length) {
        playerResults = (
          <div>
            <h4>Matched Players</h4>
            <div className="result-grid">
              {players}
            </div>
          </div>
        );
      } else {
        playerResults = null;
        paginateResults = null;
      }

      results = (
        <div className="result-grids">
          {playerResults}
        </div>
      );
    } else {
      if (this.state.query.length) {
        results = (
          <div className="no-results">
            <h2>Cannot find a matching player.</h2>
          </div>
        );
      } else {
        results = (
          <div className="no-results">
            <h2>Search for players above.</h2>
          </div>
        );
      }
    }

    const loadingClasses = classNames({
      hidden: !this.state.loading,
      spinner: true,
      loading: true,
      'la-ball-clip-rotate': true,
      'la-dark': true,
      'la-sm': true
    });

    const magnifierClasses = classNames({
      hidden: this.state.loading,
      icon: true,
      'icon-search': true,
      'search-icon': true
    });

    return (
      <div className="details">
        <div className="new-container">
          <div className="new-container-header">
            <div className="search">
              <div className="search-bar">
                <input type="search" ref="searchInput" className="form-control"
                  placeholder="Search for Players" onChange={this.handleChange.bind(this)}
                />
                <div className={magnifierClasses}></div>
                <div className={loadingClasses}><div></div></div>
              </div>
            </div>
            <div className="results-filters">
              <span className="results-filter results-filter-title">FILTER BY</span>
              <span className={`results-filter results-all tab ${filter === 'all' ? 'active' : ''}`}>All</span>
              <span
                className={`results-filter results-recommended tab ${filter === 'recommended' ? 'active' : ''}`}
              >Recommended</span>
              <span
                className={`results-filter results-userrepos tab ${filter === 'userrepos' ? 'active' : ''}`}
              >My Repos</span>
            </div>
          </div>
          <div className="results">
            {results}
          </div>
          <div className="pagination-center">
            {paginateResults}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    results: state.searchResults
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSearch);
