import React from 'react'
// @material-ui/core components
import { makeStyles } from '@mui/styles'
import Checkbox from '@mui/material/Checkbox'

// material-ui icons
import Assignment from '@mui/icons-material/Assignment'
import Person from '@mui/icons-material/Person'
import Edit from '@mui/icons-material/Edit'
import Close from '@mui/icons-material/Close'
import Check from '@mui/icons-material/Check'
import Remove from '@mui/icons-material/Remove'
import Add from '@mui/icons-material/Add'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import Table from 'mui-pro/Table/Table'
import Button from 'mui-pro/CustomButtons/Button'
import Card from 'mui-pro/Card/Card'
import CardBody from 'mui-pro/Card/CardBody'
import CardIcon from 'mui-pro/Card/CardIcon'
import CardHeader from 'mui-pro/Card/CardHeader'

import styles from 'assets/jss/material-dashboard-pro-react/views/extendedTablesStyle'

const useStyles = makeStyles(styles)

export default function ExtendedTables() {
  const [checked, setChecked] = React.useState([])
  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }
  const classes = useStyles()
  const fillButtons = [
    { color: 'info', icon: Person },
    { color: 'success', icon: Edit },
    { color: 'danger', icon: Close },
  ].map((prop, key) => (
    <Button color={prop.color} className={classes.actionButton} key={key}>
      <prop.icon className={classes.icon} />
    </Button>
  ))
  const simpleButtons = [
    { color: 'info', icon: Person },
    { color: 'success', icon: Edit },
    { color: 'danger', icon: Close },
  ].map((prop, key) => (
    <Button
      color={prop.color}
      simple
      className={classes.actionButton}
      key={key}
    >
      <prop.icon className={classes.icon} />
    </Button>
  ))
  const roundButtons = [
    { color: 'info', icon: Person },
    { color: 'success', icon: Edit },
    { color: 'danger', icon: Close },
  ].map((prop, key) => (
    <Button
      round
      color={prop.color}
      className={`${classes.actionButton} ${classes.actionButtonRound}`}
      key={key}
    >
      <prop.icon className={classes.icon} />
    </Button>
  ))
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Simple Table</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHead={[
                '#',
                'Name',
                'Job Position',
                'Since',
                'Salary',
                'Actions',
              ]}
              tableData={[
                [
                  '1',
                  'Andrew Mike',
                  'Develop',
                  '2013',
                  '€ 99,225',
                  fillButtons,
                ],
                ['2', 'John Doe', 'Design', '2012', '€ 89,241', roundButtons],
                ['3', 'Alex Mike', 'Design', '2010', '€ 92,144', simpleButtons],
                [
                  '4',
                  'Mike Monday',
                  'Marketing',
                  '2013',
                  '€ 49,990',
                  roundButtons,
                ],
                [
                  '5',
                  'Paul Dickens',
                  'Communication',
                  '2015',
                  '€ 69,201',
                  fillButtons,
                ],
              ]}
              customCellClasses={[classes.center, classes.right, classes.right]}
              customClassesForCells={[0, 4, 5]}
              customHeadCellClasses={[
                classes.center,
                classes.right,
                classes.right,
              ]}
              customHeadClassesForCells={[0, 4, 5]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Striped Table</h4>
          </CardHeader>
          <CardBody>
            <Table
              striped
              tableHead={[
                '#',
                '',
                'Product Name',
                'Type',
                'Qty',
                'Price',
                'Amount',
              ]}
              tableData={[
                [
                  '1',
                  <Checkbox
                    key="key"
                    className={classes.positionAbsolute}
                    tabIndex={-1}
                    onClick={() => handleToggle(1)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />,
                  'Moleskine Agenda',
                  'Office',
                  '25',
                  '€ 49',
                  '€ 1,225',
                ],
                [
                  '2',
                  <Checkbox
                    key="key"
                    className={classes.positionAbsolute}
                    tabIndex={-1}
                    onClick={() => handleToggle(2)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />,
                  'Stabilo Pen',
                  'Office',
                  '30',
                  '€ 10',
                  '€ 300',
                ],
                [
                  '3',
                  <Checkbox
                    key="key"
                    className={classes.positionAbsolute}
                    tabIndex={-1}
                    onClick={() => handleToggle(3)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />,
                  'A4 Paper Pack',
                  'Office',
                  '50',
                  '€ 10.99',
                  '€ 109',
                ],
                [
                  '4',
                  <Checkbox
                    key="key"
                    className={classes.positionAbsolute}
                    tabIndex={-1}
                    onClick={() => handleToggle(4)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />,
                  'Apple iPad',
                  'Communication',
                  '10',
                  '€ 499.00',
                  '€ 4,990',
                ],
                [
                  '5',
                  <Checkbox
                    key="key"
                    className={classes.positionAbsolute}
                    tabIndex={-1}
                    onClick={() => handleToggle(5)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />,
                  'Apple iPhone',
                  'Communication',
                  '10',
                  '€ 599.00',
                  '€ 5,999',
                ],
                { total: true, colspan: '5', amount: '€12,999' },
              ]}
              customCellClasses={[classes.center, classes.right, classes.right]}
              customClassesForCells={[0, 5, 6]}
              customHeadCellClasses={[
                classes.center,
                classes.right,
                classes.right,
              ]}
              customHeadClassesForCells={[0, 5, 6]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Shopping Cart Table</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHead={[
                '',
                'PRODUCT',
                'COLOR',
                'SIZE',
                'PRICE',
                'QTY',
                'AMOUNT',
                '',
              ]}
              tableData={[
                [
                  <div className={classes.imgContainer} key="key">
                    <img src="/assets/product1.jpg" alt="..." className={classes.img} />
                  </div>,
                  <span key="key">
                    <a href="#jacket" className={classes.tdNameAnchor}>
                      Spring Jacket
                    </a>
                    <br />
                    <small className={classes.tdNameSmall}>
                      by Dolce&amp;Gabbana
                    </small>
                  </span>,
                  'Red',
                  'M',
                  <span key="key">
                    <small className={classes.tdNumberSmall}>€</small>
                    {' '}
                    549
                  </span>,
                  <span key="key">
                    1
                    {' '}
                    <div className={classes.buttonGroup}>
                      <Button
                        color="info"
                        size="sm"
                        round
                        className={classes.firstButton}
                      >
                        <Remove className={classes.icon} />
                      </Button>
                      <Button
                        color="info"
                        size="sm"
                        round
                        className={classes.lastButton}
                      >
                        <Add className={classes.icon} />
                      </Button>
                    </div>
                  </span>,
                  <span key="key">
                    <small className={classes.tdNumberSmall}>€</small>
                    {' '}
                    549
                  </span>,
                  <Button simple className={classes.actionButton} key="key">
                    <Close className={classes.icon} />
                  </Button>,
                ],
                [
                  <div className={classes.imgContainer} key="key">
                    <img src="/assets/product2.jpg" alt="..." className={classes.img} />
                  </div>,
                  <span key="key">
                    <a href="#jacket" className={classes.tdNameAnchor}>
                      Short Pants
                      {' '}
                    </a>
                    <br />
                    <small className={classes.tdNameSmall}>by Pucci</small>
                  </span>,
                  'Purple',
                  'M',
                  <span key="key">
                    <small className={classes.tdNumberSmall}>€</small>
                    {' '}
                    499
                  </span>,
                  <span key="key">
                    2
                    {' '}
                    <div className={classes.buttonGroup}>
                      <Button
                        color="info"
                        size="sm"
                        round
                        className={classes.firstButton}
                      >
                        <Remove className={classes.icon} />
                      </Button>
                      <Button
                        color="info"
                        size="sm"
                        round
                        className={classes.lastButton}
                      >
                        <Add className={classes.icon} />
                      </Button>
                    </div>
                  </span>,
                  <span key="key">
                    <small className={classes.tdNumberSmall}>€</small>
                    {' '}
                    998
                  </span>,
                  <Button simple className={classes.actionButton} key="key">
                    <Close className={classes.icon} />
                  </Button>,
                ],
                [
                  <div className={classes.imgContainer} key="key">
                    <img src="/assets/product3.jpg" alt="..." className={classes.img} />
                  </div>,
                  <span key="key">
                    <a href="#jacket" className={classes.tdNameAnchor}>
                      Pencil Skirt
                    </a>
                    <br />
                    <small className={classes.tdNameSmall}>by Valentino</small>
                  </span>,
                  'White',
                  'XL',
                  <span key="key">
                    <small className={classes.tdNumberSmall}>€</small>
                    {' '}
                    799
                  </span>,
                  <span key="key">
                    1
                    {' '}
                    <div className={classes.buttonGroup}>
                      <Button
                        color="info"
                        size="sm"
                        round
                        className={classes.firstButton}
                      >
                        <Remove className={classes.icon} />
                      </Button>
                      <Button
                        color="info"
                        size="sm"
                        round
                        className={classes.lastButton}
                      >
                        <Add className={classes.icon} />
                      </Button>
                    </div>
                  </span>,
                  <span key="key">
                    <small className={classes.tdNumberSmall}>€</small>
                    {' '}
                    799
                  </span>,
                  <Button simple className={classes.actionButton} key="key">
                    <Close className={classes.icon} />
                  </Button>,
                ],
                {
                  total: true,
                  colspan: '5',
                  amount: (
                    <span key="key">
                      <small>€</small>
                      2,346
                    </span>
                  ),
                },
                {
                  purchase: true,
                  colspan: '6',
                  col: {
                    colspan: 2,
                    text: (
                      <Button color="info" round>
                        Complete Purchase
                        {' '}
                        <KeyboardArrowRight className={classes.icon} />
                      </Button>
                    ),
                  },
                },
              ]}
              tableShopping
              customHeadCellClasses={[
                classes.center,
                classes.description,
                classes.description,
                classes.right,
                classes.right,
                classes.right,
              ]}
              customHeadClassesForCells={[0, 2, 3, 4, 5, 6]}
              customCellClasses={[
                classes.tdName,
                classes.customFont,
                classes.customFont,
                classes.tdNumber,
                `${classes.tdNumber} ${classes.tdNumberAndButtonGroup}`,
                classes.tdNumber,
              ]}
              customClassesForCells={[1, 2, 3, 4, 5, 6]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}
