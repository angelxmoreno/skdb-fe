import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordScreen,
})

function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    setError(null)
    // Placeholder: implement forgot password logic here.
    console.log('Requesting password reset for:', email)
    setMessage(
      'If an account with that email exists, you will receive password reset instructions.',
    )
  }

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <h2>Forgot Password</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="forgotPasswordEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Reset Password
          </Button>
        </Form>
        <div className="mt-3">
          <p>
            Remembered your password? <Link to="/login">Log in here</Link>
          </p>
          <p>
            Need an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </Col>
    </Row>
  )
}
