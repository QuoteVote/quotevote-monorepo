import { Grid, Typography } from '@mui/material'
import { Skeleton } from '@mui/lab'
import React from 'react'
import CardBody from '../../mui-pro/Card/CardBody'
import Card from '../../mui-pro/Card/Card'

function SubmitPostSkeleton() {
  const variants = ['h2', 'h4', 'h4', 'caption']
  return (
    <Card>
      <CardBody>
        {variants.map((variant, index) => (
          <Typography component="div" key={index} variant={variant}>
            <Skeleton />
          </Typography>
        ))}
        <Grid
          container
          justify="flex-end"
        >
          <Skeleton variant="rect" width={100} height={35} />
        </Grid>
      </CardBody>
    </Card>
  )
}

export default SubmitPostSkeleton
