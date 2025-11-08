import React from 'react';
import h264Helper from '../../helpers/h264Helper';
import DefinitionList from './DefinitionList';

const HeaderInfo = ({ header }) => {
  if (!header) {
    return <div>Select a header to see details.</div>;
  }

  const headerItems = {
    'Type': `${header.type} (${h264Helper.naluTypeDisplayed(header.type)})`,
    'Ref IDC': header.refIdc,
    'Start': header.start,
    'Size': header.size,
  };

  return (
    <div>
      <h3>NAL Unit Header</h3>
      <DefinitionList items={headerItems} />
    </div>
  );
};

export default HeaderInfo;
