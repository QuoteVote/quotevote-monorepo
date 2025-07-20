import React from 'react'
import PropTypes from 'prop-types'

// @material-ui/core components
import { makeStyles } from '@mui/styles'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
// @material-ui/icons
import ExpandMore from '@mui/icons-material/ExpandMore'
import styles from 'assets/jss/material-dashboard-pro-react/components/accordionStyle'

const useStyles = makeStyles(styles)

export default function CustomAccordion(props) {
  const [active, setActive] = React.useState(props.active)
  const handleChange = (panel) => (event, expanded) => {
    setActive(expanded ? panel : -1)
  }
  const classes = useStyles()
  const { collapses } = props
  return (
    <div className={classes.root}>
      {collapses.map((prop, key) => (
        <Accordion
          expanded={active === key}
          onChange={handleChange(key)}
          key={key}
          classes={{
            root: classes.expansionPanel,
            expanded: classes.expansionPanelExpanded,
          }}
        >
          <AccordionSummary
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
          </AccordionSummary>
          <AccordionDetails className={classes.expansionPanelDetails}>
            {prop.content}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

CustomAccordion.defaultProps = {
  active: -1,
}

CustomAccordion.propTypes = {
  // index of the default active collapse
  active: PropTypes.number,
  collapses: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.node,
    })
  ).isRequired,
}
