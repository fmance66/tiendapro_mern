import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom' // Cambiamos los Hooks
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  
  const { search } = useLocation()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  // Extraer el redirect de la URL (?redirect=shipping)
  const redirect = search ? search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)    
    }
    setEmail('')
    setPassword('')    
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>Ingreso al Sistema</h1>

      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Dirección de Email</Form.Label>
          <Form.Control type='email' placeholder='Ingrese un email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='mt-4'>
          <Form.Label>Contraseña</Form.Label> 
          <Form.Control type='password' placeholder='Ingrese una contraseña'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-4'>
          Ingresar
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          ¿Sos nuevo?{' '}
          <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}>
            Registrate
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen