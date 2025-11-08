import React from 'react';

const Payload = ({ payload }) => {
  if (!payload) {
    return <div>Select a header to see the payload.</div>;
  }

  return (
    <div>
      <h3>NAL Unit Payload</h3>
      <pre>{JSON.stringify(payload, null, 2)}</pre>
    </div>
  );
};

export default Payload;
