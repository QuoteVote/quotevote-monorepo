import React from 'react'
// react component for creating dynamic tables
import ReactTable from 'react-table'

// @mui/material components
import { makeStyles } from '@mui/material/styles'
// @mui/icons-material
import Assignment from '@mui/icons-material/Assignment'
import Dvr from '@mui/icons-material/Dvr'
import Favorite from '@mui/icons-material/Favorite'
import Close from '@mui/icons-material/Close'
// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import Button from 'mui-pro/CustomButtons/Button'
import Card from 'mui-pro/Card/Card'
import CardBody from 'mui-pro/Card/CardBody'
import CardIcon from 'mui-pro/Card/CardIcon'
import CardHeader from 'mui-pro/Card/CardHeader'

import { dataTable } from 'variables/general'

import { cardTitle } from 'assets/jss/material-dashboard-pro-react'

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: '15px',
    marginBottom: '0px',
  },
}

const useStyles = makeStyles(styles)

export default function ReactTables() {
  const [data, setData] = React.useState(
    dataTable.dataRows.map((prop, key) => ({
      id: key,
      name: prop[0],
      position: prop[1],
      office: prop[2],
      age: prop[3],
      actions: (
      // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a like kind of action */}
          <Button
            justIcon
            round
            simple
            onClick={() => {
              // const obj = data.find((o) => o.id === key)
              // console.log(
              //   `You've clicked LIKE button on \n{ \nName: ${
              //     obj.name
              //   }, \nposition: ${
              //     obj.position
              //   }, \noffice: ${
              //     obj.office
              //   }, \nage: ${
              //     obj.age
              //   }\n}.`
              // )
            }}
            color="info"
            className="like"
          >
            <Favorite />
          </Button>
          {' '}
          {/* use this button to add a edit kind of action */}
          <Button
            justIcon
            round
            simple
            onClick={() => {
              // const obj = data.find((o) => o.id === key)
              // console.log(
              //   `You've clicked EDIT button on \n{ \nName: ${
              //     obj.name
              //   }, \nposition: ${
              //     obj.position
              //   }, \noffice: ${
              //     obj.office
              //   }, \nage: ${
              //     obj.age
              //   }\n}.`
              // )
            }}
            color="warning"
            className="edit"
          >
            <Dvr />
          </Button>
          {' '}
          {/* use this button to remove the data row */}
          <Button
            justIcon
            round
            simple
            onClick={() => {
              const newData = data
              newData.find((o, i) => {
                if (o.id === key) {
                  // here you should add some custom code so you can delete the data
                  // from this component and from your server as well
                  newData.splice(i, 1)
                  return true
                }
                return false
              })
              setData([...newData])
            }}
            color="danger"
            className="remove"
          >
            <Close />
          </Button>
          {' '}
        </div>
      ),
    }))
  )
  const classes = useStyles()
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>React Table</h4>
          </CardHeader>
          <CardBody>
            <ReactTable
              data={data}
              filterable
              columns={[
                {
                  Header: 'Name',
                  accessor: 'name',
                },
                {
                  Header: 'Position',
                  accessor: 'position',
                },
                {
                  Header: 'Office',
                  accessor: 'office',
                },
                {
                  Header: 'Age',
                  accessor: 'age',
                },
                {
                  Header: 'Actions',
                  accessor: 'actions',
                  sortable: false,
                  filterable: false,
                },
              ]}
              defaultPageSize={10}
              showPaginationTop
              showPaginationBottom={false}
              className="-striped -highlight"
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}
