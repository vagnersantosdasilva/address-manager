import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/global.css';
import Header from './components/Header/Header'
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import UserList from './pages/Users/UserList/UserList';
import ProtectedRoute from './routes/ProtectedRoutes';

function App() {

  return (
    <>
      <Header></Header>
      <Container>
        <Routes>
          {/* Rotas públicas / iniciais */}

          <Route path="/login" element={<Login />} />

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
        </Routes>
      </Container>
    </>
  )
}

export default App
