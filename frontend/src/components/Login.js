/** ----------------------- IMPORTS ----------------------- */
import axios from 'axios'
import { AUTHLEVEL, CREATETIME, ID, USERNAME } from '../constants/DatabaseConstants';
import background from '../images/ucf_campus.jpg'
import React, { useRef, useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
/** ------------------------------------------------------- */


/**
 * Main function for Dashboard that returns all elements to be shown on Dashboard
 * 
 * @returns Dashboard Layout
 */
export default function Login() {

    // Login Form refs and useStates
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    // useNavigate instance
    const navigate = useNavigate()

    /**
     * Function to handle Login Submit
     * 
     */
    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)

            axios.post("http://localhost:8800/login", {

                username: usernameRef.current.value,
                password: passwordRef.current.value

            }).then((response) => {

                console.log(response)

                localStorage.setItem(AUTHLEVEL, response.data[0].auth_level)
                localStorage.setItem(CREATETIME, response.data[0].create_time)
                localStorage.setItem(ID, response.data[0].user_id)
                localStorage.setItem(USERNAME, response.data[0].username)

                setSuccess('Login Successful! Redirecting to Dashboard...')
                setTimeout(function(){navigate('/')}, 1000)

            }).catch((auth_error) => {

                // If there was an uncaught Database Error
                if(auth_error.response.status === 400){
                    setError('Unfortunately, something went wrong!')
                    console.log(auth_error.response.data)
                }
                // If the username doesn't exist
                if(auth_error.response.status === 403){
                    setError('Username does not exist, please register an account')
                    console.log(auth_error.response.data)
                }
                // If the username password combination is bad
                if(auth_error.response.status === 404){
                    setError('Username/Password combination is incorrect')
                    console.log(auth_error.response.data)
                }

            })
        }
        catch (err) {
            setError(err)
        }

        setLoading(false)
    }

    // Return Login elements to be displayed
    return (

        <div style={{backgroundImage: `url(${background})`, height: '100vh', width:'201.3vh', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>

        {/** Main Container */}
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
                    <h2 className="text-center mt-5" style={{color:'#ffffff'}}>Welcome Back</h2>
                    
                    {/** Handle Submit */}
                    <Form onSubmit={handleSubmit}>

                    {/** Username Section */}
                    <Form.Group id="username">
                        <Form.Label className="mt-4" style={{fontWeight:'bold', color:'#ffffff', position:'relative', top:'10px'}}>USERNAME</Form.Label>
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

                    {/** Login Button */}
                    <Button disabled={loading} 
                        className="square border border-0 w-100 mt-2" 
                        type="submit" 
                        style={{position:'relative', top:'30px', backgroundColor:'#BA9B37'}}>
                            Log In
                    </Button>

                    {/* link to signup if account doesn't exist yet */}
                    <div className="w-100 text-center mt-5" style={{color:'#ffffff'}}>
                        Need an Account? <Link to='/Signup' style={{fontStyle:'italic', fontWeight:'bold', color:'#ffffff'}}>Sign Up</Link>
                    </div>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
        </div>
    )
}
