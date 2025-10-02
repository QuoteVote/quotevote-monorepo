import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import PropTypes from 'prop-types';
import styles from 'assets/jss/material-dashboard-pro-react/views/landingPageStyle'

import { REQUEST_USER_ACCESS_MUTATION } from '@/graphql/mutations'
import { GET_CHECK_DUPLICATE_EMAIL } from '@/graphql/query'

import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import { Typography, Box } from '@material-ui/core'

import Button from '../../mui-pro/CustomButtons/Button'
import PersonalForm from 'components/RequestAccess/PersonalForm/PersonalForm'
import { set } from "lodash";

const useStyles = makeStyles(styles)

export default function RequestAccessForm({onSuccess}) {
    const classes = useStyles()
    const [userDetails, setUserDetails] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [requestInviteSuccessful, setRequestInviteSuccessful] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()


    const client = useApolloClient()
    const [requestUserAccess, { loading }] = useMutation(REQUEST_USER_ACCESS_MUTATION)

    const onSubmit = async () => {
        setErrorMessage('')
        const pattern = new RegExp (
                  /^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i,
        )

        const isValidEmail = pattern.test(String(userDetails).toLowerCase())
        if (!isValidEmail) {
            setErrorMessage('Please enter a valid email address')
            return
        }
        
        try {
            const { data } = await client.query({
                query: GET_CHECK_DUPLICATE_EMAIL,
                variables: { email: userDetails },
                fetchPolicy: 'network-only',
            })

        const hasDuplicatedEmail = data?.checkDuplicateEmail?.length > 0
        if (hasDuplicatedEmail) {
            setErrorMessage('This email address has already been used to request an invite.')
            return
        }

        if (!Object.keys(errors).length) {
            const requestUserAccessInput = { email: userDetails }
            await requestUserAccess({ variables: { requestUserAccessInput } })
            setRequestInviteSuccessful(true)
            if (onSuccess) onSuccess()
        }
        } catch (err) {
            if (err.message.includes('email: Path `email` is required.')) {
                setErrorMessage('Email is required')
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.')
                console.error(err)  
            }
        }
    }

    if (requestInviteSuccessful) {
        return <PersonalForm requestInviteSuccessful={requestInviteSuccessful}  />
    }

    const duplicate = <Typography style={{color: 'red',textAlign: 'center', marginTop: '1rem'}}>{errorMessage}</Typography>

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
            spacing={2}
            >
                <Grid item xs={12}>
                    <Typography variant="body1" style={{textAlign: 'center', color: "#000", marginBottom: '1rem'}}>
                         You need an account to contribute. Viewing is public, but posting, voting, and quoting require an invite.
                    </Typography>
                    <Input
                        disableUnderline
                        placeholder="Enter Your Email Address"
                        type="email"
                        className={classes.input}
                        value={userDetails}
                        onChange={(event) => setUserDetails(event.target.value)}
                        onKeyPress={(event) => event.key === 'Enter' && onSubmit()}
                        style={{width: '100%'}}
                    />
                    <Button
                        className={classes.requestAccessBtn}
                        onClick={onSubmit}
                        disabled={loading}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {loading ? 'Sending...' : 'Request Invite'}
                    </Button>
                    {errorMessage && duplicate}
                </Grid>
            </Grid>
    )
}

RequestAccessForm.propTypes = {
    onSuccess: PropTypes.func,
}