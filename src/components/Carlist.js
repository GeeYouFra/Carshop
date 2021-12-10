import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddCar from "./AddCar";
import EditCar from "./EditCar";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

function Carlist() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchCars = () => {
    fetch("http://carrestapi.herokuapp.com/cars")
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  const deleteCar = (url) => {
    if (window.confirm("Are you sure?")) {
      fetch(url, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setMsg("Car deleted!");
            setOpen(true);
            fetchCars();
          } else {
            alert("Something went wrong");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const addCar = (car) => {
    fetch("http://carrestapi.herokuapp.com/cars", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(car),
    })
      //.then((response) => fetchCars())
      //.catch((err) => console.error(err));
      .then((response) => {
        if (response.ok) {
          setMsg("Car added!");
          setOpen(true);
          fetchCars();
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.error(err));
  };

  const editCar = (link, updatedCar) => {
    fetch(link, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedCar),
    })
      .then((response) => {
        if (response.ok) {
          setMsg("Car edited!");
          setOpen(true);
          fetchCars();
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "brand", sortable: true, filter: true },
    { field: "model", sortable: true, filter: true },
    { field: "color", sortable: true, filter: true },
    { field: "fuel", width: 100, sortable: true, filter: true },
    { field: "year", width: 100, sortable: true, filter: true },
    { field: "price", width: 100, sortable: true, filter: true },
    {
      headerName: " ",
      sortable: false,
      filter: false,
      width: 120,
      field: "_links.self.href",
      cellRendererFramework: (params) => (
        <EditCar editCar={editCar} row={params} />
      ),
    },
    {
      headerName: " ",
      sortable: false,
      filter: false,
      width: 120,
      field: "_links.self.href",
      cellRendererFramework: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => deleteCar(params.value)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AddCar addCar={addCar} />
      <div
        className="ag-theme-material"
        style={{ height: 600, width: "90%", margin: "auto" }}
      >
        <AgGridReact
          rowData={cars}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          suppressCellSelection={true}
        />
      </div>
      <Snackbar
        open={open}
        message={msg}
        autoHideDuration={3000}
        onClose={handleClose}
      />
    </div>
  );
}

export default Carlist;
