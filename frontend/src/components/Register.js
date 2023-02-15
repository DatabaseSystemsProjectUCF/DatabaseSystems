/** ----------------------- IMPORTS ----------------------- */
import axios from 'axios'
import { USER } from '../constants/DatabaseConstants'
import React, { useRef, useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { v4 as uuid } from 'uuid'
/** ------------------------------------------------------- */

/**
 * Main function for Dashboard that returns all elements to be shown on Dashboard
 * 
 * @returns Dashboard Layout
 */
export default function Register() {

    // Register Form refs and useStates
    const usernameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    // useNavigate Instance
    const navigate = useNavigate()

    /**
     * Function to handle SignUp Submit
     * 
     */
    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)

            // If passwords don't match
            if(passwordRef.current.value !== confirmPasswordRef.current.value){
                setLoading(false)
                return setError('Passwords do not match!')
            }

            // New Date instance
            const today = new Date()
            const new_date = today.getFullYear() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getDate()

            // Send attributes to the API
            axios.post("http://localhost:8800/register", {

                id: uuid(),
                username: usernameRef.current.value.toLowerCase(),
                password: passwordRef.current.value.toLowerCase(),
                authLevel: USER,
                createTime: new_date

            }).then((response) => {

                console.log(response)

                // Redirect to login after a delay
                setSuccess('Success! Redirecting to login... ')
                setTimeout(function(){navigate("/Login")}, 1250)

            }).catch((error) => {

                // If there's an uncaught error from DB Response
                if(error.response.status === 400){
                    setError('Unfortunately, something went wrong!')
                    console.log(error.response.data)
                }

            })
        }
        catch (err) {
            setError(err)
        }

        // Set Loading to false so signup button is available again
        setLoading(false)
    }

    // Return Register elements to be displayed
    return (

        // Main Container
        <Container fluid style = {{width: '400px', height: '600px'}}>
            
            {/** Signup Card */}
            <Card>

                {/** Card Body */}
                <Card.Body>

                    {/** Login Main Display */}
                    <h2 className="text-center mb-4">Register</h2>
                    
                    {/** Display Error if it exists */}
                    {error && <Alert variant="danger"> {error} </Alert>}

                    {/** Display success if it exists */}
                    {success && <Alert variant="success"> {success} </Alert>}
                    
                    {/** Handle Submit */}
                    <Form onSubmit={handleSubmit}>

                    {/** Username Section */}
                    <Form.Group id="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" ref={usernameRef}></Form.Control>
                    </Form.Group>

                    {/** Password Section */}
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef}></Form.Control>
                    </Form.Group>

                    {/** Confirm Password Section */}
                    <Form.Group id="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={confirmPasswordRef}></Form.Control>
                    </Form.Group>

                    {/** Signup Button */}
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Sign Up</Button>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}
