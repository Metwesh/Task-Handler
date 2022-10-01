import Card from "react-bootstrap/Card";
import DashboardNav from "../../components/DashboardNav";
import VerticalNav from "../../components/VerticalNav";
import EditPrivilegesForm from "./components/EditPrivilegesForm";
import "./Privileges.css";

export default function Privileges(): JSX.Element {
  return (
    <>
      <VerticalNav />
      <div className="d-grid grid-privileges">
        <DashboardNav />
        <Card className="mx-3 my-2">
          <Card.Body>
            <EditPrivilegesForm />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
