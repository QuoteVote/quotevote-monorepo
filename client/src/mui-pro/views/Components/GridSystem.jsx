/* eslint-disable */
import React from 'react'

// @material-ui/core components
import { makeStyles } from '@mui/styles'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import Card from 'mui-pro/Card/Card'
import CardBody from 'mui-pro/Card/CardBody'

import styles from 'assets/jss/material-dashboard-pro-react/views/gridSystemStyle'

const useStyles = makeStyles(styles)

export default function GridSystem() {
  const classes = useStyles()
  return (
    <div>
      <h4 className={classes.title}>
        XS Grid
        {' '}
        <small>Always Horizontal</small>
      </h4>
      <GridContainer>
        <GridItem xs={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'xs={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'xs={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'xs={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <h4 className={classes.title}>
        SM Grid
        {' '}
        <small>Collapsed at 768px</small>
      </h4>
      <GridContainer>
        <GridItem xs={12} sm={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'sm={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'sm={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'sm={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <h4 className={classes.title}>
        MD Grid
        {' '}
        <small>Collapsed at 992px</small>
      </h4>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <h4 className={classes.title}>
        LG Grid
        {' '}
        <small>Collapsed at 1200px</small>
      </h4>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'lg={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'lg={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'lg={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <h4 className={classes.title}>
        Mixed Grid
        {' '}
        <small>Showing different sizes on different screens</small>
      </h4>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'sm={6} lg={3}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'sm={6} lg={3}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'sm={6} lg={3}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'sm={6} lg={3}'}</code>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <h4 className={classes.title}>
        Offset Grid
        {' '}
        <small>Adding some space when needed</small>
      </h4>
      <GridContainer
        justify="space-between"
        alignItems="center"
        direction="row"
      >
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={3}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={3}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={3}'}</code>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer justify="space-between">
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={4}'}</code>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardBody style={{ textAlign: 'center' }}>
              <code>{'md={6}'}</code>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <h4 className={classes.title}>Paragraphs</h4>
      <Card>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={6}>
              <h3>Some Title Here</h3>
              <p>
                One morning, when Gregor Samsa woke from troubled dreams, he
                found himself transformed in his bed into a horrible vermin. He
                lay on his armour-like back, and if he lifted his head a little
                he could see his brown belly, slightly domed and divided by
                arches into stiff sections. The bedding was hardly able to cover
                it and seemed ready to slide off any moment. His many legs,
                pitifully thin compared with the size of the rest of him, waved
                about helplessly as he looked.
                {' '}
                &quot;
                What
                &apos;
                s happened to me?
                &quot;
                he thought.
              </p>
            </GridItem>
            <GridItem xs={12} sm={6}>
              <h3>Another Title Here</h3>
              <p>
                One morning, when Gregor Samsa woke from troubled dreams, he
                found himself transformed in his bed into a horrible vermin. He
                lay on his armour-like back, and if he lifted his head a little
                he could see his brown belly, slightly domed and divided by
                arches into stiff sections. The bedding was hardly able to cover
                it and seemed ready to slide off any moment. His many legs,
                pitifully thin compared with the size of the rest of him, waved
                about helplessly as he looked.
                {' '}
                &quot;
                What
                &apos;
                s happened to me?
                &quot; he thought.
              </p>
            </GridItem>
          </GridContainer>
          <br />
          <GridContainer>
            <GridItem xs={12} sm={4}>
              <h3>Some Title Here</h3>
              <p>
                One morning, when Gregor Samsa woke from troubled dreams, he
                found himself transformed in his bed into a horrible vermin. He
                lay on his armour-like back, and if he lifted his head a little
                he could see his brown belly, slightly domed and divided by
                arches into stiff sections. The bedding was hardly able to cover
                it and seemed ready to slide off any moment.
              </p>
            </GridItem>
            <GridItem xs={12} sm={4}>
              <h3>Another Title Here</h3>
              <p>
                One morning, when Gregor Samsa woke from troubled dreams, he
                found himself transformed in his bed into a horrible vermin. He
                lay on his armour-like back, and if he lifted his head a little
                he could see his brown belly, slightly domed and divided by
                arches into stiff sections. The bedding was hardly able to cover
                it and seemed ready to slide off any moment.
              </p>
            </GridItem>
            <GridItem xs={12} sm={4}>
              <h3>Another Title Here</h3>
              <p>
                One morning, when Gregor Samsa woke from troubled dreams, he
                found himself transformed in his bed into a horrible vermin. He
                lay on his armour-like back, and if he lifted his head a little
                he could see his brown belly, slightly domed and divided by
                arches into stiff sections. The bedding was hardly able to cover
                it and seemed ready to slide off any moment.
              </p>
            </GridItem>
          </GridContainer>
          <br />
          <GridContainer>
            <GridItem xs={12} sm={4}>
              <h3>Some Title Here</h3>
              <p>
                One morning, when Gregor Samsa woke from troubled dreams, he
                found himself transformed in his bed into a horrible vermin. He
                lay on his armour-like back, and if he lifted his head a little
                he could see his brown belly, slightly domed and divided by
                arches into stiff sections. The bedding was hardly able to cover
                it and seemed ready to slide off any moment.
              </p>
            </GridItem>
            <GridItem xs={12} sm={8}>
              <h3>Another Title Here</h3>
              <p>
                One morning, when Gregor Samsa woke from troubled dreams, he
                found himself transformed in his bed into a horrible vermin. He
                lay on his armour-like back, and if he lifted his head a little
                he could see his brown belly, slightly domed and divided by
                arches into stiff sections. The bedding was hardly able to cover
                it and seemed ready to slide off any moment. One morning, when
                Gregor Samsa woke from troubled dreams, he found himself
                transformed in his bed into a horrible vermin. He lay on his
                armour-like back, and if he lifted his head a little he could
                see his brown belly, slightly domed and divided by arches into
                stiff sections. The bedding was hardly able to cover it and
                seemed ready to slide off any moment.
              </p>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </div>
  )
}
