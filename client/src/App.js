import "./App.css";
import { useState } from "react";
import axios from "axios";
import AppRoutes from "./Routes/AppRoutes";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Slide } from 'react-toastify';
function App() {
  const [employeeList, setEmployeeList] = useState([]);

  // const addEmployee = () => {
  //   axios.post("http://localhost:3001/create", {
  //     name: name,
  //     age: age,
  //     country: country,
  //     position: position,
  //     wage: wage,
  //   }).then(() => {
  //     setEmployeeList([
  //       ...employeeList,
  //       {
  //         name: name,
  //         age: age,
  //         country: country,
  //         position: position,
  //         wage: wage,
  //       },
  //     ]);
  //   });
  // };

  // const getEmployees = () => {
  //   axios.get("http://localhost:3001/employees").then((response) => {
  //     setEmployeeList(response.data);
  //   });
  // };

  // const updateEmployeeWage = (id) => {
  //   axios.put("http://localhost:3001/update", { wage: newWage, id: id }).then(
  //     (response) => {
  //       setEmployeeList(
  //         employeeList.map((val) => {
  //           return val.id == id
  //             ? {
  //                 id: val.id,
  //                 name: val.name,
  //                 country: val.country,
  //                 age: val.age,
  //                 position: val.position,
  //                 wage: newWage,
  //               }
  //             : val;
  //         })
  //       );
  //     }
  //   );
  // };

  // const deleteEmployee = (id) => {
  //   axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
  //     setEmployeeList(
  //       employeeList.filter((val) => {
  //         return val.id != id;
  //       })
  //     );
  //   });
  // };

  return (
    <>
      <AppRoutes />
      <ToastContainer draggable={false} limit={1} transition={Slide} hideProgressBar={true} autoClose={3000} closeOnClick
        position="bottom-right" theme='colored'
      />
    </>
   
  );
}

export default App;
