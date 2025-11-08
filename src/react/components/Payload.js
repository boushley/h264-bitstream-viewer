import React from 'react';
import DefinitionList from './DefinitionList';

const Payload = ({ payload }) => {
  if (!payload) {
    return <div>Select a header to see the payload.</div>;
  }

  console.log('Payload', payload)
  const items = {};
  if (payload.aud) {
    items['primary_pic_type'] = payload.aud.primary_pic_type;
  }

  const processObject = (obj) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, processObject(value));
      } else {
        result[key] = Array.isArray(value) ? JSON.stringify(value) : value;
      }
    }
    return result;
  }

  if (payload.sps) {
    Object.assign(items, processObject(payload.sps));
  }

  if (payload.pps) {
    Object.assign(items, processObject(payload.pps));
  }

  if (payload.sei) {
    const seiMessages = [];
    for (let i = 0; i < payload.sei.size(); i++) {
      const seiMessage = payload.sei.get(i);
      const data = [];
      for (let j = 0; j < seiMessage.data.size(); j++) {
        data.push(seiMessage.data.get(j));
      }
      seiMessages.push({
        payloadType: seiMessage.payloadType,
        payloadSize: seiMessage.payloadSize,
        data: data,
      });
    }
    items['sei'] = JSON.stringify(seiMessages, null, 2);
  }

  if (payload.sh) {
    Object.assign(items, processObject(payload.sh));
  }

  if (Object.keys(items).length === 0) {
    return (
      <div>
        <h3>NAL Unit Payload</h3>
        <div>No payload information for this NAL unit type.</div>
      </div>
    );
  }

  return (
    <div>
      <h3>NAL Unit Payload</h3>
      <DefinitionList items={items} />
    </div>
  );
};

export default Payload;
