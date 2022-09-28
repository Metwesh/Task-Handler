import Card from "react-bootstrap/Card";
import DashboardNav from "../../components/DashboardNav";
import VerticalNav from "../../components/VerticalNav";
import GridProfile from "./components/ViewProfile";
import "./Profile.css";

export default function Profile(): JSX.Element {
  return (
    <>
      <VerticalNav />
      <div className="d-grid grid-area-profile">
        <DashboardNav />
        <Card className="mx-3 my-2">
          <Card.Body>
            <GridProfile />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
