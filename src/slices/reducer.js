import { createSlice } from "@reduxjs/toolkit";
//constants


export const initialState = {
  layoutType: 'VERTICAL',
  breadCrumbSubTitle: '',
  layoutModeType: 'light',
};

const LayoutSlice = createSlice({
  name: 'LayoutSlice',
  initialState,
  reducers: {
    changeLayoutAction(state, action) {
      state.layoutType = action.payload;
    },
    changeLayoutModeAction(state, action) {
      state.layoutModeType = action.payload;
    },
    changeBCSubTitleAction(state, action) {
      state.breadCrumbSubTitle = action.payload;
    },
  }
});

export const {
  changeLayoutAction,
  changeBCSubTitleAction,
  changeLayoutModeAction,
} = LayoutSlice.actions;

export default LayoutSlice.reducer;