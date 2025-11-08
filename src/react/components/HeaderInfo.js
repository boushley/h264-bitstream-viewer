import React from 'react';

const HeaderInfo = ({ header }) => {
  if (!header) {
    return <div>Select a header to see details.</div>;
  }

  return (
    <div>
      <h3>NAL Unit Header</h3>
      <pre>{JSON.stringify(header, null, 2)}</pre>
    </div>
  );
};

export default HeaderInfo;
