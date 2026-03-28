import { Navigate, useParams } from 'react-router'

import { useAuth } from '../hooks/useAuth'

type PrivateRouteProps = {
  component: React.ComponentType
}

const PrivateRoute = ({ component: PrivateComponent }: PrivateRouteProps) => {
  const { currentUser } = useAuth()
  const params = useParams()
  
  return currentUser && params.userId === currentUser.id ? <PrivateComponent /> : <Navigate to='/auth' replace />
}

export default PrivateRoute