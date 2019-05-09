import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { debounce } from 'lodash';

import './Header.css';

const priorities = ['All', 'P1', 'P2', 'P3', 'P4', 'P5', 'None'];

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onSearch = debounce(this.onSearch.bind(this));
  }

  onSearch(search) {
    this.props.setSearch(search);
  }

  searchBox() {
    const { setPriority, setKeyword, setSearch, setPage } = this.props;
    return (
      <div className="search-box">
        <div className="priorities">
          Filter &nbsp;
          {priorities.map(P => (
            <a href="#" key={P} onClick={() => setPriority(P)}>
              {P}
            </a>
          ))}
          <div>
            Keywords &nbsp;
            <a href="#" onClick={() => setKeyword(null)}>
              All
            </a>
            <a href="#" onClick={() => setKeyword('meta')}>
              Metas
            </a>
            <a href="#" onClick={() => setKeyword('first')}>
              Good First Bugs
            </a>
          </div>
          <div className="search-field">
            <input
              type="text"
              ref={this.searchInput}
              placeholder="Search..."
              onChange={e => this.onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  getTitle() {
    const {
      setPage,
      filters: { page, priority, keyword, meta },
      bugs: { metas, bugs },
      filteredBugs,
    } = this.props;

    const metasPage = page == 'metas';

    if (metasPage) {
      return `${metas.length} Metas`;
    }

    let term = '';

    if (priority !== 'All') {
      if (priority == 'None') {
        term = 'un-prioritized';
      } else {
        term = priority;
      }
    }

    if (meta) {
      term += ` ${meta}`;
    }

    if (keyword == 'meta') {
      term += ' Metas';
    } else if (keyword == 'first') {
      term += ' First Bugs';
    } else {
      term += ' Bugs';
    }

    return `${filteredBugs.length} ${term}`;
  }

  render() {
    const {
      setPage,
      filters: { page },
      bugs: { metas, bugs },
      filteredBugs,
    } = this.props;

    const metasPage = page == 'metas';

    return (
      <div className={`App-Header ${page}`}>
        <div className="nav">
          <div className="links">
            <a href="#" onClick={() => setPage('bugs')}>
              Bugs
            </a>
            <a href="#" onClick={() => setPage('metas')}>
              Meta
            </a>
            <a href="#" onClick={() => setPage('metas')}>
              Release
            </a>
          </div>
          <h1>{this.getTitle()}</h1>
          {metasPage ? null : this.searchBox()}
        </div>
        <div className="gap" />
      </div>
    );
  }
}

export default connect(
  state => state,
  actions
)(Header);
