import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {

  const { data } = await axios.get(`/api/products/${id}`)

  dispatch({ type: CART_ADD_ITEM,
             payload: {
                product: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty,
             },
  })

  // si el usuario esta logueado, guardamos el carrito en la DB
  const { userLogin: { userInfo } } = getState()
  
  if (userInfo) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    await axios.put('/api/users/cart', getState().cart.cartItems, config)
  }

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  // SINCRONIZACIÓN CON DB
  const { userLogin: { userInfo } } = getState()
  if (userInfo) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    // envia el carrito actualizado después del dispatch
    await axios.put('/api/users/cart', getState().cart.cartItems, config)
  }

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })
  
  localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const clearCart = () => async (dispatch, getState) => {
  dispatch({
    type: CART_CLEAR_ITEMS,
  })

  // SINCRONIZACIÓN CON DB (envia array vacío)
  const { userLogin: { userInfo } } = getState()
  if (userInfo) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    await axios.put('/api/users/cart', [], config)
  }

  localStorage.removeItem('cartItems')
}
