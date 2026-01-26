import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const SearchBox = () => { // Quitamos history de los props ya que usamos useNavigate
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate() 

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      // Al buscar, siempre reiniciamos a la página 1 del resultado
      navigate(`/search/${keyword}/page/1`) 
    } else {
      navigate('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex ms-lg-4' 
          style={{ width: '100%', minWidth: '350px', maxWidth: '500px' }} >
      <Form.Control 
        type='text' 
        name='q' 
        className='flex-grow-1'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Buscar productos...' 
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='ms-2 py-2 px-3'>
        Buscar 
      </Button>
    </Form>
  )
}

export default SearchBox