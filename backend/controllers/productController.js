import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Público
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12 // Lo subimos un poco para que se luzca tu paginación
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Obtener un solo producto
// @route   GET /api/products/:id
// @access  Público
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Producto no encontrado')
  }
})

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.json({ message: 'Producto eliminado' })
  } else {
    res.status(404)
    throw new Error('Producto no encontrado')
  }
})

// @desc    Crear un producto (Muestra)
// @route   POST /api/products
// @access  Privado/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  // valida que nombre y precio vengan si o si
  if (!name || price === undefined) {
    res.status(400)
    throw new Error('El nombre y el precio son obligatorios para crear un producto')
  }

  const product = new Product({
    name: name || 'Nombre de muestra',
    price: price || 0,
    user: req.user._id,
    image: image || '/images/sample.jpg',
    brand: brand || 'Marca de muestra',
    category: category || 'Categoría de muestra',
    countInStock: countInStock || 0,
    numReviews: 0,
    description: description || 'Descripción de muestra',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Privado/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Producto no encontrado')
  }
})

// @desc    Crear nueva opinión
// @route   POST /api/products/:id/reviews
// @access  Privado
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Ya calificaste este producto')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Opinión agregada' })
  } else {
    res.status(404)
    throw new Error('Producto no encontrado')
  }
})

// @desc    Obtener productos mejor calificados
// @route   GET /api/products/top
// @access  Público
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5)
  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}