import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect) 
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden') 
    } else {
      dispatch(register(name, email, password))
    }
  }

  return (
    <FormContainer>
      <h1>Crear Cuenta</h1> 
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='mb-2'>
          <Form.Label>Nombre</Form.Label> 
          <Form.Control
            type='name'
            placeholder='Ingresá tu nombre'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email' className='mb-2'>
          <Form.Label>Dirección de Email</Form.Label> 
          <Form.Control
            type='email'
            placeholder='Ingresá tu email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='mb-2'>
          <Form.Label>Contraseña</Form.Label> 
          <Form.Control
            type='password'
            placeholder='Ingresá tu contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword' className='mb-3'>
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type='password'
            placeholder='Repetí tu contraseña'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Registrarse 
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          ¿Ya tenés una cuenta?{' '} 
          <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}>
            Ingresar 
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen