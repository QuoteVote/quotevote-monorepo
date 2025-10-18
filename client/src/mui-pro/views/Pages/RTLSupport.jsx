// @mui core components
import { makeStyles } from '@mui/styles'
import Icon from '@mui/material/Icon'
// @material-ui/icons
// import Weekend from "@material-ui/icons/Weekend";
import Home from '@mui/icons-material/Home'
import BugReport from '@mui/icons-material/BugReport'
import Code from '@mui/icons-material/Code'
import Cloud from '@mui/icons-material/Cloud'
import FormatQuote from '@mui/icons-material/FormatQuote'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import Table from 'mui-pro/Table/Table'
import Timeline from 'mui-pro/Timeline/Timeline'
import Button from 'mui-pro/CustomButtons/Button'
import CustomTabs from 'mui-pro/CustomTabs/CustomTabs'
import Tasks from 'mui-pro/Tasks/Tasks'
import Card from 'mui-pro/Card/Card'
import CardHeader from 'mui-pro/Card/CardHeader'
import CardAvatar from 'mui-pro/Card/CardAvatar'
import CardText from 'mui-pro/Card/CardText'
import CardBody from 'mui-pro/Card/CardBody'
import CardFooter from 'mui-pro/Card/CardFooter'

import {
  rtlStories,
  rtlBugs,
  rtlWebsite,
  rtlServer,
} from 'variables/general'

// import image from '/assets/faces/card-profile1-square.jpg'

import {
  cardTitle,
  roseColor,
} from 'assets/jss/material-dashboard-pro-react'

const styles = {
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: '#FFFFFF',
    marginTop: '0',
  },
  cardCategoryWhite: {
    margin: '0',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '.875rem',
  },
  cardCategory: {
    color: '#999999',
    marginTop: '10px',
  },
  icon: {
    color: '#333333',
    margin: '10px auto 0',
    width: '130px',
    height: '130px',
    border: '1px solid #E5E5E5',
    borderRadius: '50%',
    lineHeight: '174px',
    '& svg': {
      width: '55px',
      height: '55px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      width: '55px',
      fontSize: '55px',
    },
  },
  iconRose: {
    color: roseColor,
  },
  marginTop30: {
    marginTop: '30px',
  },
  testimonialIcon: {
    marginTop: '30px',
    '& svg': {
      width: '40px',
      height: '40px',
    },
  },
  cardTestimonialDescription: {
    fontStyle: 'italic',
    color: '#999999',
  },
}

const useStyles = makeStyles(styles)

export default function RTLSupport() {
  const classes = useStyles()
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={6}>
          <Card>
            <CardHeader color="warning" text>
              <CardText color="warning">
                <h4 className={classes.cardTitleWhite}>لتكاليف يبق</h4>
                <h4 className={classes.cardCategoryWhite}>
                  بالإنزال وفي. خيار ومضى العمليات تم ذلك, تم معقل مرمى
                </h4>
              </CardText>
            </CardHeader>
            <CardBody>
              <Table
                hover
                tableHeaderColor="warning"
                tableHead={[
                  'وتم',
                  'لأمريكية هذا',
                  'شاسعالأمريكية',
                  'الأمريكية ',
                ]}
                tableData={[
                  ['وا حد', 'السبب وفرنسا الصينية ', '$36,738', 'تكاليف'],
                  ['إثنان', 'بمباركة بها ', '$23,789', 'الأمريكية من'],
                  ['ثلاثة', ' شاسعالأمريكية ', '$56,142', 'السفن وعُرفت'],
                  ['أربعة', ' الاندونيسية', '$38,735', ' فصل.'],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={6}>
          <CustomTabs
            rtlActive
            title="منتصف:"
            headerColor="rose"
            tabs={[
              {
                tabName: 'ضرب',
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={rtlBugs}
                  />
                ),
              },
              {
                tabName: 'السفن',
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={rtlWebsite}
                  />
                ),
              },
              {
                tabName: 'فصل.',
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={rtlServer}
                  />
                ),
              },
            ]}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <GridContainer>
            <GridItem xs={12} sm={12} lg={6}>
              <Card pricing>
                <CardBody pricing>
                  <h6 className={classes.cardCategory}>جيوب سليمان، الإنزال</h6>
                  <div className={classes.icon}>
                    <Home className={classes.iconRose} />
                  </div>
                  <h3 className={`${classes.cardTitle} ${classes.marginTop30}`}>
                    $29
                  </h3>
                  <p className={classes.cardDescription}>
                    الأجل المتساقطة، من. عرض بسبب وأكثرها الاندونيسية بـ.
                  </p>
                  <Button round color="rose">
                    حاملات فعل
                  </Button>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} lg={6}>
              <Card pricing plain>
                <CardBody pricing plain>
                  <h6 className={classes.cardCategory}>المتحدة لتقليعة</h6>
                  <div className={classes.icon}>
                    <Icon className={classes.iconWhite}>weekend</Icon>
                  </div>
                  <h3 className={`${classes.cardTitle} ${classes.marginTop30}`}>
                    قائمة
                  </h3>
                  <p className={classes.cardCategory}>
                    الأجل المتساقطة، من. عرض بسبب وأكثرها الاندونيسية بـ.
                  </p>
                  <Button round color="white">
                    حاملات فعل
                  </Button>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={11}>
              <Card testimonial>
                <div className={classes.testimonialIcon}>
                  <FormatQuote />
                </div>
                <CardBody>
                  <h5 className={classes.cardTestimonialDescription}>
                    بعد و وسوء الأحمر, دون عقبت الهادي أم, قد حول قادة حكومة
                    يتعلّق. أخذ حصدت اوروبا أن, كلا مهمّات اسبوعين التخطيط عل.
                    وإيطالي الأوروبي و نفس. صفحة احداث أضف ان, هو مرجع نهاية
                    لهيمنة كما. تم مايو لفشل المدن دول, جعل أن عسكرياً التّحول
                    استرجاع.
                  </h5>
                </CardBody>
                <CardFooter testimonial>
                  <h4 className={classes.cardTitle}>أليك طومسون</h4>
                  <h6 className={classes.cardCategory}>أليك طومسون@</h6>
                  <CardAvatar testimonial testimonialFooter>
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img src="/assets/faces/card-profile1-square.jpg" alt="..." />
                    </a>
                  </CardAvatar>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Timeline simple stories={rtlStories} />
        </GridItem>
      </GridContainer>
    </div>
  )
}
