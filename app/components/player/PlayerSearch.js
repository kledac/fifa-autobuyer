import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import classNames from 'classnames';
import _ from 'lodash';
import PlayerCard from './SmallPlayerCard';
import * as PlayerActions from '../../actions/players';

let searchPromise = null;

class PlayerSearch extends Component {
  constructor(props) {
    super(props);
    const { query } = this.props.location || { query: {} };
    this.state = {
      query: '',
      filter: query.filter || 'players',
      loading: false,
      error: false
    };
  }

  componentDidMount() {
    this.searchInput.focus();
  }

  componentWillReceiveProps() {
    this.setState({ loading: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.results === this.props.results
      && nextProps.location === this.props.location
      && nextState.loading === this.state.loading
    ) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    if (searchPromise) {
      searchPromise.cancel();
      searchPromise = null;
    }
  }

  search(query, page = 1) {
    if (searchPromise) {
      searchPromise.cancel();
      searchPromise = null;
    }

    if (query !== '') {
      this.setState({ loading: true });
      searchPromise = Promise.delay(500).then(() => {
        searchPromise = null;
        this.props.search(query, page);
      }).catch(() => {});
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
    const query = this.state.query || '';
    this.search(query, page);
  }

  handleFilter(filter) {
    this.context.router.push({ pathname: '/players', query: { filter } });
    this.setState({ filter });
  }

  render() {
    const filter = this.state.filter;
    const query = this.state.query || '';
    const currentPage = _.get(this.props.results, 'page', 0);
    const totalPages = _.get(this.props.results, 'totalPages', 0);
    let players = _.get(this.props.results, 'items', []);

    let results;
    let paginateResults;
    const previous = [];
    const next = [];
    if (currentPage > 1) {
      let previousPage = currentPage - 7;
      if (previousPage < 1) {
        previousPage = 1;
      }
      previous.push((
        <li key="page-first">
          <a href="" onClick={this.handlePage.bind(this, 1)} aria-label="First">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
      ));
      for (previousPage; previousPage < currentPage; previousPage += 1) {
        previous.push((
          <li key={`page-${previousPage}`}><a href="" onClick={this.handlePage.bind(this, previousPage)}>{previousPage}</a></li>
        ));
      }
    }
    if (currentPage < totalPages) {
      let nextPage = currentPage + 1;
      for (nextPage; nextPage < totalPages; nextPage += 1) {
        next.push((
          <li key={`page-${nextPage}`}><a href="" onClick={this.handlePage.bind(this, nextPage)}>{nextPage}</a></li>
        ));
        if (nextPage > currentPage + 7) {
          break;
        }
      }
      next.push((
        <li key="page-last">
          <a href="" onClick={this.handlePage.bind(this, totalPages)} aria-label="Last">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      ));
    }

    const current = (
      <li className="active">
        <span>{currentPage} <span className="sr-only">(current)</span></span>
      </li>
    );
    paginateResults = (next.length || previous.length) && (query !== '') ? (
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
            <div className="spinner la-ball-clip-rotate la-dark la-lg"><div /></div>
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
    } else if (query.length) {
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

    const searchDisabled = this.state.filter !== 'players';

    return (
      <div className="details">
        <div className="new-container">
          <div className="new-container-header">
            <div className="search">
              <div className="search-bar">
                <input
                  type="search" ref={searchInput => (this.searchInput = searchInput)} className="form-control"
                  placeholder="Search for Players" disabled={searchDisabled} onChange={this.handleChange.bind(this)}
                />
                <div className={magnifierClasses} />
                <div className={loadingClasses}><div /></div>
              </div>
            </div>
            <div className="results-filters">
              <span className="results-filter results-filter-title">FILTER BY</span>
              <span
                className={`results-filter results-all tab ${filter === 'players' ? 'active' : ''}`}
                onClick={this.handleFilter.bind(this, 'players')}
              >Players</span>
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

PlayerSearch.propTypes = {
  search: PropTypes.func.isRequired,
  results: PropTypes.shape({
    page: PropTypes.int,
    totalPages: PropTypes.int,
    items: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  location: PropTypes.shape({})
};

PlayerSearch.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    results: state.players.search,
    location: state.routing.locationBeforeTransitions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSearch);
