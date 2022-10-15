import Button from "react-bootstrap/Button";
import "./Error404.css";

export default function Error404() {
  return (
    <div className="d-flex justify-content-center align-items-center full-page">
      <div className="d-flex flex-column align-items-center">
        <h3 className="big-font font-dark-color">Error404</h3>
        <Button className="py-3 width-50" href="/" variant="info" size="lg">
          Go back
        </Button>
      </div>
    </div>
  );
}
