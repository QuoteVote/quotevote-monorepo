import React from 'react'
import PropTypes from 'prop-types'

// @mui/material components
import { makeStyles } from '@mui/material/styles'
import ExpansionPanel from '@mui/material/ExpansionPanel'
import ExpansionPanelSummary from '@mui/material/ExpansionPanelSummary'
import ExpansionPanelDetails from '@mui/material/ExpansionPanelDetails'
// @mui/icons-material
import ExpandMore from '@mui/icons-material/ExpandMore'
import styles from 'assets/jss/material-dashboard-pro-react/components/accordionStyle'

const useStyles = makeStyles(styles)

export default function Accordion(props) {
  const [active, setActive] = React.useState(props.active)
  const handleChange = (panel) => (event, expanded) => {
    setActive(expanded ? panel : -1)
  }
  const classes = useStyles()
  const { collapses } = props
  return (
    <div className={classes.root}>
      {collapses.map((prop, key) => (
        <ExpansionPanel
          expanded={active === key}
          onChange={handleChange(key)}
          key={key}
          classes={{
            root: classes.expansionPanel,
            expanded: classes.expansionPanelExpanded,
          }}
        >
          <ExpansionPanelSummary
            expandIcon={(
              <div>
                <ExpandMore />
              </div>
            )}
            classes={{
              root: classes.expansionPanelSummary,
              expanded: classes.expansionPanelSummaryExpaned,
              content: classes.expansionPanelSummaryContent,
              expandIcon: classes.expansionPanelSummaryExpandIcon,
            }}
          >
            <h4 className={classes.title}>{prop.title}</h4>
            <img alt=" " src="/assets/Chat.svg" />
            <img alt=" " src="/assets/Chat.svg" />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionPanelDetails}>
            {prop.content}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  )
}

Accordion.defaultProps = {
  active: -1,
}

Accordion.propTypes = {
  // index of the default active collapse
  active: PropTypes.number,
  collapses: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.node,
    })
  ).isRequired,
}
