/** ----------------------- IMPORTS ----------------------- */
import '../styles/RegisterAdmin.css'

import axios from 'axios'
import { USER } from '../constants/DatabaseConstants'
import background from '../images/ucf_campus.jpg'
import React, { useRef, useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
/** ------------------------------------------------------- */

/**
 * Main function for Dashboard that returns all elements to be shown on Dashboard
 * 
 * @returns Dashboard Layout
 */
export default function RegisterAdmin() {

    // Register Form refs and useStates
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const univNameRef = useRef()
    const univDescRef = useRef()
    const univNoStudentsRef = useRef()
    const univLocNameRef = useRef()
    const univLocLatRef = useRef()
    const univLocLongRef = useRef()
    const [number, setNumber] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    // useNavigate Instance
    const navigate = useNavigate()

    /**
     * Function to restrict the user into entering only numbers.
     * 
     * @param {*} event character typed 
     */
    function onStudentChange(e) {
        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex
        if (e.target.value === '' || re.test(e.target.value)) {
            setNumber(e.target.value)
        }
        else e.target.value = number;
    }

    /**
     * Function to handle SignUp Submit
     * 
     */
    async function handleSubmit(e){
        e.preventDefault()

        // Lat/Long Regex
        const latreg = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
        const longreg = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/

        try{
            setError('')
            setLoading(true)

            // If passwords don't match
            if(passwordRef.current.value !== confirmPasswordRef.current.value){
                setLoading(false)
                return setError('Passwords do not match!')
            }

            // Lat/Long string validations
            univLocLatRef.current.value = univLocLatRef.current.value.replace(' ', '')
            univLocLongRef.current.value = univLocLongRef.current.value.replace(' ', '')

            if(!latreg.test(univLocLatRef.current.value)){
                setLoading(false)
                return setError('Latitude is in the wrong format!')
            }

            if(!longreg.test(univLocLongRef.current.value)){
                setLoading(false)
                return setError('Longitude is in the wrong format!')
            }
            
            console.log('First Name: ', firstNameRef.current.value)
            console.log('Last Name: ', lastNameRef.current.value)
            console.log('Password: ', passwordRef.current.value)
            console.log('Confirm Password: ', confirmPasswordRef.current.value)
            console.log('University Name: ', univNameRef.current.value)
            console.log('University Description', univDescRef.current.value)
            console.log('No. of students: ', univNoStudentsRef.current.value)
            console.log('Location Name: ', univLocNameRef.current.value)
            console.log('Latitude: ', univLocLatRef.current.value)
            console.log('Longitude: ', univLocLongRef.current.value)
            
            // Call the Login API
            
            axios.post("http://localhost:8800/university/create_profile", {

                name: univNameRef.current.value,
                description: univDescRef.current.value,
                no_students: univNoStudentsRef.current.value,
                first_name: firstNameRef.current.value,
                last_name: lastNameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                loc_name: univLocNameRef.current.value,
                longitude: univLocLongRef.current.value,
                latitude: univLocLatRef.current.value,

            }).then((response) => {

                console.log(response)

                // Populate browser with the returned User
                // localStorage.setItem(AUTHLEVEL, response.data[0].auth_level)
                // localStorage.setItem(CREATETIME, response.data[0].create_time)
                // localStorage.setItem(ID, response.data[0].user_id)
                // localStorage.setItem(USERNAME, response.data[0].username)

                setSuccess('Admin Registered! Redirecting to Login...')
                setTimeout(function(){navigate('/')}, 1000)

            }).catch((auth_error) => {

                // If the domain already exists
                if(auth_error.response.status === 401){
                    setError('University with domain entered already exists')
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

    // Return Register elements to be displayed
    return (

        <div style={{height: '100vh', width: '100vw'}}>
            {/** Background Image */}
            <div style={{backgroundImage: `url(${background})`, height: '100vh', width:'100vw', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity:'65%'}}> </div>

            {/** Admin Signup Component */}
            <Container className='back-drop rounded-4 border-2 border-dark'>

                {/** Display Error if it exists */}
                {error && <Alert variant="danger" style={{marginLeft:'2.5%', width:'95%', textAlign: 'center'}}> {error} </Alert>}

                {/** Display Success if it exists */}
                {success && <Alert variant="success" style={{marginLeft:'2.5%', width:'95%', textAlign: 'center'}}> {success} </Alert>}

                {/** Heading */}
                <h2 className='heading'>Register As an Admin</h2>
                <div className='line' />
                {/** Form */}
                <Form className='form' onSubmit={handleSubmit}>
                    {/** Admin Section */}
                    <h2 className='section-header' style={{marginTop: '1%'}}>Account</h2>
                    <div className='section-line' />

                    {/** First name */}
                    <Form.Group className='first-name'>
                        <Form.Label className='form-label'>Admin First Name</Form.Label>
                            <Form.Control 
                                ref={firstNameRef} 
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="Enter your first name...">
                            </Form.Control>
                    </Form.Group>
                    {/** First name */}
                    <Form.Group className='last-name'>
                        <Form.Label className='form-label'>Admin Last Name</Form.Label>
                            <Form.Control 
                                ref={lastNameRef} 
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="Enter your last name...">
                            </Form.Control>
                    </Form.Group>
                    {/** Email */}
                    <Form.Group className='email'>
                        <Form.Label className='form-label'>Admin Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                ref={emailRef} 
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="Enter your email...">
                            </Form.Control>
                    </Form.Group>
                    {/** Password */}
                    <Form.Group className='center-form-item'>
                        <Form.Label className='form-label'>Admin Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                ref={passwordRef} 
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="Enter your password...">
                            </Form.Control>
                    </Form.Group>
                    {/** Confirm Password */}
                    <Form.Group className='right-form-item'>
                        <Form.Label className='form-label'>Confrim Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                ref={confirmPasswordRef} 
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="Enter your password again...">
                            </Form.Control>
                    </Form.Group>
                    
                    {/** University Section */}
                    <h2 className='section-header' style={{marginTop: '8%'}}>University</h2>
                    <div className='section-line' />

                    {/** Name */}
                    <Form.Group className='name'>
                        <Form.Label className='form-label'>Name</Form.Label>
                            <Form.Control 
                                ref={univNameRef}
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="University Name...">
                            </Form.Control>
                    </Form.Group>
                    {/** Description */}
                    <Form.Group className='description'>
                        <Form.Label className='form-label'>Description</Form.Label>
                            <Form.Control 
                                ref={univDescRef}
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="University description...">
                            </Form.Control>
                    </Form.Group>
                    {/** No. of Students */}
                    <Form.Group className='no-of-students' style={{marginTop:'7%'}}>
                        <Form.Label className='form-label'>No. of Students</Form.Label>
                            <Form.Control
                                onChange = {onStudentChange}
                                ref={univNoStudentsRef}
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="0">
                            </Form.Control>
                    </Form.Group>
                    {/** Location Name */}
                    <Form.Group className='loc-name' style={{marginTop:'7%'}}>
                        <Form.Label className='form-label'>Location Name</Form.Label>
                            <Form.Control
                                ref={univLocNameRef}
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="Enter Univesity location name...">
                            </Form.Control>
                    </Form.Group>
                    {/** Latitude */}
                    <Form.Group className='lat' style={{marginTop:'7%'}}>
                        <Form.Label className='form-label'>Latitude</Form.Label>
                            <Form.Control
                                ref={univLocLatRef}
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="0">
                            </Form.Control>
                    </Form.Group>
                    {/** Longitude */}
                    <Form.Group className='long' style={{marginTop:'7%'}}>
                        <Form.Label className='form-label'>Longitude</Form.Label>
                            <Form.Control
                                ref={univLocLongRef}
                                style={{backgroundColor:'#f2ecd9'}}
                                placeholder="0">
                            </Form.Control>
                    </Form.Group>

                    <Button disabled={loading} 
                        className='button border-0 rounded-2' 
                        type="submit" 
                        style={{backgroundColor:'#BA9B37'}}>
                            Register Admin
                    </Button>
                </Form>
            </Container>
        </div>
    )
}
