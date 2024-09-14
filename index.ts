import express from "express";
import { createRoute, RouteCreator } from "./baseApi";
const cors = require("cors");

const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());
const port = 5010;

// // Data file
// const dataFile = "data.json";

// // Load data from the file
// function loadData() {
//   try {
//     const data = fs.readFileSync(dataFile, "utf8");
//     return JSON.parse(data);
//   } catch (err) {
//     return [];
//   }
// }

// // Save data to the file
// function saveData<T>(data: T) {
//   fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
// }

// // API endpoint to get all data
// app.get("/data", (req, res) => {
//   const data = loadData();
//   res.json(data);
// });

// // API endpoint to add new data
// app.post("/data", (req, res) => {
//   const newData = req.body;
//   const data = loadData();
//   data.push(newData);
//   saveData(data);
//   res.json({ message: "Data added successfully" });
// });

// // API endpoint to update existing data
// app.put("/data/:id", (req, res) => {
//   const id = req.params.id;
//   const updatedData = req.body;
//   const data = loadData();
//   const index = data.findIndex((item: any) => item.id === id);
//   if (index !== -1) {
//     data[index] = updatedData;
//     saveData(data);
//     res.json({ message: "Data updated successfully" });
//   } else {
//     res.status(404).json({ message: "Data not found" });
//   }
// });

// // API endpoint to delete existing data
// app.delete("/data/:id", (req, res) => {
//   const id = req.params.id;
//   const data = loadData();
//   const index = data.findIndex((item: any) => item.id === id);
//   if (index !== -1) {
//     data.splice(index, 1);
//     saveData(data);
//     res.json({ message: "Data deleted successfully" });
//   } else {
//     res.status(404).json({ message: "Data not found" });
//   }
// });

createRoute(app, "person");
createRoute(app, "car");
createRoute(app, "dvir");

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
