import React from 'react'
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime'
// react component plugin for creating beatiful tags on an input
import TagsInput from 'react-tagsinput'
// plugin that creates slider
import Slider from 'nouislider'

// @mui styles + components
import { makeStyles } from '@mui/styles'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import Switch from '@mui/material/Switch'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// @mui icons
import Today from '@mui/icons-material/Today'
import LibraryBooks from '@mui/icons-material/LibraryBooks'
import AvTimer from '@mui/icons-material/AvTimer'

// core mui-pro components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import CustomDropdown from 'mui-pro/CustomDropdown/CustomDropdown'
import CustomLinearProgress from 'mui-pro/CustomLinearProgress/CustomLinearProgress'
import ImageUpload from 'mui-pro/CustomUpload/ImageUpload'
import Card from 'mui-pro/Card/Card'
import CardHeader from 'mui-pro/Card/CardHeader'
import CardIcon from 'mui-pro/Card/CardIcon'
import CardBody from 'mui-pro/Card/CardBody'

import styles from 'assets/jss/material-dashboard-pro-react/views/extendedFormsStyle'

const useStyles = makeStyles(styles)

export default function ExtendedForms() {
  const [checkedA, setCheckedA] = React.useState(true)
  const [checkedB, setCheckedB] = React.useState(false)
  const [simpleSelect, setSimpleSelect] = React.useState('')
  const [multipleSelect, setMultipleSelect] = React.useState([])
  const [tags, setTags] = React.useState(['pizza', 'pasta', 'parmesan'])
  React.useEffect(() => {
    if (
      !document
        .getElementById('sliderRegular')
        .classList.contains('noUi-target')
    ) {
      Slider.create(document.getElementById('sliderRegular'), {
        start: [40],
        connect: [true, false],
        step: 1,
        range: { min: 0, max: 100 },
      })
    }
    if (
      !document.getElementById('sliderDouble').classList.contains('noUi-target')
    ) {
      Slider.create(document.getElementById('sliderDouble'), {
        start: [20, 60],
        connect: [false, true, false],
        step: 1,
        range: { min: 0, max: 100 },
      })
    }
    return function cleanup() {}
  })
  const handleSimple = (event) => {
    setSimpleSelect(event.target.value)
  }
  const handleMultiple = (event) => {
    setMultipleSelect(event.target.value)
  }
  const handleTags = (regularTags) => {
    setTags(regularTags)
  }
  const classes = useStyles()
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <Today />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Datetime Picker</h4>
            </CardHeader>
            <CardBody>
              <InputLabel className={classes.label}>Datetime Picker</InputLabel>
              <br />
              <FormControl fullWidth>
                <Datetime
                  inputProps={{ placeholder: 'Datetime Picker Here' }}
                />
              </FormControl>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <LibraryBooks />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Date Picker</h4>
            </CardHeader>
            <CardBody>
              <InputLabel className={classes.label}>Date Picker</InputLabel>
              <br />
              <FormControl fullWidth>
                <Datetime
                  timeFormat={false}
                  inputProps={{ placeholder: 'Date Picker Here' }}
                />
              </FormControl>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <AvTimer />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Time Picker</h4>
            </CardHeader>
            <CardBody>
              <InputLabel className={classes.label}>Time Picker</InputLabel>
              <br />
              <FormControl fullWidth>
                <Datetime
                  dateFormat={false}
                  inputProps={{ placeholder: 'Time Picker Here' }}
                />
              </FormControl>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <br />
              <br />
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <legend>Switches</legend>
                  <div className={classes.block}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={checkedA}
                          onChange={(event) => setCheckedA(event.target.checked)}
                          value="checkedA"
                          classes={{
                            switchBase: classes.switchBase,
                            checked: classes.switchChecked,
                            thumb: classes.switchIcon,
                            track: classes.switchBar,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                      }}
                      label="Toggle is on"
                    />
                  </div>
                  <div className={classes.block}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={checkedB}
                          onChange={(event) => setCheckedB(event.target.checked)}
                          value="checkedB"
                          classes={{
                            switchBase: classes.switchBase,
                            checked: classes.switchChecked,
                            thumb: classes.switchIcon,
                            track: classes.switchBar,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                      }}
                      label="Toggle is off"
                    />
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <legend>Customisable Select</legend>
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={5} lg={5}>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                        >
                          Choose City
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          value={simpleSelect}
                          onChange={handleSimple}
                          inputProps={{
                            name: 'simpleSelect',
                            id: 'simple-select',
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Choose City
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="2"
                          >
                            Paris
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="3"
                          >
                            Bucharest
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="4"
                          >
                            Rome
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="5"
                          >
                            New York
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="6"
                          >
                            Miami
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="7"
                          >
                            Piatra Neamt
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="8"
                          >
                            Paris
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="9"
                          >
                            Bucharest
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="10"
                          >
                            Rome
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="11"
                          >
                            New York
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="12"
                          >
                            Miami
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="13"
                          >
                            Piatra Neamt
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="14"
                          >
                            Paris
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="15"
                          >
                            Bucharest
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="16"
                          >
                            Rome
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="17"
                          >
                            New York
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="18"
                          >
                            Miami
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            value="19"
                          >
                            Piatra Neamt
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={5} lg={5}>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <InputLabel
                          htmlFor="multiple-select"
                          className={classes.selectLabel}
                        >
                          Choose City
                        </InputLabel>
                        <Select
                          multiple
                          value={multipleSelect}
                          onChange={handleMultiple}
                          MenuProps={{ className: classes.selectMenu }}
                          classes={{ select: classes.select }}
                          inputProps={{
                            name: 'multipleSelect',
                            id: 'multiple-select',
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Choose City
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="2"
                          >
                            Paris
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="3"
                          >
                            Bucharest
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="4"
                          >
                            Rome
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="5"
                          >
                            New York
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="6"
                          >
                            Miami
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="7"
                          >
                            Piatra Neamt
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="8"
                          >
                            Paris
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="9"
                          >
                            Bucharest
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="10"
                          >
                            Rome
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="11"
                          >
                            New York
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="12"
                          >
                            Miami
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="13"
                          >
                            Piatra Neamt
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="14"
                          >
                            Paris
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="15"
                          >
                            Bucharest
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="16"
                          >
                            Rome
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="17"
                          >
                            New York
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="18"
                          >
                            Miami
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelectedMultiple,
                            }}
                            value="19"
                          >
                            Piatra Neamt
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
              <br />
              <br />
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <legend>Tags</legend>
                  <TagsInput
                    value={tags}
                    onChange={handleTags}
                    tagProps={{ className: 'react-tagsinput-tag info' }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <legend>Dropdown & Dropup</legend>
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={6} lg={6}>
                      <CustomDropdown
                        buttonText="Multilevel Dropdown"
                        hoverColor="info"
                        buttonProps={{
                          round: true,
                          block: true,
                          color: 'info',
                        }}
                        dropPlacement="bottom"
                        dropdownList={[
                          'Action',
                          'Another action',
                          <CustomDropdown
                            key="key"
                            data-ref="multi"
                            innerDropDown
                            buttonText="Submenu"
                            hoverColor="info"
                            buttonProps={{
                              simple: true,
                              block: true,
                            }}
                            dropPlacement="right-start"
                            dropdownList={[
                              'Submenu action',
                              'Submenu action',
                              <CustomDropdown
                                key="key"
                                data-ref="multi"
                                innerDropDown
                                hoverColor="info"
                                buttonText="Subsubmenu"
                                buttonProps={{
                                  simple: true,
                                }}
                                dropPlacement="right-start"
                                dropdownList={[
                                  'Subsubmenu action 1',
                                  'Subsubmenu action 2',
                                ]}
                              />,
                              <CustomDropdown
                                key="key"
                                data-ref="multi"
                                innerDropDown
                                hoverColor="info"
                                buttonText="Second Subsubmenu"
                                buttonProps={{
                                  simple: true,
                                }}
                                dropPlacement="right-start"
                                dropdownList={[
                                  'Second Subsubmenu action 1',
                                  'Second Subsubmenu action 2',
                                ]}
                              />,
                            ]}
                          />,
                        ]}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6} lg={6}>
                      <CustomDropdown
                        hoverColor="info"
                        buttonText="Dropdown"
                        buttonProps={{
                          round: true,
                          fullWidth: true,
                          style: { marginBottom: '0' },
                          color: 'info',
                        }}
                        dropdownHeader="Dropdown header"
                        dropdownList={[
                          'Action',
                          'Another action',
                          'Something else here',
                          { divider: true },
                          'Separated link',
                          { divider: true },
                          'One more separated link',
                        ]}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      className={`${classes.mrAuto} ${classes.mlAuto}`}
                    >
                      <CustomDropdown
                        dropup
                        buttonText="Dropup"
                        hoverColor="info"
                        dropPlacement="top"
                        buttonProps={{
                          round: true,
                          fullWidth: true,
                          style: { marginBottom: '0' },
                          color: 'info',
                        }}
                        dropdownHeader="Dropdown header"
                        dropdownList={[
                          'Action',
                          'Another action',
                          'Something else here',
                          { divider: true },
                          'Separated link',
                          { divider: true },
                          'One more separated link',
                        ]}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
              <br />
              <br />
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <legend>Progress Bars</legend>
                  <CustomLinearProgress
                    variant="determinate"
                    color="primary"
                    value={30}
                  />
                  <CustomLinearProgress
                    variant="determinate"
                    color="info"
                    value={60}
                  />
                  <CustomLinearProgress
                    variant="determinate"
                    color="success"
                    value={100}
                    style={{ width: '35%', display: 'inline-block' }}
                  />
                  <CustomLinearProgress
                    variant="determinate"
                    color="warning"
                    value={100}
                    style={{ width: '20%', display: 'inline-block' }}
                  />
                  <CustomLinearProgress
                    variant="determinate"
                    color="danger"
                    value={25}
                    style={{ width: '45%', display: 'inline-block' }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <legend>Sliders</legend>
                  <div className="slider-primary" id="sliderRegular" />
                  <br />
                  <div className="slider-info" id="sliderDouble" />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <legend>Regular Image</legend>
                  <ImageUpload
                    addButtonProps={{
                      color: 'rose',
                      round: true,
                    }}
                    changeButtonProps={{
                      color: 'rose',
                      round: true,
                    }}
                    removeButtonProps={{
                      color: 'danger',
                      round: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <legend>Avatar</legend>
                  <ImageUpload
                    avatar
                    addButtonProps={{
                      color: 'rose',
                      round: true,
                    }}
                    changeButtonProps={{
                      color: 'rose',
                      round: true,
                    }}
                    removeButtonProps={{
                      color: 'danger',
                      round: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
