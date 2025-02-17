import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Server is Running");
});

const url = process.env.MONGODB_URL;
console.log(url);
if (!url) {
  console.error("MONGODB_URL is not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, minLength: 8, required: true },
  image: String,
});

const userModel = mongoose.model("User", userSchema);

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

app.post("/signup", async (req, res) => {
  const { email, password, confirmPassword, ...otherDetails } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists. Please login.", alert: true });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match", alert: true });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      ...otherDetails,
      email,
      password: hashedPassword,
    });
    const token = generateToken(newUser);


    return res.status(201).json({
      message: "User created successfully",
      token,
      alert: false,
      user: { email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first.", alert: false });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect password", alert: false });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "User logged in successfully",
      token, 
      alert: true,
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred. Please try again.", alert: false });
  }
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user; 
      next(); 
    });
  } else {
    res.sendStatus(401); 
  }
};

app.get("/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
      return res.status(400).json({ message: "Query parameter is required." }); 
  }

  try {
      const searchUrl = `${process.env.URL}${encodeURIComponent(query)}&apiKey=${process.env.API_KEY}`;
      console.log(searchUrl);
      const result = await fetch(searchUrl);

      if (!result.ok) {
          throw new Error(`External API error: ${result.statusText}`); 
      }

      const data = await result.json();
      res.status(200).json({ result: data }); 
  } catch (error) {
      console.error("Search error:", error); 
      res.status(500).json({ message: "An error occurred while searching." }); 
  }
});


app.get("/profile", authenticateJWT, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password"); 
    if (user) {
      return res.status(200).json({
        message: "User profile retrieved successfully",
        data: user,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
