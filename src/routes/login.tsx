import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useAuthStore } from '@hooks/authStore'; // Zustand store
import { login } from '@apis/authApi'; // Auth API function
import { AuthResponse } from '@entities/Auth'; // AuthResponse type

export const Route = createFileRoute('/login')({
    component: LoginScreen,
});

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const { setAuthResponse } = useAuthStore(); // Zustand store hook
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        setIsLoading(true);

        if (!email || !password) {
            setError('Please enter both email and password.');
            setIsLoading(false);
            return;
        }

        try {
            const response: AuthResponse = await login(email, password);

            if (response.status === 'SUCCESS') {
                setAuthResponse(response);
                await navigate({ to: '/' });
            } else {
                setError(response.message);
            }
        } catch (error: unknown) {
            setError('Login failed. Please try again.');
            console.error({ error });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Row className="justify-content-center">
            <Col md={6}>
                <h2>Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="loginPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </Form>
                <div className="mt-3">
                    <p>
                        Need an account? <Link to="/register">Register here</Link>
                    </p>
                    <p>
                        Forgot your password? <Link to="/forgot-password">Reset here</Link>
                    </p>
                </div>
            </Col>
        </Row>
    );
}
