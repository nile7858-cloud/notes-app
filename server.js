const express = require("express");
const cors = require("cors");

const app = express();

// ✅ VERY IMPORTANT (custom headers fix)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ✅ CORS middleware
app.use(cors());

// ✅ body parser
app.use(express.json());

// ✅ preflight handle (VERY IMPORTANT)
app.options("*", (req, res) => {
  res.sendStatus(200);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ ROOT CHECK
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ MONGODB CONNECT (apna URL lagana)
mongoose.connect("YOUR_MONGO_URL")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// ✅ USER MODEL
const User = mongoose.model("User", {
  username: String,
  password: String
});

// ✅ NOTE MODEL
const Note = mongoose.model("Note", {
  userId: String,
  text: String
});

// ✅ SIGNUP
app.post("/signup", async (req,res)=>{
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await new User({ username, password: hash }).save();

  res.json({ message: "Signup success" });
});

// ✅ LOGIN
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

// ✅ SAVE NOTE
app.post("/save-note", async (req,res)=>{
  const { userId, text } = req.body;

  await new Note({ userId, text }).save();

  res.json({ message:"Saved" });
});

// ✅ GET NOTES
app.post("/get-notes", async (req,res)=>{
  const { userId } = req.body;

  const notes = await Note.find({ userId });

  res.json(notes);
});

// ✅ PORT FIX (IMPORTANT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server running on port " + PORT));