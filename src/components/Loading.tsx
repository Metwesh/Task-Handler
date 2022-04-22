import Spinner from "react-bootstrap/Spinner";
import "./Spinner.css";

export default function Loading(): JSX.Element {
  return <Spinner animation="border" variant="info" />;
}
