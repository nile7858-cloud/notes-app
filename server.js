const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB connect (apna link yaha paste kar)
mongoose.connect("mongodb+srv://KumarKK:Maguar%407209@cluster0.9g6bdma.mongodb.net/encryptDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// 👤 User Schema
const User = mongoose.model("User", {
  username: String,
  password: String
});

// 📝 Note Schema
const Note = mongoose.model("Note", {
  userId: String,
  text: String
});

// 🔐 Signup
app.post("/signup", async (req,res)=>{
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password,10);

  const user = new User({ username, password: hash });
  await user.save();

  res.json({ message:"Signup success" });
});

// 🔑 Login
app.post("/login", async (req,res)=>{
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if(!user) return res.json({ success:false });

  const match = await bcrypt.compare(password, user.password);

  if(match){
    res.json({ success:true, userId: user._id });
  } else {
    res.json({ success:false });
  }
});

// 📝 Save note
app.post("/save-note", async (req,res)=>{
  const { userId, text } = req.body;

  await new Note({ userId, text }).save();

  res.json({ message:"Saved" });
});

// 📜 Get notes
app.post("/get-notes", async (req,res)=>{
  const { userId } = req.body;

  const notes = await Note.find({ userId });

  res.json(notes);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});