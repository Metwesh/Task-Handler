import VerticalNav from "../../components/VerticalNav";
import DashboardNav from "../../components/DashboardNav";
import Card from "react-bootstrap/Card";
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
