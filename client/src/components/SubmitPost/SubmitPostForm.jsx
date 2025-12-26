import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
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
  Tooltip,
} from '@material-ui/core'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import Button from '../../mui-pro/CustomButtons/Button'
import SubmitPostAlert from './SubmitPostAlert'
import { SET_SELECTED_POST } from '../../store/ui'
import { CREATE_GROUP, SUBMIT_POST } from '../../graphql/mutations'
import { useMobileDetection } from '../../utils/display'

// URL detection regex for One-Link Rule validation
const URL_REGEX = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*/gi

// Regex to detect emojis and other non-URL-safe characters
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/u;

// Strict allowlist: Only RFC 3986 compliant URL characters
// Allows: letters, digits, and -._~:/?#[]@!$&'()*+,;=%
const INVALID_URL_CHARS_REGEX = /[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]/;

// Helper: Strict URL Sanitizer
const sanitizeUrl = (url) => {
  if (!url) return null;
  
  const trimmedUrl = url.trim();
  
  // 1. Block emojis
  if (EMOJI_REGEX.test(trimmedUrl)) {
    return null;
  }
  
  // 2. Block non-standard URL characters (strict allowlist)
  if (INVALID_URL_CHARS_REGEX.test(trimmedUrl)) {
    return null;
  }
  
  try {
    // 3. Parse using native URL constructor
    const parsed = new URL(trimmedUrl);
    
    // 4. Block dangerous protocols (javascript:, data:, file:)
    if (!['http:', 'https:', 'ftp:'].includes(parsed.protocol)) {
      return null;
    }
    
    // 5. Ensure hostname exists and is valid
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return null;
    }
    
    // 6. Return the clean, normalized string
    return parsed.href;
  } catch (e) {
    return null; // Invalid URL
  }
};

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
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(82, 178, 116, 0.15)' : 'rgb(160, 243, 204, 0.6)',
    width: '100%',
    maxWidth: 220,
    marginLeft: 20,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 4,
      maxWidth: '100%',
    },
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
    [theme.breakpoints.down('sm')]: {
      marginLeft: '16px',
      marginRight: '16px',
    },
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
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '16px',
      paddingBottom: '16px',
    },
  },
  autocompletePopper: {
    '& .MuiAutocomplete-paper': {
      margin: '2px 0',
      boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
      borderRadius: '4px',
    },
  },
  autocompleteListbox: {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : 'white',
    maxHeight: '200px',
    padding: '2px 0',
    '&amp; li': {
      padding: '8px 16px',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      lineHeight: '1.2',
      color: theme.palette.text.primary,
      '&amp;:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(82, 178, 116, 0.2)' : 'rgba(82, 178, 116, 0.08)',
      },
      '&amp;[data-focus="true"]': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(82, 178, 116, 0.25)' : 'rgba(82, 178, 116, 0.12)',
      },
    },
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
    const { title, text, group, citationUrl } = values

    // Sanitize citation URL before submission
    const cleanCitation = sanitizeUrl(citationUrl);
    
    // If user typed garbage that resulted in null, block submission
    if (citationUrl && !cleanCitation) {
      setError('Invalid URL format.');
      setShowAlert(true);
      return;
    }

    // Handle case where group might be a string (typed value)
    const groupData = typeof group === 'string' ? { title: group } : group

    try {
      let newGroup
      const isNewGroup = groupData && !('_id' in groupData)

      if (isNewGroup) {
        setIsCreatingGroup(true)
        setNewGroupName(groupData.title)

        newGroup = await createGroup({
          variables: {
            group: {
              creatorId: user._id,
              title: groupData.title,
              description: `Description for: ${groupData.title} group`,
              privacy: 'public',
            },
          },
        })

        setIsCreatingGroup(false)
        setNewGroupName('')
      }

      const postGroupId = isNewGroup ? newGroup.data.createGroup._id : groupData._id
      const submitResult = await submitPost({
        variables: {
          post: {
            userId: user._id,
            text,
            title,
            groupId: postGroupId,
            citationUrl: cleanCitation || null,
          },
        },
      })
      const { _id, url } = submitResult.data.addPost
      dispatch(SET_SELECTED_POST(_id))
      setShareableLink(url)
      setShowAlert(true)
    } catch (err) {
      setIsCreatingGroup(false)
      setNewGroupName('')
      setError(err)
      setShowAlert(true)
    }
  }

  const [shareableLink, setShareableLink] = React.useState('')
  const [showAlert, setShowAlert] = React.useState(false)
  const [isCreatingGroup, setIsCreatingGroup] = React.useState(false)
  const [newGroupName, setNewGroupName] = React.useState('')
  const hideAlert = () => {
    setShowAlert(false)
    setShareableLink('')
    reset()
  }
  const [value, setValue] = React.useState({ title: '', content: '' })

  const handleTitleChange = (event) => {
    event.persist()
    setValue({ ...value, title: event.target.value })
  }

  const handleContentChange = (event) => {
    event.persist()
    setValue({ ...value, content: event.target.value })
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
              Create Quote
            </Typography>
          }
          action={
            <IconButton className={classes.exit} onClick={() => setOpen(false)}>
              x
            </IconButton>
          }
          style={{
            padding: isMobile ? "16px" : "20px",
            margin: 0
          }}
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
              placeholder="Enter your post content (no links allowed)"
              value={value.content}
              onChange={(event) => {
                handleContentChange(event)
              }}
              multiline
              fullWidth
              name="text"
              inputRef={register({
                required: 'Post is required',
                validate: (val) => {
                  URL_REGEX.lastIndex = 0
                  return !URL_REGEX.test(val) || 'Links are not allowed in the post body.'
                },
              })}
              required
              error={!!errors.text}
            />
            {errors.text && (
              <div
                style={{
                  backgroundColor: '#ffebee',
                  border: '1px solid #f44336',
                  borderRadius: 4,
                  padding: '12px 16px',
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: '#f44336', fontSize: 20 }}>⚠️</span>
                <Typography color="error" variant="body2" style={{ fontWeight: 500 }}>
                  {errors.text.message}
                </Typography>
              </div>
            )}
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TextField
              id="citationUrl"
              name="citationUrl"
              label="Citation Link"
              placeholder="Source URL (e.g. https://wikipedia.org/wiki/...)"
              variant="outlined"
              size="small"
              fullWidth
              inputRef={register({
                validate: (val) => {
                  if (!val) return true; // Optional field
                  const clean = sanitizeUrl(val);
                  // If sanitizeUrl returns null, it contained invalid chars or bad format
                  return !!clean || 'Invalid URL. Please remove special characters or fix format.';
                },
              })}
              error={!!errors.citationUrl}
              helperText={errors.citationUrl?.message}
            />
            <Tooltip title="One citation per post. No other links allowed in the body." arrow>
              <IconButton size="small" style={{ color: '#52b274' }}>
                ?
              </IconButton>
            </Tooltip>
          </div>
        </Box>
        <CardActions className={classes.cardActions}>
          <Grid
            container
            direction={isMobile ? "column" : "row"}
            justify="flex-start"
            alignItems={isMobile ? "flex-start" : "center"}
            spacing={isMobile ? 2 : 0}
            style={{ width: '100%' }}
          >
            <Typography style={{
              marginRight: isMobile ? '0px' : '10px',
              marginBottom: isMobile ? '12px' : '0px',
              fontWeight: 500
            }}>
              Who can see your post
            </Typography>

            {isCreatingGroup && (
              <Typography
                variant="caption"
                style={{
                  color: '#52b274',
                  marginLeft: isMobile ? '0px' : '10px',
                  marginBottom: isMobile ? '8px' : '0px',
                  fontStyle: 'italic'
                }}
              >
                Creating group "{newGroupName}"...
              </Typography>
            )}

            <Controller
              render={({ onChange, ...props }) => (
                <Autocomplete
                  {...props}
                  variant="outlined"
                  size="small"
                  className={classes.groupInput}
                  freeSolo
                  classes={{
                    popper: classes.autocompletePopper,
                    listbox: classes.autocompleteListbox,
                  }}


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
                    } else if (newValue && newValue.title) {
                      // Handle both existing groups and new typed values
                      data = newValue
                    } else {
                      data = newValue
                    }
                    onChange(data)
                  }}
                  filterOptions={(groupOptions, params) => {
                    // Use Material-UI's built-in filtering first
                    const filtered = filter(groupOptions, params)

                    // Add "Create new group" option if input doesn't match any existing option
                    if (params.inputValue !== '' &&
                      !groupOptions.some(option =>
                        option.title.toLowerCase() === params.inputValue.toLowerCase()
                      )) {
                      filtered.push({
                        inputValue: params.inputValue,
                        title: `Create new group: "${params.inputValue}"`,
                      })
                    }

                    return filtered
                  }}
                  selectOnFocus
                  handleHomeEndKeys
                  id="group-selector"
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
                  renderOption={(option) => (
                    <span>
                      {option.title}
                    </span>
                  )}
                  renderInput={(params) => (
                    <TextField
                      variant="outlined"
                      {...params}
                      label="Select or create a group"
                      placeholder="Type to search or create new group"
                      name="group"
                      id="group-selector"
                      error={errors.group}
                      helperText={errors.group?.message}
                    />
                  )}
                />
              )}
              onChange={([, data]) => data}
              name="group"
              control={control}
              defaultValue=""
              rules={{
                required: 'Group selection is required',
                validate: (value) => {
                  // Allow both selected groups and typed values
                  if (!value) return 'Group selection is required'
                  if (typeof value === 'string' && value.trim() === '') return 'Group selection is required'
                  if (value && value.title && value.title.trim() === '') return 'Group selection is required'
                  return true
                }
              }}
            />
          </Grid>

          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
            style={{ marginTop: isMobile ? '16px' : '20px' }}
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
