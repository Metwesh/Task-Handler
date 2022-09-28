import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Navigation from "../../components/Navigation";
import Logo from "../../images/Logo.svg";
import "./Landing.css";

export default function Landing(): JSX.Element {
  return (
    <>
      <Navigation />
      <Container fluid className="height-90vh">
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col className="d-flex justify-content-center align-items-center">
            <img src={Logo} className="img-sizer-landing" alt="logo" />
          </Col>
          <Col>
            <Card className="p-5 me-5 card-bg-color">
              <p className="fs-1">Task handling, made simple</p>
              <Button
                href="/signin"
                variant="info"
                size="lg"
                className="ms-auto mt-2 font-main-color">
                Sign in
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
