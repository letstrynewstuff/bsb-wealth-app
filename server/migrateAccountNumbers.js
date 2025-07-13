require("dotenv").config();
const mongoose = require("mongoose");

// 1. Define the same schema structure used in your app (just enough to access users and their accounts)
const userSchema = new mongoose.Schema({
  accounts: [
    {
      type: {
        type: String,
      },
      balance: Number,
      status: String,
      accountNumber: String,
    },
  ],
});

const User = mongoose.model("User", userSchema, "users"); // "users" is the actual collection name

// 2. Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// 3. Generate a unique 10-digit account number
async function generateUniqueAccountNumber() {
  let exists = true;
  let number;
  while (exists) {
    number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    exists = await User.findOne({ "accounts.accountNumber": number });
  }
  return number;
}

// 4. Run the migration
async function migrateAccountNumbers() {
  const users = await User.find({});
  console.log(`🔎 Found ${users.length} users`);

  for (const user of users) {
    let updated = false;
    for (let account of user.accounts) {
      if (!account.accountNumber) {
        account.accountNumber = await generateUniqueAccountNumber();
        updated = true;
      }
    }

    if (updated) {
      await user.save();
      console.log(`✅ Updated user ${user._id}`);
    } else {
      console.log(`➡️ Skipped user ${user._id} (already has account numbers)`);
    }
  }

  console.log("🎉 Migration complete.");
  mongoose.disconnect();
}

// 5. Execute
(async () => {
  await connectToDB();
  await migrateAccountNumbers();
})();
