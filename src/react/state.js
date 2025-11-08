import React, { createContext, useReducer } from 'react';

export const AppContext = createContext();

export const initialState = {
  isLoading: false,
  isLoaded: false,
  file: null,
  headers: [],
  selectedGlobalIndex: -1,
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 0,
  payload: null,
  selectedHeader: null,
};

export function reducer(state, action) {
  switch (action.type) {
    // Add action types here
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
