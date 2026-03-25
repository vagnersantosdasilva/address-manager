import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/global.css';
import Header from './components/Header/Header'
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import UserList from './pages/Users/UserList/UserList';
import ProtectedRoute from './routes/ProtectedRoutes';
import UserForm from './pages/Users/UserForm/UserForm';
import AddressList from './pages/Address/AddressList/AddressList';
import AddressForm from './pages/Address/AddressForm/AddressForm';
import Home from './pages/Home/Home';

function App() {

  return (
    <>
      <Header></Header>
      <Container>
        <Routes>
          {/* Rotas públicas / iniciais */}

          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home/> } />

          {/*Rotas protegidas */}
          
          {/*Rotas de admin*/}
           <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserList />
              </ProtectedRoute>
            }
          />

           <Route
            path="/users/new"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserForm />
              </ProtectedRoute>
            }
          />

           <Route
            path="/users/:id" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:id/addresses" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AddressList />
              </ProtectedRoute>
            }
          />

          <Route
            path="myaddresses" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COMMON']}>
                <AddressList />
              </ProtectedRoute>
            }
          />

           <Route
            path="myaddresses/new" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COMMON']}>
                <AddressForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="myaddresses/:id" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'COMMON']}>
                <AddressForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="users/:idUser/addresses/:id" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AddressForm />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Container>
    </>
  )
}

export default App
