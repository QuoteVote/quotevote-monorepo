import Card from 'mui-pro/Card/Card'
import CardBody from 'mui-pro/Card/CardBody'
import CardFooter from 'mui-pro/Card/CardFooter'
import CardHeader from 'mui-pro/Card/CardHeader'
import Divider from '@mui/material/Divider'
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'

// import Content from "../components/ContentList";

// import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

import FaceIcon from '@mui/icons-material/Face'
import Skeleton from '@mui/material/Skeleton'

const PostPageSkeleton = () => (
  <div>
    <GridContainer spacing={1} direction="col">
      <GridItem xs={6}>
        <Card style={{ height: '800px' }}>
          <CardHeader style={{ zIndex: 0 }}>
            <div
              style={{
                display: 'flex',
                direction: 'row',
                justifyContent: 'space-between',
                zIndex: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  direction: 'row',
                  alignContent: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    direction: 'row',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <p
                    style={{
                      color: '#E91E63',
                      fontSize: '25px',
                      font: 'League Spartan',
                      fontWeight: 'bold',
                    }}
                  >
                    <Skeleton variant="text" width={210} />
                  </p>
                  <img
                    alt="chat"
                    src="/assets/Chat.svg"
                    style={{ height: '20px', paddingLeft: '10px' }}
                  />
                </div>
                <div
                  style={{
                    color: '#E91E63',
                    fontSize: '25px',
                    font: 'League Spartan',
                    fontWeight: 'bold',
                  }}
                >
                  <p>
                    <Skeleton variant="text" width={50} />
                  </p>
                  <img
                    alt="share"
                    src="/assets/Send.svg"
                    style={{
                      height: '15px',
                      paddingLeft: '15px',
                      paddingTop: '3px',
                    }}
                  />
                  <img
                    alt="bookmark"
                    src="/assets/Heart.svg"
                    style={{
                      height: '15px',
                      paddingLeft: '15px',
                      paddingTop: '3px',
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  direction: 'row',
                  justifyContent: 'flex-end',
                  flexBasis: '100px',
                }}
              >
                <p>
                  <Skeleton variant="text" width={50} />
                </p>
                <img
                  alt="share"
                  src="/assets/Send.svg"
                  style={{
                    height: '15px',
                    paddingLeft: '15px',
                    paddingTop: '3px',
                  }}
                />
                <img
                  alt="favorite"
                  src="/assets/Heart.svg"
                  style={{
                    height: '15px',
                    paddingLeft: '15px',
                    paddingTop: '3px',
                  }}
                />
              </div>
            </div>
            <Divider />
          </CardHeader>
          <CardBody>
            <Skeleton variant="text" width={500} />
            <Skeleton variant="text" width={500} />
            <Skeleton variant="text" width={250} />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={6} style={{ paddingBottom: 0 }}>
        <Card>
          <CardHeader>
            <div
              style={{
                display: 'flex',
                direction: 'row',
                justifyContent: 'space-between',
              }}
            >
              <p
                style={{
                  color: '#E91E63',
                  fontSize: '25px',
                  font: 'League Spartan',
                  fontWeight: 'bold',
                }}
              >
                Comments
              </p>
            </div>
            <Divider />
          </CardHeader>
        </Card>

        <Card>
          <CardBody>
            <p style={{ fontSize: 12 }}>
              <span
                style={{
                  height: 60,
                  width: 60,
                  backgroundColor: '#df2769',
                  float: 'left',
                  margin: '0px 10px 10px 0px',
                  textAlign: 'center',
                  borderRadius: 3,
                  paddingTop: 17,
                }}
              >
                <FaceIcon />
              </span>
              <h5 style={{ margin: 0 }}>
                <Skeleton variant="text" width={100} />
              </h5>
              <Skeleton variant="text" width={500} />
              <Skeleton variant="text" width={500} />
              <Skeleton variant="text" width={250} />
            </p>
          </CardBody>
          <CardFooter chart testimonial>
            <span style={{ float: 'right' }}>
              <Skeleton variant="text" width={250} />
            </span>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  </div>
)

export default PostPageSkeleton
