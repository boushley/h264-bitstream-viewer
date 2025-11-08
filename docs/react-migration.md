# Vue.js to React.js Migration Plan

This document outlines the strategy for migrating the h264-bitstream-viewer rendering layer from Vue 2 to React. The goal is to perform a gradual migration, keeping both the existing Vue application and the new React application running side-by-side for as long as possible to facilitate comparison and ensure feature parity.

## Guiding Principles

1.  **Gradual Migration:** We will not do a "big bang" rewrite. We will build the React application in parallel with the existing Vue application.
2.  **Focus on Architecture:** The new application should be built using modern React best practices (Hooks, Context for state management). We will not aim for a 1:1 mapping of Vue components to React components, but rather a logical component structure for React.
3.  **Reuse Business Logic:** The core bitstream parsing logic in `src/lib` is framework-agnostic and should be reused directly in the React application.
4.  **Side-by-Side Operation:** We will maintain two separate HTML entry points, allowing us to run and test both applications independently.

---

## The Plan

### Phase 0: Setup and Scaffolding

1.  **Install Dependencies:** Add React and related dependencies to the project.
    ```bash
    npm install react react-dom
    # Or using yarn
    # yarn add react react-dom
    ```

2.  **Configure Webpack:**
    *   Update `webpack.config.js` to process `.jsx` files using `@babel/preset-react`.
    *   Configure `HtmlWebpackPlugin` to generate two entry points:
        *   `vue.html`: For the existing Vue application.
        *   `index.html`: For the new React application.
    *   Create a new webpack entry for the React app (e.g., `react: './src/react/index.js'`).

3.  **Create React Entry Point:**
    *   Create a new directory `src/react`.
    *   Create `src/react/index.js` to render the root React component.
    *   Create a root component `src/react/App.js`.
    *   At the end of this phase, we should have a blank page with a "Hello, React!" message served from `index.html`.

### Phase 1: Replicating Core Functionality

The goal of this phase is to get the basic file loading and processing working in the React app.

1.  **State Management:**
    *   Set up a state management solution within `App.js`. A combination of `useReducer` and `useContext` is recommended to manage application-wide state (file loading status, headers, selected items, pagination, etc.). This will prevent excessive prop-drilling.

2.  **Application Shell:**
    *   Create the basic layout in `App.js` (header, content area, footer), use the screenshots from `docs/screenshot.png` and `docs/app-with-loaded-data.png` to understand the application shell layout.
    *   Keep styling simple and clean.

3.  **File Upload and Processing:**
    *   Implement a file upload component.
    *   On file selection, instantiate the `H264BitstreamFile` and `H264BitstreamBinding` classes from `src/lib`.
    *   Use the event listeners ('start', 'progress', 'end') on the `bitstream` instance to update the application state via the reducer.
    *   Integrate the WebAssembly module loading logic (`Module.onRuntimeInitialized`) inside a `useEffect` hook in `App.js`.

### Phase 2: Building the Main UI Components

This phase focuses on building the interactive UI components that display the bitstream data.

1.  **Header List & Pagination:**
    *   Create a `HeaderList` component that receives the list of headers for the current page from the central state.
    *   Create a `Pagination` component that receives pagination data (`currentPage`, `totalPages`, etc.) and dispatches actions to change the page.
    *   Selecting a header should dispatch an action to update the `selectedGlobalIndex` in the state.

2.  **Data Display:**
    *   Create a `Tabs` component (either a simple custom one or from a lightweight library) to manage the "Payload" and "NAL" views.
    *   Create a `HeaderInfo` component to display the details of the selected NAL unit header.
    *   Create a `Payload` component to display the parsed payload of the selected NAL unit.
    *   These components will read the `selectedHeader` and `payload` from the central state.

3.  **Keyboard Shortcuts:**
    *   Integrate the `makeKeydownListener` logic within a `useEffect` hook in `App.js` to handle up/down arrow navigation, dispatching actions to update the selected header.

### Phase 3: Finalization and Cleanup

Once the React application has achieved full feature parity with the Vue application and is deemed stable, we can proceed with removing the old code.

1.  **Remove Vue Dependencies:**
    *   Uninstall `vue`, `vue-loader`, `vue-template-compiler`, `keen-ui`, etc., from `package.json`.

2.  **Delete Vue Code:**
    *   Remove the `src/components` directory containing the Vue components.
    *   Remove any other Vue-specific files.

3.  **Update Build Configuration:**
    *   Remove the Vue entry point and `vue.html` from `webpack.config.js`.
    *   Remove the Vue-related loader configurations.

4.  **Final Review:**
    *   Perform a final review of the codebase to ensure all legacy code has been removed and the project structure is clean.
