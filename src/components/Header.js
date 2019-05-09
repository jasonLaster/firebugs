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

function identityMap(list) {
  const map = {};
  for (const item of list) {
    map[item] = item;
  }
  return map;
}

const priorityMap = identityMap(priorities);

const keywordMap = {
  meta: 'Metas',
  first: 'Good First Bugs',
  'intermittent-failure': 'Intermittents',
};
const keywords = Object.keys(keywordMap);

function FilterButton({ name, filter, updater, list, map }) {
  if (filter) {
    return (
      <button className="selected" onClick={() => updater(null)}>
        <div className="label">{map[filter]}</div>
        <div className="button">×</div>
      </button>
    );
  }

  return (
    <Menu>
      <MenuButton>
        <div className="label">{name}</div>
        <div aria-hidden className="button">
          -
        </div>
      </MenuButton>
      <MenuList>
        {list.map(key => (
          <MenuItem key={key} onSelect={() => updater(key)}>
            {map[key]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

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

    const metaList = sortBy(metas, m => m.Alias || `x${m.BugID}`).map(
      m => m.Alias || m.BugID
    );
    const metasMap = identityMap(metaList);

    return (
      <div className="search-box">
        <div className="filters">
          <FilterButton
            name="Priority"
            updater={setPriority}
            filter={priority}
            list={priorities}
            map={priorityMap}
          />

          <FilterButton
            name="Keyword"
            updater={setKeyword}
            filter={keyword}
            list={keywords}
            map={keywordMap}
          />
          <FilterButton
            name="Metas"
            updater={setMeta}
            filter={meta}
            list={metaList}
            map={metasMap}
          />
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

    if (priority) {
      if (priority == 'None') {
        term = 'un-prioritized';
      } else {
        term = priority;
      }
    }

    if (meta) {
      term += ` ${meta}`;
    }

    if (keyword) {
      term += ` ${keywordMap[keyword]}`;
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

    const metasPage = page === 'metas';

    return (
      <div className={`App-Header ${page}`}>
        <div className="nav">
          <div className="links">
            <a
              className={page === 'bugs' ? 'selected' : ''}
              href="#bugs"
              onClick={() => setPage('bugs')}
            >
              Bugs
            </a>
            <a
              className={page === 'metas' ? 'selected' : ''}
              href="#metas"
              onClick={() => setPage('metas')}
            >
              Metas
            </a>
            <a
              className={page === 'releases' ? 'selected' : ''}
              href="#releases"
              onClick={() => setPage('releases')}
            >
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
