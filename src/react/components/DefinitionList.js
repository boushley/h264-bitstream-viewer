import React from 'react';

const DefinitionList = ({ items }) => {
  return (
    <dl>
      {Object.entries(items).map(([key, value]) => (
        <div key={key} style={{ display: 'flex' }}>
          <dt style={{ fontWeight: 'bold' }}>{key}:</dt>
          <dd style={{ marginLeft: '0.5em' }}>{value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default DefinitionList;
