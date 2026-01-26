import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom' // Importamos useNavigate
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  // Inicializamos el estado con los datos guardados (si existen)
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  const dispatch = useDispatch()
  const navigate = useNavigate() // Hook para navegación

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    navigate('/payment') 
  }

  return (
    <FormContainer>
      {/* Paso 1 (Login) y Paso 2 (Shipping) completados */}
      <CheckoutSteps step1 step2 />
      
      <h1 className='my-4'>Datos de envío</h1> {/* Un poco de margen para separar del stepper */}
      
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='mb-3'>
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ej: Calle Falsa 123'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='city' className='mb-3'>
          <Form.Label>Ciudad</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ej: Morón'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode' className='mb-3'>
          <Form.Label>Código postal</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ej: 1708'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='country' className='mb-4'>
          <Form.Label>País</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ej: Argentina'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='px-4'>
          Continuar
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen