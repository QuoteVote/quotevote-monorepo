import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { makeStyles } from '@mui/styles'
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
    backgroundColor: 'white',
    maxHeight: '200px',
    padding: '2px 0',
    '& li': {
      padding: '8px 16px',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      lineHeight: '1.2',
      '&:hover': {
        backgroundColor: 'rgba(82, 178, 116, 0.08)',
      },
      '&[data-focus="true"]': {
        backgroundColor: 'rgba(82, 178, 116, 0.12)',
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
    const { title, text, group } = values
    
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
