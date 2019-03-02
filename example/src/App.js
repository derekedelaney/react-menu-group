import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import './index.css';

import MenuGroup from 'react-menu-group';

const buttons = [
    {
        key: '0',
        text: 'BUTTON 1',
        handleClick: () => {
            alert('clicked button 1');
        },
        buttonProps: {
            variant: 'primary',
        },
    },
    {
        key: '1',
        text: 'BUTTON 2',
        handleClick: () => {
            alert('clicked button 2');
        },
        buttonProps: {
            variant: 'success',
        },
    },
    {
        key: '2',
        text: 'BUTTON 3',
        handleClick: () => {
            alert('clicked button 3');
        },
        buttonProps: {
            variant: 'secondary',
        },
    },
    {
        key: '3',
        text: 'BUTTON 4',
        handleClick: () => {
            alert('clicked button 4');
        },
        buttonProps: {
            variant: 'secondary',
        },
    },
    {
        key: '4',
        text: 'BUTTON 5',
        handleClick: () => {
            alert('clicked button 5');
        },
        buttonProps: {
            variant: 'secondary',
        },
    },
    {
        key: '5',
        text: 'BUTTON 6',
        handleClick: () => {
            alert('clicked button 6');
        },
        buttonProps: {
            variant: 'danger',
        },
    },
    {
        key: '6',
        text: 'BUTTON 7',
        handleClick: () => {
            alert('clicked button 7');
        },
        buttonProps: {
            variant: 'secondary',
        },
    },
    {
        key: '7',
        text: 'BUTTON 8',
        handleClick: () => {
            alert('clicked button 8');
        },
        buttonProps: {
            variant: 'secondary',
        },
    },
];

const overflowComponent = keys => (
    <Dropdown className="button" alignRight>
        <Dropdown.Toggle variant="info" id="dropdown-basic">
            More
        </Dropdown.Toggle>
        <Dropdown.Menu>
            {keys.map((key, i) => (
                <Dropdown.Item key={i} onClick={() => {
                    alert(`clicked ${buttons.find(button => button.key === key).text}`);
                }}>
                    {buttons.find(button => button.key === key).text}
                </Dropdown.Item>
            ))}
        </Dropdown.Menu>
    </Dropdown>
);

export default class App extends Component {
    state = {
        keys: [],
        counter: 0,
        timer: null,
        menuOffset: 0,
    };

    handleOverflowMenuChange = keys => {
        this.setState({ keys });
    };

    render() {
        return (
            <div className="demo">
                <MenuGroup
                    overflowMenu={overflowComponent(this.state.keys)}
                    onOverflowMenuChange={this.handleOverflowMenuChange}
                    menuOffset={105}
                    columnLock={[1, 5]}
                >
                    {({ innerRef }) =>
                        buttons.map(button => (
                            <div
                                id={button.key}
                                key={button.key}
                                ref={innerRef}
                                className="button"
                            >
                                <Button
                                    {...button.buttonProps}
                                    onClick={button.handleClick}
                                >
                                    {button.text}
                                </Button>
                            </div>
                        ))
                    }
                </MenuGroup>
            </div>
        );
    }
}
