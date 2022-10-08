import { Dispatch, SetStateAction } from "react";

export default function ConditionalChecks(
  setHomeLink: Dispatch<SetStateAction<string>>,
  setAdminHomeLink: Dispatch<SetStateAction<string>>,
  setProfileLink: Dispatch<SetStateAction<string>>,
  setEditProfileLink: Dispatch<SetStateAction<string>>,
  setPrivilegesLink: Dispatch<SetStateAction<string>>,
  setTasksLink: Dispatch<SetStateAction<string>>,
  setAddTaskLink: Dispatch<SetStateAction<string>>
): void {
  if (window.location.pathname === "/dashboard") {
    setHomeLink("cardHoverActive");
  }
  if (window.location.pathname === "/admindashboard") {
    setAdminHomeLink("cardHoverActive");
  }
  if (window.location.pathname === "/profile") {
    setProfileLink("cardHoverActive");
  }
  if (window.location.pathname === "/editprofile") {
    setEditProfileLink("cardHoverActive");
  }
  if (window.location.pathname === "/privileges") {
    setPrivilegesLink("cardHoverActive");
  }
  if (window.location.pathname === "/tasks") {
    setTasksLink("cardHoverActive");
  }
  if (window.location.pathname === "/addtask") {
    setAddTaskLink("cardHoverActive");
  }
}
