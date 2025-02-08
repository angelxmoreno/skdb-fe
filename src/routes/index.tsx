import { createFileRoute } from '@tanstack/react-router'
import {Col, Row} from "react-bootstrap";
import appConfig from "@config/index";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
      <Row>
          <Col>
              <h1>Welcome to Serial Killer Wiki</h1>
              <h6>`import.meta.env.MODE:`: {import.meta.env.MODE}</h6>
              <h6>`process.env.NODE_ENV`: {process.env.NODE_ENV}</h6>
              <h6>`import.meta.env.VITE_API_BASE_URL`: {import.meta.env.VITE_API_BASE_URL}</h6>
              <h6>`appConfig.API_BASE_URL`: {appConfig.API_BASE_URL}</h6>
              <p>
                  This is a placeholder homepage. We are currently building out the content,
                  so please check back soon for more updates!
              </p>
          </Col>
      </Row>
  )
}
