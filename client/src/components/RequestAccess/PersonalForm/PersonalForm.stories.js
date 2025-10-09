import React from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import PersonalForm from './PersonalForm'
import styles from '../requestAccessStyles'

export default {
  component: PersonalForm,
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
    <PersonalForm
      classes={classes}
      errors={errors}
      handleSubmit={handleSubmit}
      register={register}
    />
  )
}

export const PersonalFormContent = () => <Wrapper />
