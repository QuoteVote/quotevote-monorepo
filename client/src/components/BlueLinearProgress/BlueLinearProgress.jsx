import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  progressContainer: {
    position: 'fixed',
    top: theme.spacing(10), // Position right under AppBar
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar - 1, // Just below AppBar
    backgroundColor: 'transparent',
  },
}));

const BlueLinearProgress = withStyles((theme) => ({
  root: {
    height: 3,
    backgroundColor: '#e3f2fd',
  },
  bar: {
    backgroundColor: '#2196f3',  // Nice blue color
  },
}))(LinearProgress);

// Wrapper component that includes the container styles
const BlueLinearProgressWithContainer = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.progressContainer}>
      <BlueLinearProgress />
    </div>
  );
};

export default BlueLinearProgressWithContainer;
export { BlueLinearProgress }; // Export the base component for cases where you don't need the container 