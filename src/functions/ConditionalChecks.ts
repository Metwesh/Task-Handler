export default function ConditionalChecks(
  setHomeLink: Function,
  setAdminHomeLink: Function,
  setProfileLink: Function,
  setEditProfileLink: Function,
  setPrivilegesLink: Function,
  setAllTasksLink: Function,
  setTasksLink: Function,
  setAddTaskLink: Function
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
  if (window.location.pathname === "/alltasks") {
    setAllTasksLink("cardHoverActive");
  }
  if (window.location.pathname === "/tasks") {
    setTasksLink("cardHoverActive");
  }
  if (window.location.pathname === "/addtask") {
    setAddTaskLink("cardHoverActive");
  }
}
