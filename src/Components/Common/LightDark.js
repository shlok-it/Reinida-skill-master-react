import React from 'react';
import classNames from 'classnames';
//constants
import { layoutModeTypes } from "../../Components/constants/layout";

const LightDark = ({ layoutMode, onChangeLayoutMode }) => {
    const mode = layoutMode === layoutModeTypes['DARKMODE'] ? layoutModeTypes['LIGHTMODE'] : layoutModeTypes['DARKMODE'];
    return (
        <li className="nav-item dropdown notification_dropdown">
            <a href='/'
                onClick={(e) => { e.preventDefault(); onChangeLayoutMode(mode) }}
                className="nav-link bell dz-theme-mode">
                <i className={classNames({ 'text-white': true, 'fa fa-moon': mode === layoutModeTypes['DARKMODE'], 'mdi mdi-theme-light-dark': mode === layoutModeTypes['LIGHTMODE'] })}></i>
            </a>
        </li>
    );
};

export default LightDark;