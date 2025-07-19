import React from 'react'
import { Card, CardActions, CardContent, CardHeader, Grid, Skeleton } from '@mui/material'
function PostSkeleton() {
  return (
    <Card>
      <CardHeader
        title={(
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item>
              <Skeleton variant="rect" width={200} style={{ marginRight: 10 }} />
            </Grid>
            <Grid item>
              <Skeleton variant="circle" width={30} height={30} />
            </Grid>
            <Grid item>
              <Skeleton variant="circle" width={30} height={30} />
            </Grid>
          </Grid>
        )}
        action={(
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            style={{ marginTop: 15 }}
          >
            <Grid item>
              <Skeleton variant="rect" width={30} style={{ marginRight: 5 }} />
            </Grid>
            <Grid item>
              {' '}
              /
              {' '}
            </Grid>
            <Grid item>
              <Skeleton variant="rect" width={30} style={{ marginLeft: 5 }} />
            </Grid>
          </Grid>
        )}
      />
      <CardHeader
        style={{ padding: 0, marginLeft: 15 }}
        avatar={(
          <Skeleton variant="circle" width={50} height={50} />
        )}
        title={<Skeleton variant="rect" width={80} style={{ marginBottom: 5 }} />}
        subheader={<Skeleton variant="rect" width={130} />}
      />
      <CardContent>
        <Skeleton animation="wave" height={30} />
        <Skeleton animation="wave" height={30} />
        <Skeleton animation="wave" height={30} />
        <Skeleton animation="wave" height={30} width="50%" />
      </CardContent>
      <CardActions disableSpacing style={{ marginLeft: 5 }}>
        <Skeleton variant="rect" height={30} width={130} style={{ marginRight: 5 }} />
        <Skeleton variant="rect" height={30} width={130} />
        <Skeleton variant="circle" width={30} height={30} style={{ marginLeft: 'auto' }} />
        <Skeleton variant="circle" width={30} height={30} style={{ marginRight: 5, marginLeft: 5 }} />
        <Skeleton variant="circle" width={30} height={30} />
      </CardActions>
    </Card>
  )
}

export default PostSkeleton
