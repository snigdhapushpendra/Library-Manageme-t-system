// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  available: Boolean,
  issuedTo: String,
  issueDate: Date,
  returnDate: Date,
});

const Book = mongoose.model("Book", bookSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  role: { type: String, enum: ["admin", "user"], required: true },
  password: String,
  membership: { type: String, enum: ["6 months", "1 year", "2 years"], default: "6 months" },
});

const User = mongoose.model("User", userSchema);

// Routes
// Book Routes
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post("/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

app.put("/books/:id", async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

// User Routes
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name, password });
  if (user) {
    res.json({ message: "Login successful", user });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Issue Book
app.post("/issue", async (req, res) => {
  const { bookId, userId } = req.body;
  const book = await Book.findById(bookId);
  if (!book || !book.available) {
    return res.status(400).json({ message: "Book not available" });
  }
  book.issuedTo = userId;
  book.issueDate = new Date();
  book.returnDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  book.available = false;
  await book.save();
  res.json(book);
});

// Return Book
app.post("/return", async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book || book.available) {
    return res.status(400).json({ message: "Book not issued" });
  }
  book.issuedTo = null;
  book.issueDate = null;
  book.returnDate = null;
  book.available = true;
  await book.save();
  res.json({ message: "Book returned successfully" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
