import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./SearchBox.css";
import { ITasks } from "./TasksTable";

export default function SearchBox(props: {
  tasks: ITasks[];
  setTasks: React.Dispatch<React.SetStateAction<Array<ITasks>>>;
  searchedTasks: ITasks[];
  setSearchedTasks: React.Dispatch<React.SetStateAction<Array<ITasks>>>;
}): JSX.Element {
  const [userInput, setUserInput] = useState<string>("");
  const [searchCriteria, setSearchCriteria] = useState<string>("taskName");

  const handleChange = (e: React.SyntheticEvent) => {
    setUserInput((e.target as HTMLInputElement).value);
  };

  useEffect(() => {
    switch (searchCriteria) {
      case "adminName":
        props.setSearchedTasks(
          props.tasks.filter((taskInfo) => {
            return taskInfo?.adminName
              ?.toLowerCase()
              ?.includes(userInput.toLowerCase());
          })
        );
        break;
      case "empName":
        props.setSearchedTasks(
          props.tasks.filter((taskInfo) => {
            return taskInfo?.employeeNames
              ?.join()
              .toLowerCase()
              ?.includes(userInput.toLowerCase());
          })
        );
        break;
      default:
        props.setSearchedTasks(
          props.tasks.filter((taskInfo) => {
            return taskInfo?.task
              ?.toLowerCase()
              ?.includes(userInput.toLowerCase());
          })
        );
        break;
    }
  }, [searchCriteria, userInput]);

  return (
    <InputGroup>
      <DropdownButton
        variant="outline-info"
        title="Search by"
        id="input-group-dropdown"
      >
        <Dropdown.Item
          href=""
          onClick={() => {
            setSearchCriteria("taskName");
          }}
        >
          Task name
        </Dropdown.Item>
        <Dropdown.Item
          href=""
          onClick={() => {
            setSearchCriteria("adminName");
          }}
        >
          Admin name
        </Dropdown.Item>
        <Dropdown.Item
          href=""
          onClick={() => {
            setSearchCriteria("empName");
          }}
        >
          Employee name
        </Dropdown.Item>
      </DropdownButton>
      <Form.Control
        type="text"
        name="search-bar"
        className="no-border-right"
        onChange={handleChange}
        placeholder={
          searchCriteria === "taskName"
            ? "Task name"
            : searchCriteria === "adminName"
            ? "Admin name"
            : "Employee name"
        }
        autoComplete="off"
      />

      <InputGroup.Text className="no-border-left custom-input-group-text">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M23.111 20.058l-4.977-4.977c.965-1.52 1.523-3.322 1.523-5.251 0-5.42-4.409-9.83-9.829-9.83-5.42 0-9.828 4.41-9.828 9.83s4.408 9.83 9.829 9.83c1.834 0 3.552-.505 5.022-1.383l5.021 5.021c2.144 2.141 5.384-1.096 3.239-3.24zm-20.064-10.228c0-3.739 3.043-6.782 6.782-6.782s6.782 3.042 6.782 6.782-3.043 6.782-6.782 6.782-6.782-3.043-6.782-6.782zm2.01-1.764c1.984-4.599 8.664-4.066 9.922.749-2.534-2.974-6.993-3.294-9.922-.749z"
            fill="#495057"
          />
        </svg>
      </InputGroup.Text>
    </InputGroup>
  );
}
