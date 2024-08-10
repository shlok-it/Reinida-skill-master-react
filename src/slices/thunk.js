import {
    changeLayoutAction,
    changeBCSubTitleAction,
    changeLayoutModeAction,
} from './reducer';

/**
 * Changes the layout type
 * @param {*} param0
 */
export const changeLayout = (layout) => async (dispatch) => {
    try {
        if (layout === "twocolumn") {
            document.documentElement.removeAttribute("data-layout-width");
        } else if (layout === "horizontal") {
            document.documentElement.removeAttribute("data-sidebar-size");
        } else if (layout === "semibox") {
        }
        dispatch(changeLayoutAction(layout));
    } catch (error) { }
};


/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeBCSubTitle = (title) => async (dispatch) => {
    try {
        dispatch(changeBCSubTitleAction(title));
    } catch (error) {
        // console.log(error);
    }
};

/**
 * Changes the layout mode
 * @param {*} param0
 */
export const changeLayoutMode = (layoutMode) => async (dispatch) => {
    try {
        changeHTMLAttribute("data-theme-version", layoutMode);
        dispatch(changeLayoutModeAction(layoutMode));
    } catch (error) { }
};
/**
 * Changes the body attribute
 */
const changeHTMLAttribute = (attribute, value) => {
    if (document.documentElement) document.documentElement.setAttribute(attribute, value);
    return true;
}