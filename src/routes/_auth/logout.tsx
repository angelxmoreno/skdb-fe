import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@hooks/authStore'
import { logout } from '@apis/authApi'
import { Spinner, Alert, Container } from 'react-bootstrap'

export const Route = createFileRoute('/_auth/logout')({
  component: LogoutRoute,
})

function LogoutRoute() {
  const { token, logOutAction } = useAuthStore()
  const navigate = useNavigate()
  const [message, setMessage] = useState('Logging out...')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleLogout = async () => {
      if (!token) {
        navigate({ to: '/login' })
        return
      }
      try {
        await logout(token)
        setMessage('Successfully logged out.')
      } catch (error: unknown) {
        console.error('Error during logout:', error)
        setMessage('Error logging out, please try again later.')
      } finally {
        // Clear the auth store
        logOutAction()
        // Optionally, wait a moment so the user can see the final message
        setTimeout(() => {
          setIsLoading(false)
          navigate({ to: '/login' })
        }, 2000)
      }
    }

    handleLogout()
  }, [token, logOutAction, navigate])

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: '100vh' }}
    >
      {isLoading && (
        <>
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <Alert variant="info">{message}</Alert>
        </>
      )}
    </Container>
  )
}
