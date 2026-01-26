import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom' // Hooks v6
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { formatCurrency } from '../utils/currencyUtils'
import { formatDate } from '../utils/dateUtils'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams() // Obtenemos el ID de la URL

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const { success: successProductReview, error: errorProductReview } = productReviewCreate

  useEffect(() => {
    if (successProductReview) {
      alert('Tu opinión fue enviada!')
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetails(id))
  }, [dispatch, id, successProductReview])

  const addToCartHandler = () => {
    // Redirección moderna al carrito con la cantidad elegida
    navigate(`/cart/${id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProductReview(id, { rating, comment })
    )
  }

  return (
    <>
      <Link className='btn btn-light px-5 my-3 shadow-sm' to='/'>
        Volver
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} opiniones`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className='fw-bold'>Precio:</span> ${formatCurrency(product.price)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className='fw-bold'>Descripción:</span> {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Precio:</Col>
                      <Col>
                        <span className='fw-bold'>${product.price}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Estado:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <span style={{ color: 'green' }}>Disponible</span>
                        ) : (
                          <span style={{ color: 'red' }}>Agotado</span>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Cantidad</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className='d-flex justify-content-center my-1'>
                    <Button type='button' className='w-100'
                            onClick={addToCartHandler}
                            disabled={product.countInStock === 0}
                    >
                      Agregar al carrito
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col md={6}>
              <h2>Opiniones</h2>
              {product.reviews.length === 0 && <Message>Sin opiniones</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{formatDate(review.createdAt)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Dejanos una opinión</h2>
                  {errorProductReview && (
                    <Message variant='danger'>{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating' className='mb-2'>
                        <Form.Label>Calificación</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Seleccione...</option>
                          <option value='1'>1 - Mala</option>
                          <option value='2'>2 - Regular</option>
                          <option value='3'>3 - Buena</option>
                          <option value='4'>4 - Muy buena</option>
                          <option value='5'>5 - Excelente</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment' className='mb-3'>
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'>
                        Enviar
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Por favor <Link to='/login'>iniciá sesión</Link> para dejar un comentario{' '}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen