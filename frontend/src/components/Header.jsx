import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          {/* Usar "as={Link}" evita errores de redirección en el Brand */}
          <Navbar.Brand as={Link} to='/'>
            TiendaPro
          </Navbar.Brand>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <div className='d-flex justify-content-between w-100 align-items-center'>
              
              <div className='d-flex align-items-center'>
                <SearchBox />
              </div>   

              <Nav className='ms-auto align-items-center'>    
                <Nav.Link as={Link} to='/cart'>
                  <i className='fas fa-shopping-cart'></i> Carrito
                </Nav.Link>

                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title='Administración' id='adminmenu'>
                    <NavDropdown.Item as={Link} to='/admin/userlist'>
                      Usuarios
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/admin/productlist'>
                      Productos
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/admin/orderlist'>
                      Pedidos
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {userInfo ? (
                  <NavDropdown title={userInfo.name} id='username'>
                    <NavDropdown.Item as={Link} to='/profile'>
                      Mi Perfil
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler}>
                      Cerrar sesión
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to='/login'>
                    <i className='fas fa-user'></i> Ingresar
                  </Nav.Link>
                )}

              </Nav>
            </div>                    
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header