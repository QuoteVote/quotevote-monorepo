import React from 'react'

import { title } from 'assets/jss/material-dashboard-pro-react'

const errorPageStyles = (theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  inner: {
    width: '100%',
    maxWidth: 600,
  },
  title: {
    ...title,
    margin: 0,
    fontSize: '10rem',
    fontWeight: 700,
    letterSpacing: '4px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '6rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '4rem',
    },
  },
  subTitle: {
    fontSize: '2rem',
    margin: 0,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.5rem',
    },
  },
  description: {
    fontSize: '1.25rem',
    margin: 0,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
    },
  },
  button: {
    marginTop: theme.spacing(3),
  },
})

export default errorPageStyles
