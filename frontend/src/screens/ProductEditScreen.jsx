import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET, PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = () => {

  const { id: productId, pageNumber: pageFromUrl } = useParams()

  const pageNumber = pageFromUrl || 1

  const [uploading, setUploading] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const isEditMode = productId !== undefined && productId !== 'create'

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

  const productCreate = useSelector((state) => state.productCreate)
  const { success: successCreate } = productCreate

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: ''
  })

  useEffect(() => {
    if (successUpdate || successCreate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      dispatch({ type: PRODUCT_CREATE_RESET })
      navigate(`/admin/productlist/${pageNumber}`)      
    } else {
      if (isEditMode) {
        if (!product.name || product._id !== productId) {
          dispatch(listProductDetails(productId))
        } else {
          setFormData({
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            category: product.category,
            countInStock: product.countInStock,
            description: product.description
          })        
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, productId, product, successUpdate, successCreate, isEditMode, pageNumber])

  const handleFormData = (valor, campo) => {  
    console.log(campo, valor)
    setFormData({ ...formData, [campo]: valor })
    // si cambia la imagen, se resetea el loader de la vista previa
    if (campo === 'image') setImgLoading(true)
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const { data } = await axios.post('/api/upload', formData, config)
      handleFormData(data, 'image')
      // setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    // se agrega id al producto
    const productData = { ...formData, _id: productId }
    isEditMode ? dispatch(updateProduct(productData)) : dispatch(createProduct(productData))
  }

  return (

    <Container>
      <Link to={`/admin/productlist/${pageNumber}`} 
            className='btn btn-light my-3 border shadow-sm'>
              Volver
      </Link>

      <Row className='justify-content-center'>
        <Col md={12}>
          <Card className='p-4 shadow-sm border-0 bg-white rounded-4'>
            <h1 className='mb-4 text-primary text-center'>
              {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>

            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <Form onSubmit={submitHandler}>
                <Row>

                  {/* Columna izquierda: formulario de datos */}
                  <Col lg={7} md={6}>
                    <Form.Group controlId='name' className='mb-3'>
                      <Form.Label className='fw-bold'>Nombre del Producto</Form.Label>
                      <Form.Control
                        type='text'
                        value={formData.name}
                        // onChange={(e) => setName(e.target.value)}
                        onChange={(e) => handleFormData(e.target.value, 'name')}
                        className='bg-light'
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group controlId='price' className='mb-3'>
                          <Form.Label className='fw-bold'>Precio (USD)</Form.Label>
                          <Form.Control
                            type='number'
                            value={formData.price}
                            // onChange={(e) => setPrice(e.target.value)}
                            onChange={(e) => handleFormData(Number(e.target.value), 'price')}
                            className='bg-light'
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId='countInStock' className='mb-3'>
                          <Form.Label className='fw-bold'>Stock</Form.Label>
                          <Form.Control
                            type='number'
                            value={formData.countInStock}
                            // onChange={(e) => setCountInStock(e.target.value)}
                            onChange={(e) => handleFormData(Number(e.target.value), 'countInStock')}
                            className='bg-light'
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId='image' className='mb-3'>
                      <Form.Label className='fw-bold'>URL de Imagen</Form.Label>
                      <Form.Control
                        type='text'
                        value={formData.image}
                        // onChange={(e) => setImage(e.target.value)}
                        onChange={(e) => handleFormData(e.target.value, 'image')}
                        className='bg-light'
                      />
                      <Form.Control
                        type='file'
                        onChange={uploadFileHandler}
                        className='mt-2 border-0'
                      />
                      {uploading && <Loader />}
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group controlId='brand' className='mb-3'>
                          <Form.Label className='fw-bold'>Marca</Form.Label>
                          <Form.Control
                            type='text'
                            value={formData.brand}
                            // onChange={(e) => setBrand(e.target.value)}
                            onChange={(e) => handleFormData(e.target.value, 'brand')}
                            className='bg-light'
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId='category' className='mb-3'>
                          <Form.Label className='fw-bold'>Categoría</Form.Label>
                          <Form.Control
                            type='text'
                            value={formData.category}
                            // onChange={(e) => setCategory(e.target.value)}
                            onChange={(e) => handleFormData(e.target.value, 'category')}
                            className='bg-light'
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId='description' className='mb-4'>
                      <Form.Label className='fw-bold'>Descripción</Form.Label>
                      <Form.Control
                        as='textarea'
                        rows={4}
                        value={formData.description}
                        // onChange={(e) => setDescription(e.target.value)}
                        onChange={(e) => handleFormData(e.target.value, 'description')}
                        className='bg-light'
                      />
                    </Form.Group>
                  </Col>

                  {/* Columna derecha: vista previa de la imagen del producto */}
                  <Col lg={5} md={6} className='d-flex flex-column align-items-center'>
                    <div className='sticky-top pt-2' style={{ top: '20px', width: '100%' }}>
                      {/* <h5 className='text-center mb-3 text-muted'>Vista Previa</h5> */}

                      <div className='preview-image-container border rounded 
                                      overflow-hidden shadow-sm bg-white d-flex 
                                      align-items-center justify-content-center' 
                          //  style={{ height: '350px', position: 'relative' }}                                      
                      >
                        {formData.image ? (
                          <>
                            {/* muestra el Loader mientras la imagen se está descargando */}
                            {imgLoading && (
                              <div style={{ marginTop: '20rem', position: 'absolute' }}>
                                <Loader />
                              </div>
                            )}

                            <img src={formData.image} alt='Preview' 
                                style={{ 
                                    width: '100%', 
                                    height: '100%',  
                                    objectFit: 'cover', // hace que "llene" el espacio del contenedor completo
                                    display: imgLoading ? 'none' : 'block',
                                    borderRadius: '8px' 
                                  }}     
                                onLoad={() => setImgLoading(false)}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/350x350?text=Imagen+No+Encontrada' }}
                            />
                          </>
                        ) : (
                          <div className='text-muted'>Sin imagen seleccionada</div>
                        )}
                      </div>

                      {/* Info del producto abajo de la foto */}
                      {!imgLoading && (
                        <div className='mt-3 p-3 bg-light rounded text-center border'>
                          <p className='mb-1 fw-bold'>{formData.name || 'Nuevo Producto'}</p>
                          <p className='text-success h4'>USD {formData.price}</p>
                        </div>
                      )}

                    </div>
                  </Col>
                </Row>

                <Button type='submit' variant='primary' className='w-100 py-3 mt-4 fw-bold shadow'>
                  <i className='fas fa-save'></i> {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
                </Button>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ProductEditScreen