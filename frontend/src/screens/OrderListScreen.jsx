import { useEffect } from 'react' // Eliminamos useParams de aquí
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom' // Importamos useNavigate
import Message from '../components/Message'
import Loader from '../components/Loader'
import { formatDate } from '../utils/dateUtils'
import { listOrders } from '../actions/orderActions'

const OrderListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate() // Hook para redirección

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    // Verificamos si el usuario está logueado y es admin
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      // Si no es admin, redirigimos a login
      navigate('/login') 
    }
  }, [dispatch, navigate, userInfo])

  return (
    <>
      <h1>Pedidos</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USUARIO</th>
              <th>FECHA</th>
              <th>TOTAL</th>
              <th>PAGO</th>
              <th>ENTREGADO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <>
                      <i className='fas fa-check' style={{ color: 'green' }}></i>{' '}
                      {formatDate(order.paidAt)}
                    </>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <>
                      <i className='fas fa-check' style={{ color: 'green' }}></i>{' '}
                      {order.deliveredAt.substring(0, 10)}
                    </>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Detalles
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen