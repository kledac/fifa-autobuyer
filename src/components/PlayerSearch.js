import _ from 'lodash';
import React, { Component } from 'react';
import Router from 'react-router';
import RetinaImage from 'react-retina-image';
import ImageCard from './ImageCard';
import Promise from 'bluebird';
import classNames from 'classnames';

let _searchPromise = null;

export default class PlayerSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      loading: false,
      repos: [],
      username: '',
      accountLoading: false,
      error: {},
      currentPage: 0,
      totalPage: 0,
      previousPage: 0,
      nextPage: 0
    };
  }

  componentDidMount() {
    this.refs.searchInput.focus();
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
    let previousPage = null;
    let nextPage = null;
    let totalPage = null;
    // If query remains, retain pagination
    if (this.state.query === query) {
      previousPage = (page - 1 < 1) ? 1 : page - 1;
      nextPage = (page + 1 > this.state.totalPage) ? this.state.totalPage : page + 1;
      totalPage = this.state.totalPage;
    }
    this.setState({
      query,
      loading: true,
      currentPage: page,
      previousPage,
      nextPage,
      totalPage
    });

    _searchPromise = Promise.delay(200).cancellable().then(() => {
      _searchPromise = null;
    }).catch(Promise.CancellationError, () => {});
  }

  handleChange(e) {
    const query = e.target.value;
    if (query === this.state.query) {
      return;
    }
    this.search(query);
  }

  handlePage(page) {
    const query = this.state.query;
    this.search(query, page);
  }

  render() {
    const filter = 'all';
    const repos = _.values(this.state.repos)
        .filter(repo => {
          if (repo.is_recommended || repo.is_user_repo) {
            return repo.name.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1 ||
              repo.namespace.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1;
          }
          return true;
        })
        .filter(repo => filter === 'all'
          || (filter === 'recommended' && repo.is_recommended)
          || (filter === 'userrepos' && repo.is_user_repo));

    let results;
    let paginateResults;
    const previous = [];
    const next = [];
    if (this.state.previousPage) {
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
    if (this.state.nextPage) {
      let nextPage = this.state.currentPage + 1;
      for (nextPage; nextPage < this.state.totalPage; nextPage++) {
        next.push((
          <li><a href="" onClick={this.handlePage.bind(this, nextPage)}>{nextPage}</a></li>
        ));
        if (nextPage > this.state.currentPage + 7) {
          break;
        }
      }
      next.push((
        <li>
          <a href="" onClick={this.handlePage.bind(this, this.state.totalPage)} aria-label="Last">
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
          <h2>Search Above.</h2>
        </div>
      );
      paginateResults = null;
    } else if (filter === 'userrepos' && !this.state.username) {
      results = (
        <div className="no-results">
          <h2><Router.Link to="/">Log In</Router.Link> to access your Players.</h2>
          <RetinaImage src="connect-art.png" checkIfRetinaImgExists={false} />
        </div>
      );
      paginateResults = null;
    } else if (this.state.loading) {
      results = (
        <div className="no-results">
          <div className="loader">
            <h2>Loading Images</h2>
            <div className="spinner la-ball-clip-rotate la-dark la-lg"><div></div></div>
          </div>
        </div>
      );
    } else if (repos.length) {
      const recommendedItems = repos.filter(repo => repo.is_recommended)
        .map(image => <ImageCard key={`${image.namespace}/${image.name}`} image={image} />);
      const otherItems = repos.filter(repo => !repo.is_recommended && !repo.is_user_repo)
        .map(image => <ImageCard key={`${image.namespace}/${image.name}`} image={image} />);

      const recommendedResults = recommendedItems.length ? (
        <div>
          <h4>Recommended</h4>
          <div className="result-grid">
            {recommendedItems}
          </div>
        </div>
      ) : null;

      const userRepoItems = repos.filter(repo => repo.is_user_repo)
        .map(image => <ImageCard key={`${image.namespace}/${image.name}`} image={image} />);
      const userRepoResults = userRepoItems.length ? (
        <div>
          <h4>My Repositories</h4>
          <div className="result-grid">
            {userRepoItems}
          </div>
        </div>
      ) : null;

      let otherResults;
      if (otherItems.length) {
        otherResults = (
          <div>
            <h4>Other Repositories</h4>
            <div className="result-grid">
              {otherItems}
            </div>
          </div>
        );
      } else {
        otherResults = null;
        paginateResults = null;
      }

      results = (
        <div className="result-grids">
          {recommendedResults}
          {userRepoResults}
          {otherResults}
        </div>
      );
    } else {
      if (this.state.query.length) {
        results = (
          <div className="no-results">
            <h2>Cannot find a matching image.</h2>
          </div>
        );
      } else {
        results = (
          <div className="no-results">
            <h2>No Images</h2>
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
                  placeholder="Search for Players" onChange={this.handleChange}
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
