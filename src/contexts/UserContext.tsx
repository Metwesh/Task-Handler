import { createContext } from "react";
import { IEmployeeInfo, IUserAuth } from "../App";

export interface IUserContext {
  activeEmployee: IEmployeeInfo;
  setActiveEmployee: React.Dispatch<React.SetStateAction<IEmployeeInfo>>;
  setUserAuth: React.Dispatch<React.SetStateAction<IUserAuth>>;
}
export const UserContext = createContext<IUserContext>({
  activeEmployee: {},
  setActiveEmployee: () => {
    /**/
  },
  setUserAuth: () => {
    /**/
  },
});
