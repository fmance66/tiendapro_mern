import { Link } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
// import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          // <LinkContainer to='/login'>
          //   <Nav.Link>Ingresar</Nav.Link>
          // </LinkContainer>
          <Nav.Link as={Link} to='/login'>
            Ingresar
          </Nav.Link>          
        ) : (
          <Nav.Link disabled>Ingresar</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          // <LinkContainer to='/shipping'>
          //   <Nav.Link>Envío</Nav.Link>
          // </LinkContainer>
          <Nav.Link as={Link} to='/shipping'>
            Envío
          </Nav.Link>          
        ) : (
          <Nav.Link disabled>Envío</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          // <LinkContainer to='/payment'>
          //   <Nav.Link>Pago</Nav.Link>
          // </LinkContainer>
          <Nav.Link as={Link} to='/payment'>
            Pago
          </Nav.Link>          
        ) : (
          <Nav.Link disabled>Pago</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          // <LinkContainer to='/placeorder'>
          //   <Nav.Link>Lugar de envío</Nav.Link>
          // </LinkContainer>
          <Nav.Link as={Link} to='/placeorder'>
            Pedido
          </Nav.Link>          
        ) : (
          <Nav.Link disabled>Pedido</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
