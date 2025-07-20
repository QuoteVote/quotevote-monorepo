import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete, {
  createFilterOptions,
} from '@mui/lab/Autocomplete'
import { makeStyles } from '@mui/material/styles'
import {
  CardActions,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Typography,
  Card,
  CardHeader,
  Box,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import Button from '../../mui-pro/CustomButtons/Button'
import SubmitPostAlert from './SubmitPostAlert'
import { SET_SELECTED_POST } from '../../store/ui'
import { CREATE_GROUP, SUBMIT_POST } from '../../graphql/mutations'
import { useMobileDetection } from '../../utils/display'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxHeight: 'calc(100vh - 200px)', // Leave space for header/footer on desktop
  },
  rootMobile: {
    height: '100vh',
    maxHeight: '100vh',
  },
  title: {
    color: '#52b274',
    fontSize: 30,
    margin: 'auto',
  },
  exit: {
    color: '#52b274',
    fontSize: 30,
    float: 'right',
  },
  text: {
    marginTop: 20,
    fontSize: '20px',
  },
  input: {
    margin: '20px 0px 0px 0px',
    '& textarea': {
      minHeight: '75vh',
      [theme.breakpoints.down('sm')]: {
        minHeight: '50vh',
      },
    },
  },
  group: {
    margin: '20px 0px',
  },
  groupInput: {
    backgroundColor: 'rgb(160, 243, 204, 0.6)',
    width: 180,
    marginLeft: 20,
  },
  label: {
    color: '#52b274',
  },
  button: {
    backgroundColor: '#52b274',
    fontSize: 20,
  },
  cardBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '20px',
    marginRight: '20px',
    overflow: 'hidden',
  },
  scrollableContent: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
  },
  cardActions: {
    flexShrink: 0,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '20px',
    paddingBottom: '20px',
    borderTop: '1px solid #e0e0e0',
  },
}))

const filter = createFilterOptions()

