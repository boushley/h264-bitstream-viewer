import React from 'react';

const HeaderList = ({ headers, onHeaderSelect, selectedIndex }) => {
  return (
    <ul>
      {headers.map((header, index) => (
        <li
          key={index}
          onClick={() => onHeaderSelect(header, index)}
          style={{
            cursor: 'pointer',
            backgroundColor: selectedIndex === index ? '#eee' : 'transparent',
          }}
        >
          {header.nal_unit_type_string}
        </li>
      ))}
    </ul>
  );
};

export default HeaderList;
