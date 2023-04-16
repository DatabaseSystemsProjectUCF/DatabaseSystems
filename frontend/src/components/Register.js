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
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
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

            console.log(firstNameRef.current.value)
            console.log(lastNameRef.current.value)
            console.log(emailRef.current.value)
            console.log(passwordRef.current.value)
            console.log(confirmPasswordRef.current.value)

            axios.post("http://localhost:8800/user/register", {

                first_name: firstNameRef.current.value,
                last_name: lastNameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value

            }).then((response) => {

                console.log(response)

                setSuccess('Register Successful! Redirecting to Login...')
                setTimeout(function(){navigate('/login')}, 1000)

            }).catch((auth_error) => {

                // If the university doesn't exist
                if(auth_error.response.status === 401){
                    setError("University with email domain doesn't exist.")
                    console.log(auth_error.response.data)
                }
                else if(auth_error.response.status === 403){
                    setError("Not sure!")
                    console.log(auth_error.response.data)
                }
            })
        }
        catch (err) {
            setError(err)
        }

        // Set Loading to false so signup button is available again
        setLoading(false)
    }

    function onFirstNameChange(e) {
        const re = /^[A-Za-z]+$/

        // if value is not blank, then test the regex
        if (e.target.value === '' || re.test(e.target.value)) {
            setFirstName(e.target.value)
        }

        else e.target.value = firstName;
    }

    function onLastNameChange(e) {
        const re = /^[A-Za-z]+$/

        // if value is not blank, then test the regex
        if (e.target.value === '' || re.test(e.target.value)) {
            setLastName(e.target.value)
        }

        else e.target.value = lastName;
    }

    // Return Register elements to be displayed
    return (

        <div>
            {/** Background Image */}
            <div style={{backgroundImage: `url(${background})`, height: '100vh', width:'100vw', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity:'65%'}}> </div>

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

            {/** Register Component */}
            <Container style = {{ display:'flex', position: 'fixed', right: '50px', bottom: '7.5%', width:'500px'}}>

                {/** Display Error if it exists */}
                {error && <Alert variant="danger"> {error} </Alert>}

                {/** Display Success if it exists */}
                {success && <Alert variant="success"> {success} </Alert>}
                
                {/** Login Card */}
                <Card className="rounded-5 border border-5 border-light" style={{ height:'650px', width:'500px', backgroundColor:'#000000'}}>

                    {/** Card Body */}
                    <Card.Body>

                        {/** Login Main Display */}
                        <h2 className="text-center mt-4" style={{color:'#ffffff', fontSize:'25px'}}>Register Your Account</h2>
                        
                        {/** Handle Submit */}
                        <Form onSubmit={handleSubmit}>

                            {/** First Name Section */}
                            <Form.Group id="first-name">
                                <Form.Label className="mt-5" style={{fontWeight:'bold', color:'#ffffff', position:'relative', top:'10px'}}>FIRST NAME</Form.Label>
                                    <Form.Control 
                                        onChange={onFirstNameChange}
                                        className="square border border-1 border-dark mt-2" 
                                        type="text"
                                        ref={firstNameRef} 
                                        style={{backgroundColor:'#f2ecd9', width:'45%'}}
                                        placeholder="Enter your first name...">
                                    </Form.Control>
                            </Form.Group>

                            {/** Last Name Section */}
                            <Form.Group id="last-name">
                                <Form.Label className="mt-5" style={{fontWeight:'bold', color:'#ffffff', position:'absolute', marginLeft: '47.5%', top:'13.5%'}}>LAST NAME</Form.Label>
                                    <Form.Control 
                                        onChange={onLastNameChange}
                                        className="square border border-1 border-dark" 
                                        type="text"
                                        ref={lastNameRef} 
                                        style={{backgroundColor:'#f2ecd9', width:'45%', marginLeft: '47.5%', position: 'absolute', top: '25.9%'}}
                                        placeholder="Enter your last name...">
                                    </Form.Control>
                            </Form.Group>

                            {/** Email Section */}
                            <Form.Group id="email">
                                <Form.Label className="mt-2" style={{fontWeight:'bold', color:'#ffffff', position:'relative', top:'10px'}}>EMAIL</Form.Label>
                                    <Form.Control 
                                        className="square border border-1 border-dark mt-2" 
                                        type="email"
                                        ref={emailRef} 
                                        style={{backgroundColor:'#f2ecd9'}}
                                        placeholder="Enter your email...">
                                    </Form.Control>
                            </Form.Group>

                            {/** Password Section */}
                            <Form.Group id="password">
                                <Form.Label className="mt-4" style={{fontWeight:'bold', color:'#ffffff'}}>PASSWORD</Form.Label>
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
                                className="square border border-0 w-100" 
                                type="submit" 
                                style={{position:'relative', top:'30px', backgroundColor:'#BA9B37'}}>
                                    Sign Up
                            </Button>

                            {/* link to signup if account doesn't exist yet */}
                            <div className="w-100 text-center mt-5" style={{color:'#ffffff'}}>
                                Already have an Account? <Link to='/Login' style={{fontStyle:'italic', fontWeight:'bold', color:'#ffffff'}}>Login</Link>
                            </div>

                            {/* link to signup if account doesn't exist yet */}
                            <div className="w-100 text-center mt-1" style={{color:'#ffffff'}}>
                                Register a University? <Link to='/RegisterAdmin' style={{fontStyle:'italic', fontWeight:'bold', color:'#ffffff'}}>Register as Admin</Link>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}
