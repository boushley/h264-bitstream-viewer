import React, { createContext, useReducer } from 'react';

export const AppContext = createContext();

export const initialState = {
  isLoading: false,
  isLoaded: false,
  file: null,
  headers: [],
  selectedGlobalIndex: -1,
  currentPage: 1,
  itemsPerPage: 50,
  totalPages: 0,
  payload: null,
  selectedHeader: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'FILE_SELECTED':
      return {
        ...state,
        file: action.payload,
      };
    case 'LOADING_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOADING_END':
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        headers: action.payload,
        totalPages: Math.ceil(action.payload.length / state.itemsPerPage),
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'SELECT_HEADER':
      return {
        ...state,
        selectedGlobalIndex: action.payload.index,
        selectedHeader: action.payload.header,
        payload: null, // Clear previous payload
      };
    case 'SET_PAYLOAD':
      return {
        ...state,
        payload: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
