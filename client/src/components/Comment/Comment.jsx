/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import {
  Card, CardActions, CardContent, CardHeader, IconButton,
} from '@mui/material'
import { InsertEmoticon, InsertLink } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import copy from 'clipboard-copy'
import SweetAlert from 'react-bootstrap-sweetalert'
import AvatarDisplay from '../Avatar'
import { parseCommentDate } from '../../utils/momentUtils'
import { SET_FOCUSED_COMMENT } from '../../store/ui'
import buttonStyle from '../../assets/jss/material-dashboard-pro-react/components/buttonStyle'

const useStyles = makeStyles((theme) => ({
  content: {
    marginLeft: 60,
    marginRight: 40,
    marginTop: -20,
    marginBottom: -20,
  },
  expand: {
    marginLeft: 'auto',
  },
  created: {
    verticalAlign: 'middle',
    marginTop: 20,
    marginRight: 10,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  selectedRoot: {
    backgroundColor: '#f1e8c1',
    width: '100%',
  },
  ...buttonStyle,
}))

function Comment({ comment, postUrl, selected }) {
  const {
    user, content, created, _id,
  } = comment
  const { username, avatar } = user
  const classes = useStyles()
  const history = useHistory()
  const parsedDate = parseCommentDate(created)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const hideAlert = () => {
    setOpen(false)
  }
  const baseUrl = window.location.origin
  console.log(baseUrl)
  const handleCopy = async () => {
    await copy(`${baseUrl}${postUrl}/comment#${_id}`)
    setOpen(true)
  }

  useEffect(() => {
    if (selected) {
      SET_FOCUSED_COMMENT(comment)
    }
  }, [comment, selected])

  return (
    <Card
      onMouseEnter={() => dispatch(SET_FOCUSED_COMMENT(comment))}
      onMouseLeave={() => dispatch(SET_FOCUSED_COMMENT(selected ? comment : null))}
      className={selected ? classes.selectedRoot : classes.root}
    >
      <CardHeader
        avatar={(
          <IconButton
            size="small"
            onClick={() => history.push(`/Profile/${username}`)}
          >
            <AvatarDisplay height={40} width={40} {...avatar} />
          </IconButton>
        )}
        subheader={`@${username}`}
        action={(
          <div className={classes.created}>
            <span>{parsedDate}</span>
          </div>
        )}
      />
      <CardContent className={classes.content}>
        <p>{content}</p>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton className={classes.expand}>
          <InsertEmoticon />
        </IconButton>
        <IconButton onClick={handleCopy}>
          <InsertLink />
        </IconButton>
      </CardActions>
      {open && (
        <SweetAlert
          confirmBtnCssClass={`${classes.button} ${classes.success}`}
          success
          onConfirm={hideAlert}
          onCancel={hideAlert}
          title="Comment URL copied!"
          timeout={1000}
        />
      )}
    </Card>
  )
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  postUrl: PropTypes.string,
  selected: PropTypes.bool,
}

export default Comment
