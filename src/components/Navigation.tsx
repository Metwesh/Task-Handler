import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import LogoLight from "../images/Logo-light.svg";
import "./Navigation.css";

export default function Navigation(): JSX.Element {
  return (
    <Nav className="justify-content-between horizontal-nav">
      <Nav.Item className="d-flex align-items-center ms-5">
        <div className={"fixed-7rem-wrapper"}></div>
      </Nav.Item>
      <Nav.Item className="d-flex align-items-center">
        <div className={"fixed-7rem-wrapper"}>
          <img src={LogoLight} className="img-sizer" alt="logo" />
        </div>
      </Nav.Item>
      <Nav.Item className="d-flex align-items-center me-5">
        <div className={"fixed-7rem-wrapper"}>
          {window.location.pathname === "/" ||
          window.location.pathname === "/signin" ? (
            <Button
              href="/signup"
              variant="info"
              size="lg"
              className="font-main-color">
              Register
            </Button>
          ) : window.location.pathname === "/signup" ? (
            <Button
              href="/signin"
              variant="info"
              size="lg"
              className="font-main-color">
              Sign in
            </Button>
          ) : null}
        </div>
      </Nav.Item>
    </Nav>
  );
}
