// backupUsers.js
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model("User", userSchema, "users"); // use "users" as collection name

async function backupUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    fs.writeFileSync("users_backup.json", JSON.stringify(users, null, 2));

    console.log(`✅ Backed up ${users.length} users to users_backup.json`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Backup failed:", error.message);
    process.exit(1);
  }
}

backupUsers();
