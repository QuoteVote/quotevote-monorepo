// TODO: Fix links to have href
import React from 'react'
import PropTypes from 'prop-types'
// MUI components
import { makeStyles } from '@mui/styles'
import { Link, Tooltip, Divider } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
// MUI icons
import ExpandMore from '@mui/icons-material/ExpandMore'
import styles from 'assets/jss/material-dashboard-pro-react/components/accordionStyle'
import GridContainer from 'mui-pro/Grid/GridContainer'
// import GridItem from 'mui-pro/Grid/GridItem'
import limit from 'string-limit'
import copy from 'clipboard-copy'

const useStyles = makeStyles(styles)

export default function CustomAccordion({ collapses, active: activeProp }) {
  const DOMAIN = process.env.REACT_APP_DOMAIN || 'localhost:3000'
  const [active, setActive] = React.useState(activeProp)
  const [activeKey, setActiveKey] = React.useState(null)
  const handleChange = (panel) => (event, expanded) => {
    setActive(expanded ? panel : -1)
  }
  const classes = useStyles()
  const handleCopy = (shareableLink, key) => {
    copy(shareableLink)
    setActiveKey(key)
  }
  return (
    <div className={classes.root}>
      {collapses.map((prop, key) => {
        const {
          text, /* _id, */ title, upvotes, downvotes, url,
        } = prop
        // const postURL = `/post/${title}/${_id}`
        return (
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
                  {' '}
                  <ExpandMore />
                  {' '}
                </div>
              )}
              classes={{
                root: classes.expansionPanelSummary,
                expanded: classes.expansionPanelSummaryExpaned,
                content: classes.expansionPanelSummaryContent,
                expandIcon: classes.expansionPanelSummaryExpandIcon,
              }}
            >
              <h4 className={classes.title} style={{ width: '10%' }}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link
                  className={classes.title}
                  tp
                >
                  {title}
                </Link>
              </h4>
              <div
                style={{
                  diplay: 'flex', width: '87%', alignItems: 'flex-end', flex: 'flex-shrink',
                }}
              >
                <GridContainer direction="row" justify="space-between" spacing={3}>
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                    <img alt="Chat icon" src="/assets/Chat.svg" style={{ paddingBottom: '10px', marginLeft: '20px', marginRight: '5px' }} />
                    <p>
                      <span style={{ color: 'green' }}>{`+${upvotes}`}</span>
                      <span style={{ color: 'red' }}>{`+${downvotes}`}</span>
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', flexDirection: 'row', marginRight: '2%',
                    }}
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link onClick={() => handleCopy(DOMAIN + url, key)}>
                      {activeKey === key ? (
                        <Tooltip
                          placement="top"
                          title="URL copied"
                          onClose={() => setActiveKey(null)}
                          arrow
                          open
                        >
                          <img alt="Send icon" src="/assets/Send.svg" style={{ paddingBottom: '10px', paddingTop: '10px', marginRight: '10px' }} />
                        </Tooltip>
                      ) : (
                        <img alt="Send icon" src="/assets/Send.svg" style={{ paddingBottom: '10px', paddingTop: '10px', marginRight: '10px' }} />
                      )}
                    </Link>
                    <img alt="Heart icon" src="/assets/Heart.svg" style={{ paddingBottom: '10px', paddingTop: '10px' }} />
                  </div>
                </GridContainer>
              </div>
            </AccordionSummary>
            <AccordionDetails className={classes.expansionPanelDetails}>
              {limit(text || '', 300)}
            </AccordionDetails>
          </Accordion>
        )
      })}
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
