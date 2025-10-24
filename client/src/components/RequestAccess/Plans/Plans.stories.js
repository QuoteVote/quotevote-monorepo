import React from 'react'
import { makeStyles } from '@mui/styles'
import styles from '../requestAccessStyles'
import PlansPage from './Plans'

export default {
  component: PlansPage,
  title: 'Request Access',
}

const useStyles = makeStyles(styles)

function Wrapper() {
  const classes = useStyles()
  const [selectedPlan, setSelectedPlan] = React.useState(null)
  return (
    <PlansPage
      classes={classes}
      selectedPlan={selectedPlan}
      onPlanSelect={setSelectedPlan}
    />
  )
}

export const PlansContent = () => <Wrapper />
