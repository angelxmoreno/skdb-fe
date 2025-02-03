import {FC} from "react";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AppNavLink from "@components/layout/AppNavLink";
import {Link} from "@tanstack/react-router";
import {useAuthStore} from "@hooks/authStore";

const AppHeader: FC = () => {
    const {user} = useAuthStore();

    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Link to={'/'} className={'navbar-brand'}>SKDB Wiki</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <AppNavLink to={'/'}>Home</AppNavLink>
                        <AppNavLink to={'/about'}>About</AppNavLink>
                        <AppNavLink to={'/serial-killers'}>Serial Killers</AppNavLink>
                    </Nav>
                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                 <span className={'navbar-text me-2'}>
                                    Logged In as {user.email}
                                </span>
                                <AppNavLink to={'/logout'}>Log Out</AppNavLink>
                            </>
                        ) : (
                            <>
                                <AppNavLink to={'/login'}>Log In</AppNavLink>
                                <AppNavLink to={'/register'}>Register</AppNavLink>
                            </>
                        )}


                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppHeader;