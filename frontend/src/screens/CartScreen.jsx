import { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { formatCurrency } from '../utils/currencyUtils' 

const CartScreen = () => {
  const { id } = useParams() 
  const location = useLocation()
  const navigate = useNavigate() 

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty))
    }
  }, [dispatch, id, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    // navigate('/login?redirect=shipping')
    navigate('/shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h1>Carrito de compras</h1>
        {cartItems.length === 0 ? (
          <Message>
            Tu carrito está vacío &nbsp;&nbsp;
            <Link to='/' className='btn btn-light px-5 my-3 shadow-sm'>
              Volver
            </Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    {formatCurrency(item.price)}
                  </Col>
                  <Col md={2}>
                    <Form.Control 
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                {cartItems.reduce((acc, item) => acc + item.qty, 0) > 1 ? ' productos' : ' producto'}
              </h2>
              <div className='h4 font-weight-bold'>
                {formatCurrency(
                  cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
                )}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='w-100'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Finalizar Compra
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen