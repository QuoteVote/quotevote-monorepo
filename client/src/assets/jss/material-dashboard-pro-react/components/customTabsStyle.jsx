import React from 'react';

import {
  whiteColor,
  hexToRgb,
} from 'assets/jss/material-dashboard-pro-react'

const customTabsStyle = {
  cardTitle: {
    float: 'left',
    padding: '10px 10px 10px 0px',
    lineHeight: '24px',
  },
  cardTitleRTL: {
    float: 'right',
    padding: '10px 0px 10px 10px !important',
  },
  displayNone: {
    display: 'none !important',
  },
  tabsRoot: {
    minHeight: 'unset !important',
    '& $tabRootButton': {
      fontSize: '0.875rem',
    },
  },
  tabRootButton: {
    minHeight: 'unset !important',
    minWidth: 'unset !important',
    width: 'unset !important',
    height: 'unset !important',
    maxWidth: 'unset !important',
    maxHeight: 'unset !important',
    padding: '10px 15px',
    borderRadius: '3px',
    lineHeight: '24px',
    border: '0 !important',
    color: `${whiteColor} !important`,
    marginLeft: '4px',
    '&:last-child': {
      marginLeft: '0px',
    },
  },
  tabLabelContainer: {
    padding: '0px',
  },
  tabLabel: {
    fontWeight: '500',
    fontSize: '12px',
  },
  tabSelected: {
    backgroundColor: `rgba(${hexToRgb(whiteColor)}, 0.2)`,
    transition: '0.2s background-color 0.1s',
  },
  tabWrapper: {
    display: 'inline-block',
    minHeight: 'unset !important',
    minWidth: 'unset !important',
    width: 'unset !important',
    height: 'unset !important',
    maxWidth: 'unset !important',
    maxHeight: 'unset !important',
    fontSize: '12px',
    lineHeight: '24px',
    fontWeight: '500',
    '& > svg,& > .fab,& > .fas,& > .far,& > .fal,& > .material-icons': {
      verticalAlign: 'middle',
      margin: '-1px 5px 0 0 !important',
    },
  },
}

export default customTabsStyle
