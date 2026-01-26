import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct } from '../actions/productActions' 

const ProductListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pageNumber = 1 } = useParams()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  // Eliminamos el bloque de productCreate de aquí (Selectors)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    // Verificación de Admin
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    } else {
      // Cargamos los productos directamente
      dispatch(listProducts('', pageNumber))
    }
  }, [dispatch, navigate, userInfo, successDelete, pageNumber]) // Limpiamos las dependencias

  const deleteHandler = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    navigate(`/admin/product/create/${page}`)
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Productos</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3 shadow-sm' variant='primary' onClick={createProductHandler}>
            <i className='fas fa-plus'></i>&nbsp;&nbsp;Nuevo Producto
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>PRECIO</th>
                <th>CATEGORÍA</th>
                <th>MARCA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer 
                      to={`/admin/product/${product._id}/edit/${page}`}
                    >
                      <Button className='btn-sm' variant='success'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button className='btn-sm ms-2' variant='danger'
                            onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ProductListScreen