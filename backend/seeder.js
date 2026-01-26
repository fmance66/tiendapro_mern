// import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
// import path from 'path'
import colors from 'colors'                     // no eliminar se usa para los mensajes
import users from './data/users.js'
// import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const modo = process.argv[2] 

const importData = async () => {
  try {

    // si es modo replace borra los datos existentes
    if (modo === '-r') {
      console.log('Modo reemplazo serán borrados los datos existentes...'.blue.inverse)
      await Order.deleteMany()
      await Product.deleteMany()
      await User.deleteMany()
    }

    // agrega los usuarios
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    // lee los productos del json
    const productsData = JSON.parse(fs.readFileSync('./backend/data/products.json', 'utf-8'))

    // mapea los productos, agrega el user
    const productsMapped = productsData.map((product) => {
      return { ...product, user: adminUser }
    })

    // agrega los productos a la base
    await Product.insertMany(productsMapped)

    console.log('Los datos fueron importados con éxito!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}



if (modo === '-d') {
  destroyData()
} else {
  importData()
}
