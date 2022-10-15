import { SetStateAction, useContext, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { IEmployeeInfo } from "../App";
import { IUserContext, UserContext } from "../contexts/UserContext";
import { ISelectOptions } from "../routes/tasks/AddTask";
import { ITasks } from "../routes/tasks/components/TasksTable";

export default function EmployeeAsyncSelect(props: {
  placeholder: string;
  multi: boolean;
  editable: boolean;
  activeModalInfo?: ITasks | undefined;
  error?: boolean;
  onChange?: (_options: {
    value?: SetStateAction<string>;
    label?: SetStateAction<string>;
    _id?: SetStateAction<string>;
    role?: SetStateAction<string>;
    email?: SetStateAction<string>;
  }) => void;
}): JSX.Element {
  const [employees, setEmployees] = useState<Array<IEmployeeInfo>>([]);
  const [assignedEmps, setAssignedEmps] = useState<Array<ISelectOptions>>([]);

  const [key, setKey] = useState<number>(0);

  const { activeEmployee } = useContext<IUserContext>(UserContext);

  useEffect((): void => {
    (props.placeholder === "Select employee" ||
      props.placeholder === "Select employee(s)") &&
      fetch(`${process.env.REACT_APP_BACKEND_BASE}/getallusers`)
        .then((Response) => Response.json())
        .then((users) =>
          setEmployees(
            users.sort((a: IEmployeeInfo, b: IEmployeeInfo) => {
              return a.name && b.name && a.name.localeCompare(b.name);
            })
          )
        );
    props.placeholder === "Select User(s)" &&
        fetch(`${process.env.REACT_APP_BACKEND_BASE}/getusers`)
          .then((Response) => Response.json())
          .then((users) => {
            setEmployees(
              users.sort((a: { name: string }, b: { name: string }) => {
                return a.name && b.name && a.name.localeCompare(b.name);
              })
            );
          });
  }, []);

  useEffect(() => {
    props.activeModalInfo &&
      props.activeModalInfo.employeeNames.map((name, i) => {
        const defaultEmps: ISelectOptions = {};
        defaultEmps.label = name;
        defaultEmps.value = name;
        defaultEmps.email = props.activeModalInfo?.employeeEmails[i];
        setAssignedEmps((assignedEmps) => [...assignedEmps, defaultEmps]);
        setKey((key) => (key += 1));
      });
    return () => {
      setAssignedEmps([]);
    };
  }, [props.activeModalInfo]);

  const filteredEmployees: Array<IEmployeeInfo> = employees.filter(
    (emp) => emp.name !== activeEmployee.name
  );

  const employeeOptions: Array<ISelectOptions> = filteredEmployees.map(
    (employee) => {
      return {
        value: employee.name,
        label: employee.name,
        email: employee.email,
        _id: employee._id,
        role: employee.role,
      };
    }
  );

  const filterEmps = (inputValue: string) => {
    return employeeOptions.filter((i) =>
      i.label?.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<ISelectOptions[]>((resolve) => {
      setTimeout(() => {
        resolve(filterEmps(inputValue));
      }, 250);
    });

  const handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, "");
    return inputValue;
  };

  return (
    <AsyncSelect
      key={key}
      name="employees"
      placeholder={props.placeholder}
      isMulti={props.multi}
      isDisabled={props.editable ? false : true}
      cacheOptions
      defaultValue={assignedEmps}
      defaultOptions={employeeOptions}
      loadOptions={promiseOptions}
      onInputChange={handleInputChange}
      onChange={(newValue) =>
        props.onChange?.(
          newValue as {
            value: SetStateAction<string>;
            _id: SetStateAction<string>;
            role: SetStateAction<string>;
          }
        )
      }
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          neutral50: "#6c757d",
          text: "black",
          primary25: "rgb(13, 202, 240, 0.4)",
          neutral20: props.error ? "#ff0000" : "#cccccc",
          primary: "#0dcaf0",
        },
      })}
    />
  );
}