function SubmitPostForm({ options = [], user, setOpen }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { register, handleSubmit, errors, reset, control } = useForm()
  const [submitPost, { loading }] = useMutation(SUBMIT_POST)
  const [createGroup, { loading: loadingGroup }] = useMutation(CREATE_GROUP)
  const [error, setError] = React.useState(null)

  const onSubmit = async (values) => {
    const { title, text, group } = values
    try {
      let newGroup
      const isNewGroup = group && !('_id' in group)
      if (isNewGroup) {
        newGroup = await createGroup({
          variables: {
            group: {
              creatorId: user._id,
              title: group.title,
              description: `Description for: ${group.title} group`,
              privacy: 'public',
            },
          },
        })
      }
      const postGroupId = isNewGroup ? newGroup.data.createGroup._id : group._id
      const submitResult = await submitPost({
        variables: {
          post: {
            userId: user._id,
            text,
            title,
            groupId: postGroupId,
          },
        },
      })
      const { _id, url } = submitResult.data.addPost
      dispatch(SET_SELECTED_POST(_id))
      setShareableLink(url)
      setShowAlert(true)
    } catch (err) {
      setError(err)
      setShowAlert(true)
    }
  }

  const [shareableLink, setShareableLink] = React.useState('')
  const [showAlert, setShowAlert] = React.useState(false)
  const hideAlert = () => {
    setShowAlert(false)
    setShareableLink('')
    reset()
  }
  const [value, setValue] = React.useState({ title: '', content: '' })
  const [isPasting, setPasting] = React.useState(false)

  const handleTitleChange = (event) => {
    event.persist()
    setValue({ ...value, title: event.target.value })
  }

  const handleContentChange = (event) => {
    event.persist()
    const contentValue = event.target.value
    const validURL = /^(?:http(s)?:\/\/)([\w.-])+(?:[\w.-]+)+([\w\-._~:/?#[\]@!$&'()*+,;=.])+$/
    setValue({ ...value, content: contentValue })
    if (isPasting && contentValue.match(validURL)) {
      parseURLContent(contentValue)
    }
    setPasting(false)
  }

  const parseURLContent = async (url) => {
    try {
      const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const title = titleMatch ? titleMatch[1].trim() : 'Extracted Content'

      const cleanHtml = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      const content =
        cleanHtml.substring(0, 500) + (cleanHtml.length > 500 ? '...' : '')

      if (isEmpty(content)) {
        setError('Could not extract site content.')
        setShowAlert(true)
      } else {
        setValue({ title, content })
      }
    } catch (err) {
      console.error('Error parsing URL:', err)
      setError('Could not extract site content. Please try again.')
      setShowAlert(true)
    }
  }

  const handlePaste = () => {
    setPasting(true)
  }

  const isMobile = useMobileDetection()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className={`${classes.root} ${isMobile ? classes.rootMobile : ''}`}>
        {showAlert && (
          <SubmitPostAlert
            hideAlert={hideAlert}
            shareableLink={shareableLink}
            error={error}
            setShowAlert={setShowAlert}
            setOpen={setOpen}
          />
        )}
        <CardHeader
          title={
            <Typography className={classes.title} variant="body2">
              Create a Post
            </Typography>
          }
          action={
              <IconButton className={classes.exit} onClick={() => setOpen(false)}>
                x
              </IconButton>
          }
          style={{ padding: "20px", margin: 0 }}
        />
        <Box className={classes.cardBody}>
          <InputBase
            className={classes.input}
            fullWidth
            id="title"
            placeholder="Enter Title"
            value={value.title}
            onChange={(event) => {
              handleTitleChange(event)
            }}
            name="title"
            inputRef={register({
              required: 'Title is required',
            })}
            required
            error={errors.title}
          />
          <Divider />
          <div className={classes.scrollableContent}>
            <InputBase
              className={classes.input}
              id="text"
              placeholder="Enter text or URL here"
              value={value.content}
              onChange={(event) => {
                handleContentChange(event)
              }}
              onPaste={handlePaste}
              multiline
              fullWidth
              name="text"
              inputRef={register({
                required: 'Post is required',
              })}
              required
              error={errors.text}
            />
          </div>
        </Box>
        <CardActions className={classes.cardActions}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Typography>Who can see your post</Typography>

            <Controller
              render={({ onChange, ...props }) => (
                <Autocomplete
                  {...props}
                  variant="outlined"
                  size="small"
                  className={classes.groupInput}
                  onChange={(event, newValue) => {
                    let data
                    if (typeof newValue === 'string') {
                      data = {
                        title: newValue,
                      }
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      data = {
                        title: newValue.inputValue,
                      }
                    } else {
                      data = newValue
                    }
                    onChange(data)
                  }}
                  filterOptions={(groupOptions, params) => {
                    const filtered = filter(groupOptions, params)

                    // Suggest the creation of a new value
                    if (params.inputValue !== '') {
                      filtered.push({
                        inputValue: params.inputValue,
                        title: `Add "${params.inputValue}"`,
                      })
                    }

                    return filtered
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="hashtag"
                  options={options}
                  getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                      return option
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                      return option.inputValue
                    }
                    // Regular option
                    return option.title
                  }}
                  renderOption={(option) => option.title}
                  renderInput={(params) => (
                    <TextField
                      variant="outlined"
                      className={classes.label}
                      {...params}
                      label="Select a hashtag"
                      name="hashtag"
                      id="hashtag"
                      inputRef={register({
                        required: 'hashtag is required',
                      })}
                    />
                  )}
                  inputRef={register({
                    required: 'Hashtag is required',
                  })}
                />
              )}
              onChange={([, data]) => data}
              name="group"
              control={control}
              defaultValue=""
            />
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Button
              id="submit-button"
              type="submit"
              variant="contained"
              fullWidth
              className={classes.button}
              disabled={loadingGroup || loading}
              color="secondary"
            >
              POST
              {(loading || loadingGroup) && (
                <CircularProgress size={20} style={{ marginLeft: 5 }} />
              )}
            </Button>
          </Grid>
        </CardActions>
      </Card>
    </form>
  )
}

SubmitPostForm.propTypes = {
  setOpen: PropTypes.func,
  options: PropTypes.array,
  user: PropTypes.object,
}

export default SubmitPostForm
