import { useEffect } from 'react' 
import { PayPalButtons } from '@paypal/react-paypal-js'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { formatDate } from '../utils/dateUtils'
import { formatCurrency } from '../utils/currencyUtils'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

const OrderScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: orderId } = useParams()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading && order) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }

    // Eliminamos addPayPalScript de aquí porque ahora usamos el PayPalScriptProvider en App.js

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    }
  }, [dispatch, orderId, successPay, successDeliver, order, userInfo, navigate])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return (

    loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <>
        <h1>Pedido {order._id}</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Datos de envío</h2>
                <p><strong>Nombre: </strong> {order.user.name}</p>
                <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                <p>
                  <strong>Dirección: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message variant='success'>Entregado el {formatDate(order.deliveredAt)}</Message>
                ) : (
                  <Message variant='danger'>No entregado</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Forma de pago</h2>
                <p><strong>Forma: </strong>{order.paymentMethod}</p>
                {order.isPaid ? (
                  <Message variant='success'>Pagado el {formatDate(order.paidAt)}</Message>
                ) : (
                  <Message variant='danger'>No pagado</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Productos del pedido</h2>
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                        <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                        <Col md={5}>
                          {item.qty} x {formatCurrency(item.price)} = 
                          <span className="fw-bold"> {formatCurrency(item.qty * item.price)}</span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item><h2>Resumen del pedido</h2></ListGroup.Item>
                <ListGroup.Item><Row><Col>Productos</Col><Col>{formatCurrency(order.itemsPrice)}</Col></Row></ListGroup.Item>
                <ListGroup.Item><Row><Col>Envío</Col><Col>{formatCurrency(order.shippingPrice)}</Col></Row></ListGroup.Item>
                <ListGroup.Item><Row><Col>Impuestos</Col><Col>{formatCurrency(order.taxPrice)}</Col></Row></ListGroup.Item>
                <ListGroup.Item><Row><Col><strong>Total</strong></Col><Col><strong>{formatCurrency(order.totalPrice)}</strong></Col></Row></ListGroup.Item>
                
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {/* El botón ahora se gestiona solo a través del Provider de App.js */}
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{ amount: { value: order.totalPrice } }],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          successPaymentHandler(details);
                        });
                      }}
                    />
                  </ListGroup.Item>
                )}

                {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    <Button type='button' className='btn w-100' onClick={deliverHandler}>
                      Marcar como entregado
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    )
  )
}

export default OrderScreen