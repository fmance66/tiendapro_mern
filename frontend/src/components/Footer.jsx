import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className='bg-dark text-light mt-auto'> {/* Agregamos fondo oscuro y margen superior */}
      <Container>
        <Row>
          <Col className='text-center py-4'> {/* Un poco más de padding vertical */}
            <p className='mb-0'>
              Copyright &copy; {new Date().getFullYear()} Main IT. 
              <span className='d-none d-sm-inline'> Todos los derechos reservados.</span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer