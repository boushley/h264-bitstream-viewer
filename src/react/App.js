import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './state';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import HeaderList from './components/HeaderList';
import Pagination from './components/Pagination';
import Tabs, { Tab } from './components/Tabs';
import HeaderInfo from './components/HeaderInfo';
import Payload from './components/Payload';
import { H264BitstreamFile } from '../lib/H264BitstreamFile';
import { H264BitstreamBinding } from '../lib/H264BitstreamBinding';
import './App.css';

function App() {
  const { state, dispatch } = useContext(AppContext);
  const [bitstream, setBitstream] = useState(null);

  useEffect(() => {
    // This is where we will handle the WebAssembly module loading
    // For now, we'll just log a message
    console.log('App component mounted');
  }, []);

  const handleFileSelect = (file) => {
    dispatch({ type: 'FILE_SELECTED', payload: file });

    const bs = new H264BitstreamFile(file);
    setBitstream(bs);

    bs.addEventListener('start', () => {
      dispatch({ type: 'LOADING_START' });
    });

    bs.addEventListener('progress', (progress) => {
      // We can add a progress bar later
    });

    bs.addEventListener('end', () => {
      dispatch({ type: 'LOADING_END', payload: bs.headers });
    });

    bs.load();
  };

  const handlePageChange = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const handleHeaderSelect = async (header, index) => {
    dispatch({ type: 'SELECT_HEADER', payload: { header, index } });
    if (bitstream) {
      const payload = await bitstream.getUnitData(header);
      dispatch({ type: 'SET_PAYLOAD', payload });
    }
  };

  const paginatedHeaders = state.headers.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );

  return (
    <div>
      <Header />
      <Content>
        <FileUpload onFileSelect={handleFileSelect} />
        {state.isLoaded && (
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <HeaderList
                headers={paginatedHeaders}
                onHeaderSelect={handleHeaderSelect}
                selectedIndex={state.selectedGlobalIndex}
              />
              <Pagination
                currentPage={state.currentPage}
                totalPages={state.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
            <div style={{ width: '50%' }}>
              <Tabs>
                <Tab label="NAL">
                  <HeaderInfo header={state.selectedHeader} />
                </Tab>
                <Tab label="Payload">
                  <Payload payload={state.payload} />
                </Tab>
              </Tabs>
            </div>
          </div>
        )}
        <p>Loading status: {state.isLoading ? 'Loading...' : 'Not loading'}</p>
      </Content>
      <Footer />
    </div>
  );
}

export default App;
