import React, { useState } from 'react';

const styles = {
  tabs: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    backgroundColor: '#f2f2f2',
    borderBottom: '1px solid #ddd',
  },
  tab: {
    padding: '8px 16px',
    cursor: 'pointer',
  },
  activeTab: {
    backgroundColor: 'white',
    borderBottom: '1px solid white',
    marginBottom: '-1px',
    borderTop: '1px solid #ddd',
    borderLeft: '1px solid #ddd',
    borderRight: '1px solid #ddd',
  },
  tabContent: {
    padding: '16px',
    border: '1px solid #ddd',
    borderTop: 'none',
  },
};


const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div>
      <ul style={styles.tabs}>
        {children.map((child) => {
          const isActive = child.props.label === activeTab;
          const style = {
            ...styles.tab,
            ...(isActive ? styles.activeTab : {}),
          };
          return (
            <li
              key={child.props.label}
              style={style}
              onClick={(e) => handleClick(e, child.props.label)}
            >
              {child.props.label}
            </li>
          );
        })}
      </ul>
      {children.map((child) => {
        if (child.props.label === activeTab) {
          return <div key={child.props.label} style={styles.tabContent}>{child.props.children}</div>;
        }
        return null;
      })}
    </div>
  );
};

export const Tab = (props) => {
  return <>{props.children}</>;
};

export default Tabs;
