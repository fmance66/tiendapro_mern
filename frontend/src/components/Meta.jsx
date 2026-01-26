import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Bienvenido a TiendaPro',
  description: 'Los mejores productos al mejor precio',
  keywords: 'electrónica, comprar electrónica, electrónica barata',
}

export default Meta
