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

app.post("/delete", async function (req, res) {
  const checkedItemId = req.body.checkbox;
  const itemIdToDelete = req.body.itemId;
  const listName = req.body.listName;
  console.log("listName:", listName);
  console.log("checkedItemId:", checkedItemId);
  if (listName === "Today") {
    try {
      const deleteResult = await Item.deleteOne({ _id: itemIdToDelete });
      if (deleteResult.deletedCount === 1) {
        console.log("Item deleted successfully.");
        res.redirect("/");
      } else {
        console.error("Item not found.");
        res.status(404).send("Item not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting item");
    }
  }
  else{
    try {
      const foundList = await List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, { useFindAndModify: false }).exec();
      if (foundList) {
        console.log("Item deleted successfully.");
        res.redirect("/" + listName);
      } else {
        console.error("List not found.");
        res.status(404).send("List not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting item");
    }
  }
});


app.get("/about", function (req, res) {
  res.render("about");
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});