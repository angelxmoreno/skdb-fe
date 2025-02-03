import {createFileRoute, Link} from '@tanstack/react-router'
import {Col, Row} from 'react-bootstrap';

export const Route = createFileRoute('/about')({
    component: AboutPage,
})

function AboutPage() {

    return (
        <Row>
            <Col>
                <h1>About Serial Killer Wiki</h1>

                <p>
                    Welcome to Serial Killer Wiki, your go-to source for information on notorious serial killers.
                    Our mission is to compile comprehensive, accurate, and well-researched data about these individuals.
                </p>
                <p>
                    The platform is built with modern technologies such as React, TypeScript, and TanStack Router,
                    ensuring a seamless and responsive user experience.
                </p>
                <p>
                    We value both accuracy and security, and we are continuously working on improving the platform.
                    Explore our site and get in touch if you have any questions or suggestions.
                </p>
                <p>
                    Return to <Link to="/">Home</Link>.
                </p>
            </Col>
        </Row>
    );
}

export default AboutPage;
