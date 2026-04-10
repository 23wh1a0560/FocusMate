const fs = require('fs');

// Sample data (FocusMate style)
const tasks = [
  {
    title: "Complete assignment",
    priority: "high"
  },
  {
    title: "Study DSA",
    priority: "medium"
  }
];

// Write data to file
fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
console.log("Tasks written to file successfully");

// Read data from file
const data = fs.readFileSync('tasks.json', 'utf-8');
const parsedData = JSON.parse(data);

console.log("Tasks read from file:");
console.log(parsedData);