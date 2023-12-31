const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

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

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List =mongoose.model("List", listSchema);


app.get("/", async function (req, res) {
  try {
    const foundItems = await Item.find({}).exec();
    if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
            .then(() => {
              console.log("Default items added successfully.");
            })
            .catch((error) => {
              console.error("Error adding default items:", error);
            });
            res.redirect("/");
    }
    else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving items");
  }
});

app.get("/:customListName", async function (req, res) {
  const customListName = req.params.customListName;
  try {
    const foundList = await List.findOne({ name: customListName }).exec();
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      await list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving or creating list");
  }
});


app.post("/", async function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({
    name: itemName
  });
  if (listName === "Today") {
    try {
      await newItem.save();
      console.log("Item added successfully.");
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding item");
    }
  }
  else {
    try {
      const foundList = await List.findOne({ name: listName }).exec();
      if (foundList) {
        foundList.items.push(newItem);
        await foundList.save();
        res.redirect("/" + listName);
      } else {
        console.error("List not found.");
        res.status(404).send("List not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error finding or updating list");
    }
  }
});

app.post("/delete/:listName", async function (req, res) {
  const listName = req.params.listName;
  const itemIdToDelete = req.body.itemId;
  try {
    if (listName === "Today") {
      const deletedItem = await Item.findOneAndDelete({ _id: itemIdToDelete });
      if (deletedItem) {
        console.log("Item deleted successfully from default list.");
        res.json({ success: true });
      } else {
        console.error("Item not found in default list.");
        res.status(404).json({ success: false, error: "Item not found in default list" });
      }
    } else {
      const list = await List.findOne({ name: listName });
      if (list) {
        list.items.pull(itemIdToDelete);
        await list.save();
        console.log("Item deleted successfully from custom list.");
        res.json({ success: true });
      } else {
        console.error("Custom list not found.");
        res.status(404).json({ success: false, error: "Custom list not found" });
      }
    }
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ success: false, error: "Error deleting item" });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});