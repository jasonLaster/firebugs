import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { debounce, sortBy } from 'lodash';
import { fetchComponents } from '../utils';

import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink,
} from '@reach/menu-button';

import AsyncSelect from 'react-select/async';

import './Header.css';

const priorities = ['P1', 'P2', 'P3', 'P4', 'P5', 'None'];
const types = ['defect', 'enhancement', 'task'];
const changedList = ['today', 'week', 'month', 'stale'];
const changedMap = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  stale: '6+ Months',
};

const sortByList = ['changed'];
const sortByMap = {
  changed: 'Updated',
};

const whiteboardList = ['needs-review', '[debugger-mvp]', '[debugger-reserve]'];
const whiteboardMap = identityMap(whiteboardList);

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

const typeMap = {
  defect: 'Bug',
  enhancement: 'Enhancement',
  task: 'Task',
};
const keywords = Object.keys(keywordMap);

function FilterButton({ name, filter, updater, list, map, getCount }) {
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
        {list
          .map(key => {
            const count = getCount(key);

            if (count === 0) {
              return null;
            }

            return (
              <MenuItem key={key} onSelect={() => updater(key)}>
                <div className="menu-item-label"> {map[key]}</div>
                {count ? <div className="menu-item-count">{count}</div> : null}
              </MenuItem>
            );
          })
          .filter(Boolean)}
      </MenuList>
    </Menu>
  );
}

const componentSelectStyles = {
  control: styles => ({
    ...styles,
    height: '30px',
    minHeight: '30px',
    borderStyle: 'none',
  }),
  indicatorsContainer: () => ({ display: 'none' }),
  placeholder: (styles, { isFocused }) => {
    return isFocused
      ? { ...styles }
      : {
          ...styles,
          right: 0,
          marginRight: '10px',
          color: 'var(--primary-7)',
        };
  },
  option: styles => ({
    ...styles,
    color: 'var(--neutral-6)',
  }),
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentValue: props.filters.component.replace(/%20/g, ' '),
    };
    this.onSearch = debounce(this.onSearch.bind(this));
    this.onSelectClick = this.onSelectClick.bind(this);
    this.onSelectBlur = this.onSelectBlur.bind(this);
  }

  onSearch(search) {
    this.props.setSearch(search);
  }

  async onComponentSelection(product, component) {
    this.setState({ componentValue: { value: component, label: component } });
    this.props.setFilter({ product, component });
    await this.props.fetchBugs();
    document.activeElement.blur();
  }

  onSelectClick() {
    this.setState({
      componentValue: 'Search product/component',
    });
  }

  onSelectBlur() {
    let { component } = this.props.filters;
    component = component.replace(/%20/g, ' ');
    this.setState({ componentValue: component });
  }

  searchBox() {
    const {
      setPriority,
      setKeyword,
      setSearch,
      setPage,
      setMeta,
      setType,
      setWhiteboard,
      setSortBy,
      setChanged,
      filters: {
        keyword,
        priority,
        page,
        meta,
        type,
        changed,
        whiteboard,
        search,
        sortBy: sortByFilter,
      },
      bugs: { metas },
      filteredBugs,
    } = this.props;

    const metaList = [
      'none',
      ...sortBy(metas, m => m.Alias || `x${m.BugID}`).map(
        m => m.Alias || m.BugID
      ),
    ];

    const metasMap = identityMap(metaList);
    metasMap.none = 'None';

    return (
      <div className="search-box">
        <div className="filters">
          <FilterButton
            name="Type"
            updater={setType}
            filter={type}
            list={types}
            map={typeMap}
            getCount={key => filteredBugs.filter(b => b.Type == key).length}
          />

          <FilterButton
            name="Priority"
            updater={setPriority}
            filter={priority}
            list={priorities}
            map={priorityMap}
            getCount={key =>
              filteredBugs.filter(
                b => b.Priority == (key == 'None' ? ' --' : key)
              ).length
            }
          />

          <FilterButton
            name="Keyword"
            updater={setKeyword}
            filter={keyword}
            list={keywords}
            map={keywordMap}
            getCount={key =>
              filteredBugs.filter(b => b.Keywords.includes(key)).length
            }
          />
          <FilterButton
            name="Metas"
            updater={setMeta}
            filter={meta}
            list={metaList}
            map={metasMap}
            getCount={key =>
              filteredBugs.filter(b =>
                key == 'none'
                  ? b.Metas.length == 0
                  : b.Metas.find(m => m.name == key)
              ).length
            }
          />

          <FilterButton
            name="Whiteboard"
            updater={setWhiteboard}
            filter={whiteboard}
            list={whiteboardList}
            map={whiteboardMap}
            getCount={key =>
              filteredBugs.filter(b => b.Whiteboard.includes(key)).length
            }
          />

          <FilterButton
            name="Changed"
            updater={setChanged}
            filter={changed}
            list={changedList}
            map={changedMap}
            getCount={() => {}}
          />

          <FilterButton
            name="Sort By"
            updater={setSortBy}
            filter={sortByFilter}
            list={sortByList}
            map={sortByMap}
            getCount={() => {}}
          />
        </div>
        <div className="search-field">
          <input
            type="text"
            ref={this.searchInput}
            placeholder="Search..."
            onChange={e => this.onSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>
    );
  }

  getTitle() {
    const {
      setPage,
      filters: { page, priority, keyword, meta, changed },
      bugs: { metas, bugs },
      filteredBugs,
    } = this.props;

    const metasPage = page == 'metas';

    if (metasPage) {
      return <h1>{`${metas.length} Metas`}</h1>;
    }

    let term = '';

    if (meta) {
      if (meta == 'none') {
        term += ' unlabeled';
      } else {
        term += ` ${meta}`;
      }
    }

    if (priority) {
      if (priority == 'None') {
        term += ' un-prioritized';
      } else {
        term += ` ${priority}`;
      }
    }

    if (keyword) {
      term += ` ${keywordMap[keyword]}`;
    } else {
      term += ' bugs';
    }

    const text = `${filteredBugs.length} ${term}`;
    const viewingMeta = meta && !(keyword && priority);

    if (viewingMeta) {
      return (
        <h1>
          <a
            target="_blank"
            href={`https://bugzilla.mozilla.org/show_bug.cgi?id=${meta}`}
          >
            {text}
          </a>
        </h1>
      );
    }

    return <h1>{text}</h1>;
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
              onClick={() => setPage('bugs')}
            >
              Bugs
            </a>

            <a
              className={page === 'intermittents' ? 'selected' : ''}
              onClick={() => setPage('intermittents')}
            >
              Intermittents
            </a>
            <div
              className="select-component"
              onMouseDown={this.onSelectClick}
              onBlur={this.onSelectBlur}
            >
              <AsyncSelect
                styles={componentSelectStyles}
                cacheOptions
                loadOptions={fetchComponents}
                onChange={value =>
                  this.onComponentSelection(value.product, value.label)
                }
                noOptionsMessage={value =>
                  value.inputValue.length > 2 ? 'No components found' : null
                }
                value={this.state.componentValue}
                placeholder={this.state.componentValue}
                closeMenuOnSelect={true}
              />
            </div>
          </div>
          {this.getTitle()}
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
