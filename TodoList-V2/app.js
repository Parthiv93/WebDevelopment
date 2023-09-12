const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB");

    const itemsSchema = {
      name: String
    };

    const Item = mongoose.model("Item", itemsSchema);

    const item1 = new Item ({
      name: "Welcome to your todolist!"
    });

    const item2 = new Item ({
      name: "Hit the + button to add a new item."
    });

    const item3 = new Item ({
      name: "<-- Hit this to delete an item."
    });

    const defaultItems = [item1, item2, item3];

    await Item.insertMany(defaultItems);

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
})();

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName
  });

  newItem.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Item added successfully.");
      res.redirect("/");
    }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
