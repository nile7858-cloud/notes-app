const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

/* ================= CORS FIX (FINAL) ================= */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cors());
app.use(express.json());

// preflight (OPTIONS) handle
app.options("*", (req, res) => {
  res.sendStatus(200);
});

/* ================= ROOT CHECK ================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ================= MONGODB ================= */
mongoose.connect("YOUR_MONGO_URL")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* ================= MODELS ================= */
const User = mongoose.model("User", {
  username: String,
  password: String
});

const Note = mongoose.model("Note", {
  userId: String,
  text: String
});

/* ================= ROUTES ================= */

// signup
app.post("/signup", async (req,res)=>{
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await new User({ username, password: hash }).save();

  res.json({ message:"Signup success" });
});

// login
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

// save note
app.post("/save-note", async (req,res)=>{
  const { userId, text } = req.body;

  await new Note({ userId, text }).save();

  res.json({ message:"Saved" });
});

// get notes
app.post("/get-notes", async (req,res)=>{
  const { userId } = req.body;

  const notes = await Note.find({ userId });

  res.json(notes);
});

/* ================= PORT ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server running on port " + PORT));