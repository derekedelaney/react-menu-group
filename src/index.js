import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withContentRect } from 'react-measure';
import cx from 'classnames';

import styles from './styles.css';

class MenuGroup extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onOverflowMenuChange: PropTypes.func,
    overflowMenu: PropTypes.element,
    menuOffset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    measureRef: PropTypes.func.isRequired,
    contentRect: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    columnLock: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  };

  static defaultProps = {
    onOverflowMenuChange: () => {},
    overflowMenu: undefined,
    menuOffset: 0,
    className: '',
    columnLock: null,
  };

  state = {
    overflowMenus: [],
    menus: [],
    lockedMenus: [],
    menuOffset: this.props.menuOffset,
  };

  componentDidMount() {
    this.setUpMenus(this.props.children);
  }

  componentWillReceiveProps(nextProps) {
    const {
      children,
      contentRect: { bounds },
    } = nextProps;
    this.setUpMenus(children);
    this.calculateMenuDisplay(bounds);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.overflowMenus.length !== prevState.overflowMenus.length) {
      const keys = this.state.overflowMenus.map(item => item.id);
      this.props.onOverflowMenuChange(keys);
    }
  }

  setUpMenus = children => {
    const kids = children({ innerRef: this.innerRef }) || [];
    const menus = [];
    kids.forEach((component, index) => {
      const foundMenu = this.state.menus.find(
        menu => menu.id === component.key
      );
      const locked = Array.isArray(this.props.columnLock)
        ? this.props.columnLock.indexOf(index) > -1
        : false;
      if (foundMenu) {
        menus.push({ ...foundMenu, component, locked });
      } else {
        menus.push({ id: component.key, component, locked });
      }
    });
    this.setState({ menus });
  };

  innerRef = ref => {
    if (ref) {
      const calculatedRef = ref.getBoundingClientRect().toJSON();
      const id = ref.getAttribute('id');
      if (id) {
        this.setState(prevState => {
          const menus = prevState.menus.map(menu => {
            if (menu.id === id) {
              menu.dimension = calculatedRef;
            }
            return menu;
          });
          return { menus };
        });
      } else {
        throw new Error("No 'id' found on element with innerRef");
      }
    }
  };

  calculateMenuDisplay = menuContainerDimensions => {
    const { menus, menuOffset } = this.state;
    let menuSum = 0;
    menus.forEach(menu => {
      if (menu.dimension) {
        menuSum += menu.dimension.width;
        const containerWidth = menuContainerDimensions.width - menuOffset;
        if (menuSum > containerWidth) {
          this.setState(prevState => {
            if (
              !menu.locked &&
              !prevState.overflowMenus.find(prevMenu => prevMenu.id === menu.id)
            ) {
              return {
                overflowMenus: [menu, ...prevState.overflowMenus],
              };
            }
            if (
              menu.locked &&
              !prevState.lockedMenus.find(prevMenu => prevMenu.id === menu.id)
            ) {
              return {
                lockedMenus: [menu, ...prevState.lockedMenus],
                menuOffset: prevState.menuOffset + menu.dimension.width,
              };
            }
          });
        } else {
          this.setState(prevState => {
            const moreState = {};
            const array = prevState.overflowMenus.filter(
              item => item.id !== menu.id
            );
            const lockedMenu = prevState.lockedMenus.find(
              item => item.id === menu.id
            );
            if (lockedMenu) {
              moreState.menuOffset =
                prevState.menuOffset - lockedMenu.dimension.width;
              moreState.lockedMenus = prevState.lockedMenus.filter(
                item => item.id !== menu.id
              );
            }
            return { overflowMenus: array, ...moreState };
          });
        }
      } else {
        throw new Error("'id' and 'key' do not match");
      }
    });
  };

  getDisplay = () => {
    const { menus, overflowMenus } = this.state;
    return menus
      .filter(
        menu => !overflowMenus.find(overflowMenu => overflowMenu.id === menu.id)
      )
      .map(menu => menu.component);
  };

  render() {
    const showMore = this.state.overflowMenus.length > 0;
    const { overflowMenu, measureRef, className } = this.props;

    return (
      <div ref={measureRef} className={cx(styles.menuGroupContainer, className)}>
        {this.getDisplay()}
        {showMore && overflowMenu}
      </div>
    );
  }
}

export default withContentRect('bounds')(MenuGroup);
