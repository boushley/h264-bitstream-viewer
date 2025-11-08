import React from 'react';
import h264Helper from '../../helpers/h264Helper';

const HeaderList = ({ headers, onHeaderSelect, selectedIndex, indexOffset = 0 }) => {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{...styles.th, width: '30px'}}>#</th>
          <th style={{...styles.th}}>Unit type</th>
          <th style={{...styles.th, width: '120px'}}>Reference idc</th>
        </tr>
      </thead>
      <tbody>
        {headers.map((header, index) => {
          const globalIndex = index + indexOffset;
          const isSelected = selectedIndex === globalIndex;
          return (
            <tr
              key={globalIndex}
              onClick={() => onHeaderSelect(header, globalIndex)}
              style={{
                ...styles.tr,
                cursor: 'pointer',
                backgroundColor: isSelected ? '#c5e5ff' : 'transparent',
              }}
            >
              <td style={styles.td}>{globalIndex}</td>
              <td style={styles.td}>
                { header.type} -{" "}
                <strong>{h264Helper.naluTypeDisplayed(header.type)}</strong>
              </td>
              <td style={styles.td}>{header.refIdc}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const styles = {
  th: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
  },
  td: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '1px solid #ddd',
  },
  tr: {
    userSelect: 'none',
  },
};

export default HeaderList;
