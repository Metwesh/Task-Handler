import VerticalNav from "../../components/VerticalNav";
import DashboardNav from "../../components/DashboardNav";
import Card from "react-bootstrap/Card";
import EditProfileForm from "./components/EditProfileForm";
import "./EditProfile.css";

export default function EditProfile() {
  return (
    <>
      <VerticalNav />
      <div className="d-grid grid-eprofile">
        <DashboardNav />
        <Card className="mx-3 my-2">
          <Card.Body>
            <EditProfileForm />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
