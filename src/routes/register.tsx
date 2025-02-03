import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { register } from '@apis/authApi';
import {useAuthStore} from "@hooks/authStore"; // Make sure your register API accepts name, email, password

export const Route = createFileRoute('/register')({
    component: RegisterScreen,
});

function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuthResponse } = useAuthStore(); // Zustand store hook

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        setIsLoading(true);

        // Basic validation: all fields must be filled.
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill out all fields.');
            setIsLoading(false);
            return;
        }

        // Validate that the passwords match.
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            // Call the register API.
            // Ensure your register API function accepts a name parameter.
            const response = await register(name, email, password);

            if (response.status === 'SUCCESS') {
                // navigate to the login screen. Here we navigate to /login.
                setAuthResponse(response);
                await navigate({ to: '/login' });
            } else {
                setError(response.message);
            }
        } catch (error: unknown) {
            console.error({ error });
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Row className="justify-content-center">
            <Col md={6}>
                <h2>Register</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <Form.Group className="mb-3" controlId="registerName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    {/* Email Field */}
                    <Form.Group className="mb-3" controlId="registerEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    {/* Password Field */}
                    <Form.Group className="mb-3" controlId="registerPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    {/* Confirm Password Field */}
                    <Form.Group className="mb-3" controlId="registerConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Registering...
                            </>
                        ) : (
                            'Register'
                        )}
                    </Button>
                </Form>
                <div className="mt-3">
                    <p>
                        Already have an account? <Link to="/login">Log in here</Link>
                    </p>
                </div>
            </Col>
        </Row>
    );
}
