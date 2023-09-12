const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});


const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const workItemsSchema = {
  name: String
};

const WorkItem = mongoose.model("WorkItem", workItemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems)
  .then(() => {
    console.log("Default items added successfully.");
  })
  .catch((error) => {
    console.error("Error adding default items:", error);
  });


app.get("/", async function (req, res) {
  try {
    const foundItems = await Item.find({}).exec();
    res.render("list", { listTitle: "Today", newListItems: foundItems });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving items");
  }
});

app.post("/", async function (req, res) {
  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName
  });

  try {
    await newItem.save();
    console.log("Item added successfully.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
});

app.get("/work", async function (req, res) {
  try {
    const foundWorkItems = await WorkItem.find({}).exec();
    res.render("list", { listTitle: "Work List", newListItems: foundWorkItems });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving work items");
  }
});

app.post("/work", async function (req, res) {
  const workItemName = req.body.newWorkItem;

  const newWorkItem = new WorkItem({
    name: workItemName
  });

  try {
    await newWorkItem.save();
    console.log("Work item added successfully.");
    res.redirect("/work");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding work item");
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
