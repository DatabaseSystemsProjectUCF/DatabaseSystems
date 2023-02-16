/** ----------------------- IMPORTS ----------------------- */
import axios from 'axios'
import { USER } from '../constants/DatabaseConstants'
import background from '../images/ucf_campus.jpg'
import React, { useRef, useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
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

        <div>
            {/** Background Image */}
            <div style={{backgroundImage: `url(${background})`, height: '100vh', width:'201.3vh', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity:'65%'}}> </div>

            {/** Title and Group Members */}
            <Container className= "rounded-5 border border-2 border-light text-center" style={{display:'flex', position: 'fixed', left: '125px', bottom: '15%', height:'200px', width: '750px', backgroundColor:'#000000'}}>
                
                {/** Title */}
                <Card className="border-0" style={{top:'33px', backgroundColor: 'rgba(255,255,255,0)', fontWeight: 'bold', fontSize: '38px', color:'#BA9B37', width:'100%'}}>
                    Welcome to University Event Database
                </Card>

                <div style={{width: '85%', height:'1px', backgroundColor: '#BA9B37', position: 'absolute', top: '125px', left:'7.5%'}}></div>

                {/** Group Members */}
                <Card className="border-0" style={{position:'absolute', top:'150px', backgroundColor: 'rgba(255,255,255,0)', fontWeight: 'bold', color:'#BA9B37', fontSize: '14px', width:'100%'}}>
                    By: Daniela, Juan, Usman
                </Card>

            </Container>

            {/** Login Component */}
            <Container style = {{ display:'flex', position: 'fixed', right: '50px', bottom: '100px', width:'500px'}}>

                {/** Display Error if it exists */}
                {error && <Alert variant="danger"> {error} </Alert>}

                {/** Display Success if it exists */}
                {success && <Alert variant="success"> {success} </Alert>}
                
                {/** Login Card */}
                <Card className="rounded-5 border border-5 border-light" style={{ height:'450px', width:'500px', backgroundColor:'#000000'}}>

                {/** Card Body */}
                <Card.Body>

                    {/** Login Main Display */}
                    <h2 className="text-center mt-3" style={{color:'#ffffff', fontSize:'25px'}}>Register Your Account</h2>
                    
                    {/** Handle Submit */}
                    <Form onSubmit={handleSubmit}>

                        {/** Username Section */}
                        <Form.Group id="username">
                            <Form.Label className="mt-3" style={{fontWeight:'bold', color:'#ffffff', position:'relative', top:'10px'}}>USERNAME</Form.Label>
                                <Form.Control 
                                    className="square border border-1 border-dark mt-2" 
                                    type="username" 
                                    ref={usernameRef} 
                                    style={{backgroundColor:'#f2ecd9'}}
                                    placeholder="Enter your username...">
                                </Form.Control>
                        </Form.Group>

                        {/** Password Section */}
                        <Form.Group id="password">
                            <Form.Label className="mt-3" style={{fontWeight:'bold', color:'#ffffff'}}>PASSWORD</Form.Label>
                                <Form.Control 
                                    className="square border border-1 border-dark" 
                                    type="password" 
                                    ref={passwordRef} 
                                    style={{backgroundColor:'#f2ecd9'}}
                                    placeholder="Enter your password...">
                                </Form.Control>
                        </Form.Group>

                        {/** Confirm Password Section */}
                        <Form.Group id="confirmPassword">
                            <Form.Label className="mt-3" style={{fontWeight:'bold', color:'#ffffff'}}>CONFIRM PASSWORD</Form.Label>
                                <Form.Control 
                                    className="square border border-1 border-dark" 
                                    type="password" 
                                    ref={confirmPasswordRef} 
                                    style={{backgroundColor:'#f2ecd9'}}
                                    placeholder="Enter your password...">
                                </Form.Control>
                        </Form.Group>

                        {/** Signup Button */}
                        <Button disabled={loading} 
                            className="square border border-0 w-100 mt-1" 
                            type="submit" 
                            style={{position:'relative', top:'30px', backgroundColor:'#BA9B37'}}>
                                Sign Up
                        </Button>

                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}
