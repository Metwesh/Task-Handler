import React, { SetStateAction, useEffect, useState } from "react";
import Select from "react-select";
import { IEmployeeInfo } from "../App";
import { ISelectOptions } from "../routes/tasks/AddTask";
import { ITasks } from "../routes/tasks/components/TasksTable";

export default function SyncSelect(props: {
  name: string;
  placeholder: string;
  editable: boolean;
  options: Array<ISelectOptions>;
  defaultModalInfo?: ITasks | undefined;
  employees?: Array<IEmployeeInfo>;
  defaultRole?: string;
  setInputRole?: React.Dispatch<React.SetStateAction<string>>;
  error?: boolean;

  onChange?: (_options: { value: SetStateAction<string> }) => void;
}) {
  const [key, setKey] = useState<number>(0);

  function statusDefaultValuePicker(
    defaultModalInfo: ITasks | undefined,
    options: Array<ISelectOptions>
  ) {
    if (defaultModalInfo?.status === "Incomplete") return options[0];
    else if (defaultModalInfo?.status === "Pending") return options[1];
    else return options[2];
  }
  useEffect(() => {
    setKey((current) => (current += 1));
    props.setInputRole?.(props.defaultRole as string);
  }, [props.defaultRole]);

  function roleDefaultValuePicker(
    defaultRole: string | undefined,
    options: Array<ISelectOptions>
  ) {
    if (defaultRole === "Admin") return options[0];
    else if (defaultRole === "User") return options[1];
  }

  return (
    <Select
      key={key}
      name={props.name}
      placeholder={props.placeholder}
      defaultValue={
        props.name === "status"
          ? statusDefaultValuePicker(props.defaultModalInfo, props.options)
          : props.name === "role"
          ? roleDefaultValuePicker(props.defaultRole, props.options)
          : null
      }
      isDisabled={props.editable ? false : true}
      options={props.options}
      onChange={(newValue) =>
        props.onChange?.(newValue as { value: SetStateAction<string> })
      }
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          neutral50: "#6c757d",
          color: "#000",
          text: "black",
          primary25: "rgb(13, 202, 240, 0.4)",
          neutral20: props.error ? "#ff0000" : "#cccccc",
          primary: "#0dcaf0",
        },
      })}
    />
  );
}
