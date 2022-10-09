import { useContext } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { IUserContext, UserContext } from "../contexts/UserContext";
import "./DashboardNav.css";
import DateKeeper from "./DateKeeper";

export default function DashboardNav(): JSX.Element {
  const { activeEmployee } = useContext<IUserContext>(UserContext);
  return (
    <Card className="mx-3 my-2 border-0 card-wrapper">
      <Card.Body className="d-flex justify-content-between align-items-center card-wrapper-body">
        <Link
          to="/profile"
          className="m-0 fs-4 link-light cardHover text-decoration-none px-3"
        >
          {activeEmployee.name}
        </Link>
        <DateKeeper />
      </Card.Body>
    </Card>
  );
}
