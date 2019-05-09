import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { debounce, sortBy } from 'lodash';

import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink,
} from '@reach/menu-button';

import './Header.css';

const priorities = ['P1', 'P2', 'P3', 'P4', 'P5', 'None'];

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onSearch = debounce(this.onSearch.bind(this));
  }

  onSearch(search) {
    this.props.setSearch(search);
  }

  searchBox() {
    const {
      setPriority,
      setKeyword,
      setSearch,
      setPage,
      setMeta,
      filters: { keyword, priority, page, meta },
      bugs: { metas },
    } = this.props;
    return (
      <div className="search-box">
        <div className="filters">
          {priority !== 'All' ? (
            <button className="selected" onClick={() => setPriority('All')}>
              <div className="label">{priority}</div>
              <div className="button">×</div>
            </button>
          ) : (
            <Menu>
              <MenuButton>
                <div className="label">Priority</div>
                <div aria-hidden className="button">
                  ▾
                </div>
              </MenuButton>
              <MenuList>
                {priorities.map(P => (
                  <MenuItem key={P} onSelect={() => setPriority(P)}>
                    {P}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}

          {keyword ? (
            <button className="selected" onClick={() => setKeyword(null)}>
              <div className="label">{keyword}</div>{' '}
              <div className="button">×</div>
            </button>
          ) : (
            <Menu>
              <MenuButton>
                <div className="label">Keyword</div>
                <div aria-hidden className="button">
                  ▾
                </div>
              </MenuButton>
              <MenuList>
                <MenuItem onSelect={() => setKeyword('meta')}>Metas</MenuItem>
                <MenuItem onSelect={() => setKeyword('first')}>
                  Good First Bugs
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {meta ? (
            <button className="selected" onClick={() => setMeta(null)}>
              <div className="label">{meta}</div>{' '}
              <div className="button">×</div>
            </button>
          ) : (
            <Menu>
              <MenuButton>
                <div className="label">Meta</div>
                <div aria-hidden className="button">
                  ▾
                </div>
              </MenuButton>
              <MenuList>
                {sortBy(metas, m => m.Alias || `x${m.BugID}`).map(m => (
                  <MenuItem
                    key={m.BugID}
                    onSelect={() => setMeta(m.Alias || m.BugID)}
                  >
                    {m.Alias || m.BugID}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
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
      filters: { page, keyword },
      bugs: { metas, bugs },
      filteredBugs,
    } = this.props;

    const metasPage = page == 'metas';

    return (
      <div className={`App-Header ${page}`}>
        <div className="nav">
          <div className="links">
            <a
              className={page === 'bugs' ? 'selected' : ''}
              href="#"
              onClick={() => setPage('bugs')}
            >
              Bugs
            </a>
            <a
              className={page === 'metas' ? 'selected' : ''}
              href="#"
              onClick={() => setPage('metas')}
            >
              Meta
            </a>
            <a href="#" onClick={() => setPage('metas')}>
              Release
            </a>
          </div>
          <h1>{this.getTitle()}</h1>
          {this.searchBox()}
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
