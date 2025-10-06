import React from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import BusinessForm from './BusinessForm'
import styles from '../requestAccessStyles'

export default {
  component: BusinessForm,
  title: 'Request Access',
}

const useStyles = makeStyles(styles)

function Wrapper() {
  const defaultValues = {
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
  }
  const {
    register, errors, handleSubmit,
  } = useForm({ defaultValues })
  const classes = useStyles()

  return (
    <BusinessForm
      classes={classes}
      errors={errors}
      handleSubmit={handleSubmit}
      register={register}
    />
  )
}

export const BusinessFormContent = () => <Wrapper />
