import { createFileRoute } from '@tanstack/react-router'
import {Col, Row} from "react-bootstrap";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
      <Row>
          <Col>
              <h1>Welcome to Serial Killer Wiki</h1>
              <p>
                  This is a placeholder homepage. We are currently building out the content,
                  so please check back soon for more updates!
              </p>
          </Col>
      </Row>
  )
}
