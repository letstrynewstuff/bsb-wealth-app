// const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const { Server } = require("socket.io");
// const http = require("http");
// const nodemailer = require("nodemailer");
// const otpGenerator = require("otp-generator");
// const dotenv = require("dotenv");

// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000", "http://localhost:5173"],
//     credentials: true,
//   },
// });

// // Middleware
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:5173"],
//     credentials: true,
//   })
// );
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Nodemailer Setup
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// // Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["client", "admin"], default: "client" },
//   status: {
//     type: String,
//     enum: ["pending", "active", "suspended"],
//     default: "pending",
//   },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   dateOfBirth: { type: Date, required: true },
//   nationality: { type: String, required: true },
//   accounts: [
//     {
//       type: {
//         type: String,
//         enum: ["checking", "savings", "debitcard", "investment"],
//         required: true,
//       },
//       accountNumber: { type: String, required: true, unique: true },
//       balance: { type: Number, default: 0 },
//       status: {
//         type: String,
//         enum: ["pending", "active", "suspended"],
//         default: "pending",
//       },
//     },
//   ],
// });

// const transactionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: false,
//   },
//   accountType: {
//     type: String,
//     enum: ["checking", "savings", "debitcard", "investment"],
//     required: true,
//   },
//   accountNumber: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { type: Date, default: Date.now },
//   status: {
//     type: String,
//     enum: ["successful", "pending", "onhold", "declined"],
//     default: "pending",
//   },
//   description: { type: String },
//   recipientAccountNumber: { type: String },
//   recipientAccountType: {
//     type: String,
//     enum: ["checking", "savings", "debitcard", "investment"],
//   },
//   recipientBank: { type: String },
//   recipientName: { type: String },
// });

// const otpSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   otp: { type: String, required: true },
//   transferData: { type: Object, required: true },
//   createdAt: { type: Date, default: Date.now, expires: 300 }, // OTP expires in 5 minutes
// });

// // Support Message Schema
// const supportMessageSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   username: { type: String, required: true },
//   email: { type: String, required: false },
//   message: { type: String, required: true },
//   sender: { type: String, enum: ["client", "admin"], required: true },
//   timestamp: { type: Date, default: Date.now },
//   status: { type: String, enum: ["open", "resolved"], default: "open" },
// });

// const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);

// const User = mongoose.model("User", userSchema);
// const Transaction = mongoose.model("Transaction", transactionSchema);
// const OTP = mongoose.model("OTP", otpSchema);

// // Generate Unique Account Number
// const generateAccountNumber = async () => {
//   let number;
//   let exists = true;
//   while (exists) {
//     number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
//     exists = await User.findOne({ "accounts.accountNumber": number });
//   }
//   return number;
// };

// // JWT Middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
//     console.log("No token provided");
//     return res
//       .status(401)
//       .json({ message: "Access denied: No token provided" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       console.log("Token verification failed:", err.message);
//       return res
//         .status(403)
//         .json({ message: "Invalid token", error: err.message });
//     }
//     req.user = user;
//     next();
//   });
// };

// // Admin Middleware
// const isAdmin = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     console.log("Admin access denied, role:", req.user.role);
//     return res.status(403).json({ message: "Admin access required" });
//   }
//   next();
// };

// // Send OTP Email
// const sendOTPEmail = async (userEmail, numericOTP) => {
//   if (!process.env.ORGANIZER_EMAIL) {
//     console.warn("⚠️ Warning: ORGANIZER_EMAIL is not defined in .env");
//     return;
//   }

//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: process.env.ORGANIZER_EMAIL,
//     subject:
//       "Your One-Time Password (OTP) for Secure Access - Bennington State Bank",
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//         <h1 style="color: #1a73e8; font-size: 24px;"><strong>Bennington State Bank</strong></h1>
//         <p>Dear Admin,</p>
//         <p>Thank you for banking with <strong style="color: #1a73e8;">Bennington State Bank</strong>. To ensure the security of a user's account, we have generated a One-Time Password (OTP) for the following user:</p>
//         <p><strong>User Email:</strong> ${userEmail}</p>
//         <h2 style="font-size: 22px; color: #000; margin: 20px 0;">Your OTP: <span style="color: #1a73e8;">${numericOTP}</span></h2>
//         <h3>Important Instructions:</h3>
//         <ul>
//           <li>This OTP is valid for <strong>10 minutes</strong> only. Please use it promptly.</li>
//           <li><strong>Do not share</strong> this OTP with anyone, including bank staff.</li>
//           <li>If this request was not initiated by the user, contact Customer Support immediately.</li>
//         </ul>
//         <p style="font-size: 14px; color: #666;">
//           For your security, <strong>Bennington State Bank</strong> will never ask for your OTP or sensitive information via email or phone.
//           <br><br>
//           Customer Support: <strong>1-800-555-1234</strong> <br>
//           Email: <a href="mailto:support@benningtonstatebank.com">support@benningtonstatebank.com</a>
//         </p>
//         <p>Best regards,<br><strong>Bennington State Bank Customer Service Team</strong></p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("✅ OTP email sent to admin:", process.env.ORGANIZER_EMAIL);
//   } catch (error) {
//     console.error("❌ Email send error:", error);
//     throw error;
//   }
// };

// // Send Support Email to Admin
// const sendSupportEmail = async (userEmail, username, message) => {
//   if (!process.env.ORGANIZER_EMAIL) {
//     console.warn("⚠️ Warning: ORGANIZER_EMAIL is not defined in .env");
//     return;
//   }

//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: process.env.ORGANIZER_EMAIL,
//     subject: "New Support Message - Bennington State Bank",
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//         <h1 style="color: #1a73e8; font-size: 24px;"><strong>Bennington State Bank</strong></h1>
//         <p>Dear Admin,</p>
//         <p>A new support message has been received from a client:</p>
//         <p><strong>Username:</strong> ${username}</p>
//         <p><strong>Email:</strong> ${userEmail}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//         <p>Please respond via the admin support dashboard or contact the client directly.</p>
//         <p style="font-size: 14px; color: #666;">
//           Customer Support: <strong>1-800-555-1234</strong> <br>
//           Email: <a href="mailto:support@benningtonstatebank.com">support@benningtonstatebank.com</a>
//         </p>
//         <p>Best regards,<br><strong>Bennington State Bank System</strong></p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("✅ Support email sent to admin:", process.env.ORGANIZER_EMAIL);
//   } catch (error) {
//     console.error("❌ Support email send error:", error);
//     throw error;
//   }
// };

// // Routes
// // Admin: Login
// app.post("/api/admin/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username, role: "admin" });
//     if (!user) {
//       console.log("Admin login failed: User not found or not admin");
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     if (user.status !== "active") {
//       console.log("Admin login failed: Account not active");
//       return res.status(403).json({ message: "Account not active" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Admin login failed: Invalid password");
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         firstName: user.firstName,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Admin login error:", error);
//     res.status(400).json({ message: "Error logging in", error });
//   }
// });

// // Admin: Reply to Support Message
// app.post(
//   "/api/admin/support/reply",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     const { messageId, reply } = req.body;

//     if (!messageId || !reply || !reply.trim()) {
//       console.log("Support reply failed: Missing messageId or reply");
//       return res
//         .status(400)
//         .json({ message: "Message ID and reply are required" });
//     }

//     try {
//       const originalMessage = await SupportMessage.findById(messageId);
//       if (!originalMessage) {
//         console.log(
//           "Support reply failed: Original message not found",
//           messageId
//         );
//         return res.status(404).json({ message: "Original message not found" });
//       }

//       const admin = await User.findOne({ role: "admin" });
//       if (!admin) {
//         console.log("Support reply failed: Admin not found");
//         return res.status(404).json({ message: "Admin not found" });
//       }

//       const supportReply = new SupportMessage({
//         userId: originalMessage.userId,
//         username: originalMessage.username,
//         email: originalMessage.email,
//         message: reply.trim(),
//         sender: "admin",
//         timestamp: new Date(),
//         status: "open",
//       });

//       await supportReply.save();
//       await SupportMessage.updateOne(
//         { _id: messageId },
//         { status: "resolved" }
//       );

//       io.emit("supportReply", {
//         userId: originalMessage.userId,
//         username: originalMessage.username,
//         email: originalMessage.email,
//         message: supportReply.message,
//         timestamp: supportReply.timestamp,
//         status: supportReply.status,
//         _id: supportReply._id,
//       });

//       console.log("Support reply sent for message:", messageId);
//       res.status(201).json({ message: "Reply sent successfully" });
//     } catch (error) {
//       console.error("Support reply error:", error);
//       res.status(400).json({ message: "Error sending reply", error });
//     }
//   }
// );

// // Admin: Create Admin User (One-Time Setup)
// app.post("/api/setup-admin", async (req, res) => {
//   const existingAdmin = await User.findOne({ role: "admin" });
//   if (existingAdmin) {
//     console.log("Admin creation failed: Admin already exists");
//     return res.status(403).json({ message: "Admin already exists" });
//   }
//   try {
//     const hashedPassword = await bcrypt.hash("openAdmin123", 10);
//     const adminUser = new User({
//       username: "Admin",
//       password: hashedPassword,
//       role: "admin",
//       status: "active",
//       firstName: "Admin",
//       lastName: "User",
//       email: "admin@example.com",
//       phone: "+1234567890",
//       address: "123 Admin St",
//       dateOfBirth: new Date("1980-01-01"),
//       nationality: "US",
//       accounts: [
//         {
//           type: "checking",
//           accountNumber: await generateAccountNumber(),
//           balance: 1000,
//           status: "active",
//         },
//       ],
//     });
//     await adminUser.save();
//     console.log("Admin created successfully:", adminUser._id);
//     res.status(201).json({ message: "Admin created", userId: adminUser._id });
//   } catch (error) {
//     if (error.code === 11000) {
//       console.log(
//         "Admin creation failed: Username, email, or account number exists"
//       );
//       return res
//         .status(400)
//         .json({ message: "Username, email, or account number already exists" });
//     }
//     console.error("Admin creation error:", error);
//     res.status(500).json({ message: "Error creating admin", error });
//   }
// });

// // Admin: Create User Account
// app.post("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
//   const {
//     username,
//     password,
//     accounts,
//     firstName,
//     lastName,
//     email,
//     phone,
//     address,
//     dateOfBirth,
//     nationality,
//   } = req.body;
//   if (
//     !username ||
//     !password ||
//     !accounts ||
//     !firstName ||
//     !lastName ||
//     !email ||
//     !phone ||
//     !address ||
//     !dateOfBirth ||
//     !nationality
//   ) {
//     console.log("User creation failed: Missing required fields");
//     return res.status(400).json({ message: "Missing required fields" });
//   }
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userAccounts = await Promise.all(
//       accounts.map(async (acc) => ({
//         type: acc.type,
//         accountNumber: await generateAccountNumber(),
//         balance: parseFloat(acc.balance) || 0,
//         status: "active",
//       }))
//     );
//     const user = new User({
//       username,
//       password: hashedPassword,
//       firstName,
//       lastName,
//       email,
//       phone,
//       address,
//       dateOfBirth: new Date(dateOfBirth),
//       nationality,
//       role: "client",
//       status: "active",
//       accounts: userAccounts,
//     });
//     await user.save();
//     io.emit("accountStatusUpdate", { userId: user._id, status: "active" });
//     console.log("User created successfully:", user._id);
//     res.status(201).json({ message: "User created", userId: user._id });
//   } catch (error) {
//     if (error.code === 11000) {
//       console.log(
//         "User creation failed: Username, email, or account number exists"
//       );
//       return res
//         .status(400)
//         .json({ message: "Username, email, or account number already exists" });
//     }
//     console.error("User creation error:", error);
//     res.status(400).json({ message: "Error creating user", error });
//   }
// });

// // Admin: Add New Account for Existing User
// app.post(
//   "/api/admin/users/:userId/accounts",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     const { userId } = req.params;
//     const { type, balance } = req.body;
//     if (
//       !type ||
//       !["checking", "savings", "debitcard", "investment"].includes(type)
//     ) {
//       console.log("Add account failed: Invalid or missing account type");
//       return res
//         .status(400)
//         .json({ message: "Invalid or missing account type" });
//     }
//     try {
//       const user = await User.findById(userId);
//       if (!user) {
//         console.log("Add account failed: User not found", userId);
//         return res.status(404).json({ message: "User not found" });
//       }
//       if (user.role !== "client") {
//         console.log("Add account failed: User is not a client");
//         return res.status(403).json({ message: "User is not a client" });
//       }
//       const accountExists = user.accounts.find((acc) => acc.type === type);
//       if (accountExists) {
//         console.log("Add account failed: Account type already exists", type);
//         return res.status(400).json({
//           message: `Account type ${type} already exists for this user`,
//         });
//       }
//       const newAccount = {
//         type,
//         accountNumber: await generateAccountNumber(),
//         balance: parseFloat(balance) || 0,
//         status: "active",
//       };
//       user.accounts.push(newAccount);
//       await user.save();
//       io.emit("accountStatusUpdate", { userId: user._id, status: "active" });
//       console.log("Account added for user:", user._id, "Account:", newAccount);
//       res
//         .status(201)
//         .json({ message: "Account added successfully", account: newAccount });
//     } catch (error) {
//       if (error.code === 11000) {
//         console.log("Add account failed: Account number exists");
//         return res
//           .status(400)
//           .json({ message: "Account number already exists" });
//       }
//       console.error("Add account error:", error);
//       res.status(400).json({ message: "Error adding account", error });
//     }
//   }
// );

// // Admin: Approve Pending User Account
// app.put(
//   "/api/admin/users/:userId/approve",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     try {
//       const user = await User.findById(req.params.userId);
//       if (!user) {
//         console.log("User approval failed: User not found", req.params.userId);
//         return res.status(404).json({ message: "User not found" });
//       }
//       user.status = "active";
//       user.accounts.forEach((acc) => (acc.status = "active"));
//       await user.save();
//       io.emit("accountStatusUpdate", { userId: user._id, status: "active" });
//       console.log("User approved:", user._id);
//       res.json({ message: "User approved" });
//     } catch (error) {
//       console.error("User approval error:", error);
//       res.status(400).json({ message: "Error approving user", error });
//     }
//   }
// );

// // Admin: Suspend/Activate User Account
// app.put(
//   "/api/admin/users/:userId/status",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     const { status } = req.body;
//     if (!["active", "suspended"].includes(status)) {
//       console.log("User status update failed: Invalid status", status);
//       return res.status(400).json({ message: "Invalid status" });
//     }
//     try {
//       const user = await User.findById(req.params.userId);
//       if (!user) {
//         console.log(
//           "User status update failed: User not found",
//           req.params.userId
//         );
//         return res.status(404).json({ message: "User not found" });
//       }
//       user.status = status;
//       user.accounts.forEach((acc) => (acc.status = status));
//       await user.save();
//       io.emit("accountStatusUpdate", { userId: user._id, status });
//       console.log(`User ${status}:`, user._id);
//       res.json({ message: `User ${status}` });
//     } catch (error) {
//       console.error("User status update error:", error);
//       res.status(400).json({ message: `Error updating user status`, error });
//     }
//   }
// );

// // Admin: Credit/Debit User Account
// app.post(
//   "/api/admin/credit-debit-user",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     const {
//       userId,
//       accountType,
//       accountNumber,
//       amount,
//       date,
//       description,
//       action,
//     } = req.body;
//     if (
//       !userId ||
//       !accountType ||
//       !accountNumber ||
//       !amount ||
//       !date ||
//       !action ||
//       !["credit", "debit"].includes(action)
//     ) {
//       console.log("User credit/debit failed: Missing fields or invalid action");
//       return res
//         .status(400)
//         .json({ message: "Missing required fields or invalid action" });
//     }
//     if (parseFloat(amount) <= 0) {
//       console.log("User credit/debit failed: Amount must be positive");
//       return res.status(400).json({ message: "Amount must be positive" });
//     }
//     try {
//       const user = await User.findById(userId);
//       if (!user) {
//         console.log("User credit/debit failed: User not found", userId);
//         return res.status(404).json({ message: "User not found" });
//       }
//       const account = user.accounts.find(
//         (acc) => acc.type === accountType && acc.accountNumber === accountNumber
//       );
//       if (!account) {
//         console.log(
//           "User credit/debit failed: Account not found",
//           accountType,
//           accountNumber
//         );
//         return res.status(404).json({ message: "Account not found" });
//       }
//       if (account.status !== "active") {
//         console.log("User credit/debit failed: Account not active");
//         return res.status(403).json({ message: "Account not active" });
//       }
//       if (action === "debit" && account.balance < parseFloat(amount)) {
//         console.log("User credit/debit failed: Insufficient balance");
//         return res.status(400).json({ message: "Insufficient balance" });
//       }
//       const adjustment =
//         action === "credit" ? parseFloat(amount) : -parseFloat(amount);
//       await User.updateOne(
//         { _id: userId, "accounts.accountNumber": accountNumber },
//         { $inc: { "accounts.$.balance": adjustment } }
//       );
//       const transaction = new Transaction({
//         userId,
//         accountType,
//         accountNumber,
//         amount: adjustment,
//         date: new Date(date),
//         status: "successful",
//         description: description || `Admin ${action}`,
//       });
//       await transaction.save();
//       io.emit("transactionUpdate", transaction);
//       io.emit("balanceUpdate", {
//         userId,
//         accountType,
//         accountNumber,
//         balance: account.balance + adjustment,
//       });
//       console.log(`User ${action}ed:`, userId, accountType, accountNumber);
//       res.json({ message: `User ${action}ed successfully`, transaction });
//     } catch (error) {
//       console.error(`User ${action} error:`, error);
//       res.status(400).json({ message: `Error ${action}ing user`, error });
//     }
//   }
// );

// // Admin: Update Account Balance
// app.put(
//   "/api/admin/users/:userId/accounts/:accountNumber/balance",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     const { balance } = req.body;
//     if (typeof balance !== "number" || balance < 0) {
//       console.log("Balance update failed: Invalid balance");
//       return res.status(400).json({ message: "Invalid balance" });
//     }
//     try {
//       const user = await User.findById(req.params.userId);
//       if (!user) {
//         console.log("Balance update failed: User not found", req.params.userId);
//         return res.status(404).json({ message: "User not found" });
//       }
//       const account = user.accounts.find(
//         (acc) => acc.accountNumber === req.params.accountNumber
//       );
//       if (!account) {
//         console.log(
//           "Balance update failed: Account not found",
//           req.params.accountNumber
//         );
//         return res.status(404).json({ message: "Account not found" });
//       }
//       if (account.status !== "active") {
//         console.log("Balance update failed: Account not active");
//         return res.status(403).json({ message: "Account not active" });
//       }
//       await User.updateOne(
//         {
//           _id: req.params.userId,
//           "accounts.accountNumber": req.params.accountNumber,
//         },
//         { $set: { "accounts.$.balance": parseFloat(balance) } }
//       );
//       io.emit("balanceUpdate", {
//         userId: user._id,
//         accountType: account.type,
//         accountNumber: account.accountNumber,
//         balance: parseFloat(balance),
//       });
//       console.log("Balance updated:", user._id, account.accountNumber);
//       res.json({ message: "Balance updated" });
//     } catch (error) {
//       console.error("Balance update error:", error);
//       res.status(400).json({ message: "Error updating balance", error });
//     }
//   }
// );

// // Admin: Add Client
// app.post(
//   "/api/admin/add-client",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       address,
//       dateOfBirth,
//       nationality,
//       username,
//       password,
//       accounts,
//     } = req.body;
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !phone ||
//       !address ||
//       !dateOfBirth ||
//       !nationality ||
//       !username ||
//       !password ||
//       !accounts ||
//       !accounts.length
//     ) {
//       console.log("Add client failed: Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const userAccounts = await Promise.all(
//         accounts.map(async (acc) => ({
//           type: acc.type,
//           accountNumber: await generateAccountNumber(),
//           balance: parseFloat(acc.balance) || 0,
//           status: "active",
//         }))
//       );
//       const user = new User({
//         firstName,
//         lastName,
//         email,
//         phone,
//         address,
//         dateOfBirth: new Date(dateOfBirth),
//         nationality,
//         username,
//         password: hashedPassword,
//         role: "client",
//         status: "active",
//         accounts: userAccounts,
//       });
//       await user.save();
//       io.emit("accountStatusUpdate", { userId: user._id, status: "active" });
//       console.log("Client added:", user._id);
//       res.json({ message: "Client added successfully", userId: user._id });
//     } catch (error) {
//       if (error.code === 11000) {
//         console.log(
//           "Add client failed: Username, email, or account number exists"
//         );
//         return res.status(400).json({
//           message: "Username, email, or account number already exists",
//         });
//       }
//       console.error("Add client error:", error);
//       res.status(400).json({ message: "Error adding client", error });
//     }
//   }
// );

// // Admin: Get Support Messages
// app.get(
//   "/api/admin/support-messages",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     try {
//       const { userId, status } = req.query;
//       const query = {};
//       if (userId) query.userId = userId;
//       if (status) query.status = status;
//       const messages = await SupportMessage.find(query).sort({ timestamp: -1 });
//       console.log("Fetched support messages:", messages.length);
//       res.json(messages);
//     } catch (error) {
//       console.error("Fetch support messages error:", error);
//       res
//         .status(500)
//         .json({ message: "Error fetching support messages", error });
//     }
//   }
// );

// // Admin: Get All Users
// app.get("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const users = await User.find({ role: "client" }, "-password");
//     console.log("Fetched users:", users.length, "clients");
//     res.json(users);
//   } catch (error) {
//     console.error("Fetch users error:", error);
//     res.status(500).json({ message: "Error fetching users", error });
//   }
// });

// // Client: Register
// app.post("/api/register", async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     phone,
//     address,
//     dateOfBirth,
//     nationality,
//     username,
//     password,
//     accounts,
//   } = req.body;
//   if (
//     !firstName ||
//     !lastName ||
//     !email ||
//     !phone ||
//     !address ||
//     !dateOfBirth ||
//     !nationality ||
//     !username ||
//     !password ||
//     !accounts ||
//     !accounts.length
//   ) {
//     console.log("Registration failed: Missing required fields");
//     return res.status(400).json({ message: "Missing required fields" });
//   }
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userAccounts = await Promise.all(
//       accounts.map(async (acc) => ({
//         type: acc.type,
//         accountNumber: await generateAccountNumber(),
//         balance: 0,
//         status: "pending",
//       }))
//     );
//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       phone,
//       address,
//       dateOfBirth: new Date(dateOfBirth),
//       nationality,
//       username,
//       password: hashedPassword,
//       role: "client",
//       status: "pending",
//       accounts: userAccounts,
//     });
//     await user.save();
//     io.emit("newUserPending", { userId: user._id, username });
//     console.log("User registered, pending approval:", user._id);
//     res.status(201).json({ message: "Registration submitted for approval" });
//   } catch (error) {
//     if (error.code === 11000) {
//       console.log(
//         "Registration failed: Username, email, or account number exists"
//       );
//       return res
//         .status(400)
//         .json({ message: "Username, email, or account number already exists" });
//     }
//     console.error("Registration error:", error);
//     res.status(400).json({ message: "Error registering user", error });
//   }
// });

// // Client: Login
// app.post("/api/client/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username, role: "client" });
//     if (!user) {
//       console.log("Client login failed: User not found or not client");
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     if (user.status !== "active") {
//       console.log("Client login failed: Account not active");
//       return res.status(403).json({ message: "Account not active" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Client login failed: Invalid password");
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         firstName: user.firstName,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Client login error:", error);
//     res.status(400).json({ message: "Error logging in", error });
//   }
// });

// // Client: Initiate Transfer (Generate OTP)

// app.post("/api/client/transfers", authenticateToken, async (req, res) => {
//   const {
//     accountType,
//     accountNumber,
//     recipientAccountNumber,
//     recipientAccountType,
//     amount,
//     description,
//     recipientBank,
//     recipientName, // NEW
//   } = req.body;

//   if (
//     !accountType ||
//     !accountNumber ||
//     !recipientAccountNumber ||
//     !recipientAccountType ||
//     !amount ||
//     !recipientBank ||
//     !recipientName
//   ) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   if (parseFloat(amount) <= 0) {
//     return res.status(400).json({ message: "Amount must be positive" });
//   }

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const senderAccount = user.accounts.find(
//       (acc) => acc.type === accountType && acc.accountNumber === accountNumber
//     );

//     if (!senderAccount) {
//       return res.status(404).json({ message: "Sender account not found" });
//     }

//     if (senderAccount.status !== "active") {
//       return res.status(403).json({ message: "Account not active" });
//     }

//     if (senderAccount.balance < parseFloat(amount)) {
//       return res.status(400).json({ message: "Insufficient funds" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP

//     const otpRecord = new OTP({
//       userId: req.user.id,
//       otp,
//       expiresAt: Date.now() + 10 * 60 * 1000,
//       transferData: {
//         accountType,
//         accountNumber,
//         recipientAccountNumber,
//         recipientAccountType,
//         amount: parseFloat(amount),
//         description: description || `Transfer to ${recipientName}`,
//         recipientBank,
//         recipientName,
//       },
//     });

//     await otpRecord.save();
//     await sendOTPEmail("Client ACH Request", otp); // ✅ static label or remove entirely
//     res.json({ message: "OTP sent to your email." });
//   } catch (error) {
//     console.error("Transfer initiation error:", error);
//     res.status(400).json({ message: "Error initiating transfer", error });
//   }
// });

// // Client: Verify OTP and Complete Transfer
// app.post("/api/client/verify-otp", authenticateToken, async (req, res) => {
//   const { otp } = req.body;

//   if (!otp) {
//     console.log("OTP verification failed: OTP required");
//     return res.status(400).json({ message: "OTP is required" });
//   }

//   try {
//     const otpRecord = await OTP.findOne({ userId: req.user.id, otp });

//     if (!otpRecord) {
//       console.log("OTP verification failed: Invalid or expired OTP");
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     const {
//       accountType,
//       accountNumber,
//       recipientAccountNumber,
//       recipientAccountType,
//       amount,
//       description,
//       recipientBank,
//       recipientName,
//     } = otpRecord.transferData;

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       console.log("OTP verification failed: Sender not found");
//       return res.status(404).json({ message: "Sender not found" });
//     }

//     const senderAccount = user.accounts.find(
//       (acc) => acc.type === accountType && acc.accountNumber === accountNumber
//     );

//     if (!senderAccount) {
//       console.log("OTP verification failed: Sender account not found");
//       return res.status(404).json({ message: "Sender account not found" });
//     }

//     if (senderAccount.status !== "active") {
//       console.log("OTP verification failed: Sender account not active");
//       return res.status(403).json({ message: "Sender account not active" });
//     }

//     if (senderAccount.balance < amount) {
//       console.log("OTP verification failed: Insufficient funds");
//       return res.status(400).json({ message: "Insufficient funds" });
//     }

//     // Check if recipient exists
//     let recipient = await User.findOne({
//       "accounts.accountNumber": recipientAccountNumber,
//     });

//     let recipientAccount;
//     if (recipient) {
//       recipientAccount = recipient.accounts.find(
//         (acc) =>
//           acc.accountNumber === recipientAccountNumber &&
//           acc.type === recipientAccountType
//       );

//       if (!recipientAccount) {
//         console.log("OTP verification failed: Recipient account not found");
//         return res.status(404).json({ message: "Recipient account not found" });
//       }

//       if (recipientAccount.status !== "active") {
//         console.log("OTP verification failed: Recipient account not active");
//         return res
//           .status(403)
//           .json({ message: "Recipient account not active" });
//       }
//     } else {
//       // Simulate a fake recipient
//       recipient = {
//         _id: null,
//         username: recipientName || "External Recipient",
//       };

//       recipientAccount = {
//         accountNumber: recipientAccountNumber,
//         type: recipientAccountType,
//         status: "active",
//         balance: 0,
//       };
//     }

//     // Deduct from sender
//     await User.updateOne(
//       { _id: user._id, "accounts.accountNumber": accountNumber },
//       { $inc: { "accounts.$.balance": -amount } }
//     );

//     // Credit recipient if real
//     if (recipient._id) {
//       await User.updateOne(
//         {
//           _id: recipient._id,
//           "accounts.accountNumber": recipientAccountNumber,
//         },
//         { $inc: { "accounts.$.balance": amount } }
//       );
//     }

//     // Create sender transaction
//     const senderTransaction = new Transaction({
//       userId: user._id,
//       accountType,
//       accountNumber,
//       amount: -amount,
//       date: new Date(),
//       status: "successful",
//       description,
//       recipientAccountNumber,
//       recipientAccountType,
//       recipientBank,
//       recipientName: recipient.username,
//     });

//     // Create recipient transaction (even if fake)
//     const recipientTransaction = new Transaction({
//       ...(recipient._id && { userId: recipient._id }),
//       accountType: recipientAccountType,
//       accountNumber: recipientAccountNumber,
//       amount,
//       date: new Date(),
//       status: "successful",
//       description: `Received from ${user.username}`,
//       recipientBank,
//       recipientName: recipient.username,
//     });

//     await senderTransaction.save();
//     await recipientTransaction.save();
//     await OTP.deleteOne({ _id: otpRecord._id });

//     io.emit("transactionUpdate", senderTransaction);
//     io.emit("transactionUpdate", recipientTransaction);

//     // Real-time balance update for sender
//     io.emit("balanceUpdate", {
//       userId: user._id,
//       accountType,
//       accountNumber,
//       balance: senderAccount.balance - amount,
//     });

//     // Real-time balance update for recipient (only if real)
//     if (recipient._id) {
//       io.emit("balanceUpdate", {
//         userId: recipient._id,
//         accountType: recipientAccountType,
//         accountNumber: recipientAccountNumber,
//         balance: recipientAccount.balance + amount,
//       });
//     }

//     console.log("Transfer completed:", senderTransaction._id);
//     res.json({
//       message:
//         "Your transfer has been successfully initiated. It will take 2-5 working days to process.",
//       transaction: senderTransaction,
//     });
//   } catch (error) {
//     console.error("OTP verification error:", error);
//     res.status(400).json({ message: "Error verifying OTP", error });
//   }
// });

// app.get("/api/client/profile", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user); // ✅ This is the key part
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching profile", error });
//   }
// });

// // Client: Get User Data
// app.get("/api/user", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       console.log("Fetch user failed: User not found", req.user.id);
//       return res.status(404).json({ message: "User not found" });
//     }
//     console.log("Fetched user:", req.user.id);
//     res.json(user);
//   } catch (error) {
//     console.error("Fetch user error:", error);
//     res.status(500).json({ message: "Error fetching user", error });
//   }
// });

// // Client: Get Account Data
// app.get("/api/account", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       console.log("Fetch accounts failed: User not found", req.user.id);
//       return res.status(404).json({ message: "User not found" });
//     }
//     console.log(
//       "Fetched accounts for user:",
//       req.user.id,
//       "Accounts:",
//       user.accounts
//     );
//     res.json({ accounts: user.accounts });
//   } catch (error) {
//     console.error("Fetch accounts error:", error);
//     res.status(500).json({ message: "Error fetching accounts", error });
//   }
// });

// // Client: Get Transaction History
// app.get("/api/transactions", authenticateToken, async (req, res) => {
//   try {
//     const { accountType, accountNumber } = req.query;
//     const query = { userId: req.user.id };
//     if (accountType) query.accountType = accountType;
//     if (accountNumber) query.accountNumber = accountNumber;
//     const transactions = await Transaction.find(query).sort({ date: -1 });
//     console.log(
//       "Fetched transactions for user:",
//       req.user.id,
//       "Count:",
//       transactions.length
//     );
//     res.json(transactions);
//   } catch (error) {
//     console.error("Fetch transactions error:", error);
//     res.status(400).json({ message: "Error fetching transactions", error });
//   }
// });

// // Client: Send Support Message
// app.post("/api/client/support", authenticateToken, async (req, res) => {
//   const { message } = req.body;

//   if (!message || !message.trim()) {
//     console.log("Support message failed: Message is required");
//     return res.status(400).json({ message: "Message is required" });
//   }

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       console.log("Support message failed: User not found", req.user.id);
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.status !== "active") {
//       console.log("Support message failed: User account not active");
//       return res.status(403).json({ message: "User account not active" });
//     }

//     const supportMessage = new SupportMessage({
//       userId: user._id,
//       username: user.username,
//       email: user.email,
//       message: message.trim(),
//       sender: "client",
//       timestamp: new Date(),
//       status: "open",
//     });

//     await supportMessage.save();
//     io.emit("supportMessage", {
//       userId: user._id,
//       username: user.username,
//       email: user.email,
//       message: supportMessage.message,
//       timestamp: supportMessage.timestamp,
//       status: supportMessage.status,
//       _id: supportMessage._id,
//     });

//     await sendSupportEmail(user.email, user.username, message);
//     console.log("Support message sent by user:", user._id);
//     res.status(201).json({ message: "Support message sent successfully" });
//   } catch (error) {
//     console.error("Support message error:", error);
//     res.status(400).json({ message: "Error sending support message", error });
//   }
// });

// // Client: Get Support Messages
// app.get("/api/client/support-messages", authenticateToken, async (req, res) => {
//   try {
//     const messages = await SupportMessage.find({ userId: req.user.id }).sort({
//       timestamp: -1,
//     });
//     console.log(
//       "Fetched support messages for user:",
//       req.user.id,
//       "Count:",
//       messages.length
//     );
//     res.json(messages);
//   } catch (error) {
//     console.error("Fetch support messages error:", error);
//     res.status(500).json({ message: "Error fetching support messages", error });
//   }
// });

// // WebSocket Connection
// io.on("connection", (socket) => {
//   console.log(
//     "Client connected:",
//     socket.id,
//     "Token:",
//     socket.handshake.auth.token
//   );
//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // Root Route for Testing
// app.get("/", (req, res) => {
//   res.send("Backend server is running ✅");
// });

// // Define the port
// const PORT = process.env.PORT || 5000;

// // Centralized server startup function
// async function startServer() {
//   // Add an error listener for the server itself
//   server.on("error", (err) => {
//     if (err.code === "EADDRINUSE") {
//       console.error(
//         `❌ Port ${PORT} is already in use. Please choose a different port or stop the other process.`
//       );
//     } else {
//       console.error("❌ Server error:", err);
//     }
//     process.exit(1); // Exit the process if server cannot start due to port
//   });

//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected");

//     server.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err);
//     process.exit(1); // Exit the process if DB connection fails
//   }
// }

// // Call the startup function
// startServer();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const dotenv = require("dotenv");
const redisClient = require("./redis");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173",  "https://admin-benningtonstatebkss.vercel.app",
      "https://benningtonstatebkss.vercel.app"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://admin-benningtonstatebkss.vercel.app",
      "https://benningtonstatebkss.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "admin"], default: "client" },
  status: {
    type: String,
    enum: ["pending", "active", "suspended"],
    default: "pending",
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  nationality: { type: String, required: true },
  accounts: [
    {
      type: {
        type: String,
        enum: ["checking", "savings", "debitcard", "investment"],
        required: true,
      },
      accountNumber: { type: String, required: true, unique: true },
      balance: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ["pending", "active", "suspended"],
        default: "pending",
      },
    },
  ],
});

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  accountType: {
    type: String,
    enum: ["checking", "savings", "debitcard", "investment"],
    required: true,
  },
  accountNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["successful", "pending", "onhold", "declined"],
    default: "pending",
  },
  description: { type: String },
  recipientAccountNumber: { type: String },
  recipientAccountType: {
    type: String,
    enum: ["checking", "savings", "debitcard", "investment"],
  },
  recipientBank: { type: String },
  recipientName: { type: String },
});

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  transferData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // OTP expires in 5 minutes
});

// Support Message Schema
const supportMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  email: { type: String, required: false },
  message: { type: String, required: true },
  sender: { type: String, enum: ["client", "admin"], required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "resolved"], default: "open" },
});

const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);

const User = mongoose.model("User", userSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const OTP = mongoose.model("OTP", otpSchema);

// Generate Unique Account Number
const generateAccountNumber = async () => {
  let number;
  let exists = true;
  while (exists) {
    number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    exists = await User.findOne({ "accounts.accountNumber": number });
  }
  return number;
};

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access denied: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res
        .status(403)
        .json({ message: "Invalid token", error: err.message });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    console.log("Admin access denied, role:", req.user.role);
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Send OTP Email
const sendOTPEmail = async (userEmail, numericOTP) => {
  if (!process.env.ORGANIZER_EMAIL) {
    console.warn("⚠️ Warning: ORGANIZER_EMAIL is not defined in .env");
    return;
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.ORGANIZER_EMAIL,
    subject:
      "Your One-Time Password (OTP) for Secure Access - Bennington State Bank",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #1a73e8; font-size: 24px;"><strong>Bennington State Bank</strong></h1>
        <p>Dear Admin,</p>
        <p>Thank you for banking with <strong style="color: #1a73e8;">Bennington State Bank</strong>. To ensure the security of a user's account, we have generated a One-Time Password (OTP) for the following user:</p>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <h2 style="font-size: 22px; color: #000; margin: 20px 0;">Your OTP: <span style="color: #1a73e8;">${numericOTP}</span></h2>
        <h3>Important Instructions:</h3>
        <ul>
          <li>This OTP is valid for <strong>10 minutes</strong> only. Please use it promptly.</li>
          <li><strong>Do not share</strong> this OTP with anyone, including bank staff.</li>
          <li>If this request was not initiated by the user, contact Customer Support immediately.</li>
        </ul>
        <p style="font-size: 14px; color: #666;">
          For your security, <strong>Bennington State Bank</strong> will never ask for your OTP or sensitive information via email or phone.
          <br><br>
          Customer Support: <strong>1-800-555-1234</strong> <br>
          Email: <a href="mailto:support@benningtonstatebank.com">support@benningtonstatebank.com</a>
        </p>
        <p>Best regards,<br><strong>Bennington State Bank Customer Service Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to admin:", process.env.ORGANIZER_EMAIL);
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
};

// Send Support Email to Admin
const sendSupportEmail = async (userEmail, username, message) => {
  if (!process.env.ORGANIZER_EMAIL) {
    console.warn("⚠️ Warning: ORGANIZER_EMAIL is not defined in .env");
    return;
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.ORGANIZER_EMAIL,
    subject: "New Support Message - Bennington State Bank",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #1a73e8; font-size: 24px;"><strong>Bennington State Bank</strong></h1>
        <p>Dear Admin,</p>
        <p>A new support message has been received from a client:</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p>Please respond via the admin support dashboard or contact the client directly.</p>
        <p style="font-size: 14px; color: #666;">
          Customer Support: <strong>1-800-555-1234</strong> <br>
          Email: <a href="mailto:support@benningtonstatebank.com">support@benningtonstatebank.com</a>
        </p>
        <p>Best regards,<br><strong>Bennington State Bank System</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Support email sent to admin:", process.env.ORGANIZER_EMAIL);
  } catch (error) {
    console.error("❌ Support email send error:", error);
    throw error;
  }
};

// Routes
// Admin: Login
app.post("/api/admin/login", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, role: "admin" });
    if (!user) {
      console.log("Admin login failed: User not found or not admin");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.status !== "active") {
      console.log("Admin login failed: Account not active");
      return res.status(403).json({ message: "Account not active" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Admin login failed: Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(400).json({ message: "Error logging in", error });
  }
});

// Admin: Reply to Support Message
app.post(
  "/api/admin/support/reply",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const { messageId, reply } = req.body;

    if (!messageId || !reply || !reply.trim()) {
      console.log("Support reply failed: Missing messageId or reply");
      return res
        .status(400)
        .json({ message: "Message ID and reply are required" });
    }

    try {
      const originalMessage = await SupportMessage.findById(messageId);
      if (!originalMessage) {
        console.log(
          "Support reply failed: Original message not found",
          messageId
        );
        return res.status(404).json({ message: "Original message not found" });
      }

      const admin = await User.findOne({ role: "admin" });
      if (!admin) {
        console.log("Support reply failed: Admin not found");
        return res.status(404).json({ message: "Admin not found" });
      }

      const supportReply = new SupportMessage({
        userId: originalMessage.userId,
        username: originalMessage.username,
        email: originalMessage.email,
        message: reply.trim(),
        sender: "admin",
        timestamp: new Date(),
        status: "open",
      });

      await supportReply.save();
      await SupportMessage.updateOne(
        { _id: messageId },
        { status: "resolved" }
      );
      await redisClient.del(
        `support-messages:client:${originalMessage.userId}`
      );
      await redisClient.del("support-messages:admin");

      io.emit("supportReply", {
        userId: originalMessage.userId,
        username: originalMessage.username,
        email: originalMessage.email,
        message: supportReply.message,
        timestamp: supportReply.timestamp,
        status: supportReply.status,
        _id: supportReply._id,
      });

      console.log("Support reply sent for message:", messageId);
      res.status(201).json({ message: "Reply sent successfully" });
    } catch (error) {
      console.error("Support reply error:", error);
      res.status(400).json({ message: "Error sending reply", error });
    }
  }
);

// Admin: Create Admin User (One-Time Setup)
app.post("/api/setup-admin", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin creation failed: Admin already exists");
    return res.status(403).json({ message: "Admin already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash("openAdmin123", 10);
    const adminUser = new User({
      username: "Admin",
      password: hashedPassword,
      role: "admin",
      status: "active",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      phone: "+1234567890",
      address: "123 Admin St",
      dateOfBirth: new Date("1980-01-01"),
      nationality: "US",
      accounts: [
        {
          type: "checking",
          accountNumber: await generateAccountNumber(),
          balance: 1000,
          status: "active",
        },
      ],
    });
    await adminUser.save();
    console.log("Admin created successfully:", adminUser._id);
    res.status(201).json({ message: "Admin created", userId: adminUser._id });
  } catch (error) {
    if (error.code === 11000) {
      console.log(
        "Admin creation failed: Username, email, or account number exists"
      );
      return res
        .status(400)
        .json({ message: "Username, email, or account number already exists" });
    }
    console.error("Admin creation error:", error);
    res.status(500).json({ message: "Error creating admin", error });
  }
});

// Admin: Create User Account
app.post("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const {
    username,
    password,
    accounts,
    firstName,
    lastName,
    email,
    phone,
    address,
    dateOfBirth,
    nationality,
  } = req.body;
  if (
    !username ||
    !password ||
    !accounts ||
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !address ||
    !dateOfBirth ||
    !nationality
  ) {
    console.log("User creation failed: Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userAccounts = await Promise.all(
      accounts.map(async (acc) => ({
        type: acc.type,
        accountNumber: await generateAccountNumber(),
        balance: parseFloat(acc.balance) || 0,
        status: "active",
      }))
    );
    const user = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth: new Date(dateOfBirth),
      nationality,
      role: "client",
      status: "active",
      accounts: userAccounts,
    });
    await user.save();
    io.emit("accountStatusUpdate", { userId: user._id, status: "active" });
    console.log("User created successfully:", user._id);
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (error) {
    if (error.code === 11000) {
      console.log(
        "User creation failed: Username, email, or account number exists"
      );
      return res
        .status(400)
        .json({ message: "Username, email, or account number already exists" });
    }
    console.error("User creation error:", error);
    res.status(400).json({ message: "Error creating user", error });
  }
});

// Admin: Add New Account for Existing User
app.post(
  "/api/admin/users/:userId/accounts",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const { userId } = req.params;
    const { type, balance } = req.body;
    if (
      !type ||
      !["checking", "savings", "debitcard", "investment"].includes(type)
    ) {
      console.log("Add account failed: Invalid or missing account type");
      return res
        .status(400)
        .json({ message: "Invalid or missing account type" });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.log("Add account failed: User not found", userId);
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "client") {
        console.log("Add account failed: User is not a client");
        return res.status(403).json({ message: "User is not a client" });
      }
      const accountExists = user.accounts.find((acc) => acc.type === type);
      if (accountExists) {
        console.log("Add account failed: Account type already exists", type);
        return res.status(400).json({
          message: `Account type ${type} already exists for this user`,
        });
      }
      const newAccount = {
        type,
        accountNumber: await generateAccountNumber(),
        balance: parseFloat(balance) || 0,
        status: "active",
      };
      user.accounts.push(newAccount);
      await user.save();
      io.emit("accountStatusUpdate", { userId: user._id, status: "active" });
      console.log("Account added for user:", user._id, "Account:", newAccount);
      res
        .status(201)
        .json({ message: "Account added successfully", account: newAccount });
    } catch (error) {
      if (error.code === 11000) {
        console.log("Add account failed: Account number exists");
        return res
          .status(400)
          .json({ message: "Account number already exists" });
      }
      console.error("Add account error:", error);
      res.status(400).json({ message: "Error adding account", error });
    }
  }
);

// Admin: Approve Pending User Account
app.put(
  "/api/admin/users/:userId/approve",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        console.log("User approval failed: User not found", req.params.userId);
        return res.status(404).json({ message: "User not found" });
      }
      user.status = "active";
      user.accounts.forEach((acc) => (acc.status = "active"));
      await user.save();
      io.emit("accountStatusUpdate", { userId: user._id, status: "active" });
      console.log("User approved:", user._id);
      res.json({ message: "User approved" });
    } catch (error) {
      console.error("User approval error:", error);
      res.status(400).json({ message: "Error approving user", error });
    }
  }
);

// Admin: Suspend/Activate User Account
app.put(
  "/api/admin/users/:userId/status",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const { status } = req.body;
    if (!["active", "suspended"].includes(status)) {
      console.log("User status update failed: Invalid status", status);
      return res.status(400).json({ message: "Invalid status" });
    }
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        console.log(
          "User status update failed: User not found",
          req.params.userId
        );
        return res.status(404).json({ message: "User not found" });
      }
      user.status = status;
      user.accounts.forEach((acc) => (acc.status = status));
      await user.save();
      io.emit("accountStatusUpdate", { userId: user._id, status });
      console.log(`User ${status}:`, user._id);
      res.json({ message: `User ${status}` });
    } catch (error) {
      console.error("User status update error:", error);
      res.status(400).json({ message: `Error updating user status`, error });
    }
  }
);

// Admin: Credit/Debit User Account
app.post(
  "/api/admin/credit-debit-user",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const {
      userId,
      accountType,
      accountNumber,
      amount,
      date,
      description,
      action,
    } = req.body;
    if (
      !userId ||
      !accountType ||
      !accountNumber ||
      !amount ||
      !date ||
      !action ||
      !["credit", "debit"].includes(action)
    ) {
      console.log("User credit/debit failed: Missing fields or invalid action");
      return res
        .status(400)
        .json({ message: "Missing required fields or invalid action" });
    }
    if (parseFloat(amount) <= 0) {
      console.log("User credit/debit failed: Amount must be positive");
      return res.status(400).json({ message: "Amount must be positive" });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.log("User credit/debit failed: User not found", userId);
        return res.status(404).json({ message: "User not found" });
      }
      const account = user.accounts.find(
        (acc) => acc.type === accountType && acc.accountNumber === accountNumber
      );
      if (!account) {
        console.log(
          "User credit/debit failed: Account not found",
          accountType,
          accountNumber
        );
        return res.status(404).json({ message: "Account not found" });
      }
      if (account.status !== "active") {
        console.log("User credit/debit failed: Account not active");
        return res.status(403).json({ message: "Account not active" });
      }
      if (action === "debit" && account.balance < parseFloat(amount)) {
        console.log("User credit/debit failed: Insufficient balance");
        return res.status(400).json({ message: "Insufficient balance" });
      }
      const adjustment =
        action === "credit" ? parseFloat(amount) : -parseFloat(amount);
      await User.updateOne(
        { _id: userId, "accounts.accountNumber": accountNumber },
        { $inc: { "accounts.$.balance": adjustment } }
      );
      const transaction = new Transaction({
        userId,
        accountType,
        accountNumber,
        amount: adjustment,
        date: new Date(date),
        status: "successful",
        description: description || `Admin ${action}`,
      });
      await transaction.save();
      io.emit("transactionUpdate", transaction);
      io.emit("balanceUpdate", {
        userId,
        accountType,
        accountNumber,
        balance: account.balance + adjustment,
      });
      console.log(`User ${action}ed:`, userId, accountType, accountNumber);
      res.json({ message: `User ${action}ed successfully`, transaction });
    } catch (error) {
      console.error(`User ${action} error:`, error);
      res.status(400).json({ message: `Error ${action}ing user`, error });
    }
  }
);

// Admin: Update Account Balance
app.put(
  "/api/admin/users/:userId/accounts/:accountNumber/balance",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const { balance } = req.body;
    if (typeof balance !== "number" || balance < 0) {
      console.log("Balance update failed: Invalid balance");
      return res.status(400).json({ message: "Invalid balance" });
    }
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        console.log("Balance update failed: User not found", req.params.userId);
        return res.status(404).json({ message: "User not found" });
      }
      const account = user.accounts.find(
        (acc) => acc.accountNumber === req.params.accountNumber
      );
      if (!account) {
        console.log(
          "Balance update failed: Account not found",
          req.params.accountNumber
        );
        return res.status(404).json({ message: "Account not found" });
      }
      if (account.status !== "active") {
        console.log("Balance update failed: Account not active");
        return res.status(403).json({ message: "Account not active" });
      }
      await User.updateOne(
        {
          _id: req.params.userId,
          "accounts.accountNumber": req.params.accountNumber,
        },
        { $set: { "accounts.$.balance": parseFloat(balance) } }
      );
      io.emit("balanceUpdate", {
        userId: user._id,
        accountType: account.type,
        accountNumber: account.accountNumber,
        balance: parseFloat(balance),
      });
      console.log("Balance updated:", user._id, account.accountNumber);
      res.json({ message: "Balance updated" });
    } catch (error) {
      console.error("Balance update error:", error);
      res.status(400).json({ message: "Error updating balance", error });
    }
  }
);

// Admin: Add Client
app.post(
  "/api/admin/add-client",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      nationality,
      username,
      password,
      accounts,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !dateOfBirth ||
      !nationality ||
      !username ||
      !password ||
      !accounts ||
      !accounts.length
    ) {
      console.log("Add client failed: Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userAccounts = await Promise.all(
        accounts.map(async (acc) => ({
          type: acc.type,
          accountNumber: await generateAccountNumber(),
          balance: parseFloat(acc.balance) || 0,
          status: "active",
        }))
      );
      const user = new User({
        firstName,
        lastName,
        email,
        phone,
        address,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        username,
        password: hashedPassword,
        role: "client",
        status: "active",
        accounts: userAccounts,
      });
      await user.save();
      io.emit("accountStatusUpdate", { userId: user._id, status: "active" });
      console.log("Client added:", user._id);
      res.json({ message: "Client added successfully", userId: user._id });
    } catch (error) {
      if (error.code === 11000) {
        console.log(
          "Add client failed: Username, email, or account number exists"
        );
        return res.status(400).json({
          message: "Username, email, or account number already exists",
        });
      }
      console.error("Add client error:", error);
      res.status(400).json({ message: "Error adding client", error });
    }
  }
);

// Admin: Get Support Messages
app.get(
  "/api/admin/support-messages",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300");
    try {
      const { userId, status } = req.query;
      const cacheKey = "support-messages:admin";
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Serving support messages from Redis cache");
        return res.json(JSON.parse(cachedData));
      }

      const query = {};
      if (userId) query.userId = userId;
      if (status) query.status = status;
      const messages = await SupportMessage.find(query).sort({ timestamp: -1 });
      await redisClient.setEx(cacheKey, 300, JSON.stringify(messages));
      console.log("Fetched support messages:", messages.length);
      res.json(messages);
    } catch (error) {
      console.error("Fetch support messages error:", error);
      res
        .status(500)
        .json({ message: "Error fetching support messages", error });
    }
  }
);

// Admin: Get All Users
app.get("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  try {
    const cacheKey = "users:admin";
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving users from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const users = await User.find({ role: "client" }, "-password");
    await redisClient.setEx(cacheKey, 300, JSON.stringify(users));
    console.log("Fetched users:", users.length, "clients");
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Client: Register
app.post("/api/register", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    dateOfBirth,
    nationality,
    username,
    password,
    accounts,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !address ||
    !dateOfBirth ||
    !nationality ||
    !username ||
    !password ||
    !accounts ||
    !accounts.length
  ) {
    console.log("Registration failed: Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userAccounts = await Promise.all(
      accounts.map(async (acc) => ({
        type: acc.type,
        accountNumber: await generateAccountNumber(),
        balance: 0,
        status: "pending",
      }))
    );
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth: new Date(dateOfBirth),
      nationality,
      username,
      password: hashedPassword,
      role: "client",
      status: "pending",
      accounts: userAccounts,
    });
    await user.save();
    io.emit("newUserPending", { userId: user._id, username });
    console.log("User registered, pending approval:", user._id);
    res.status(201).json({ message: "Registration submitted for approval" });
  } catch (error) {
    if (error.code === 11000) {
      console.log(
        "Registration failed: Username, email, or account number exists"
      );
      return res
        .status(400)
        .json({ message: "Username, email, or account number already exists" });
    }
    console.error("Registration error:", error);
    res.status(400).json({ message: "Error registering user", error });
  }
});

// Client: Login
app.post("/api/client/login", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, role: "client" });
    if (!user) {
      console.log("Client login failed: User not found or not client");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.status !== "active") {
      console.log("Client login failed: Account not active");
      return res.status(403).json({ message: "Account not active" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Client login failed: Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Client login error:", error);
    res.status(400).json({ message: "Error logging in", error });
  }
});

// Client: Initiate Transfer (Generate OTP)
app.post("/api/client/transfers", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const {
    accountType,
    accountNumber,
    recipientAccountNumber,
    recipientAccountType,
    amount,
    description,
    recipientBank,
    recipientName,
  } = req.body;

  if (
    !accountType ||
    !accountNumber ||
    !recipientAccountNumber ||
    !recipientAccountType ||
    !amount ||
    !recipientBank ||
    !recipientName
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (parseFloat(amount) <= 0) {
    return res.status(400).json({ message: "Amount must be positive" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const senderAccount = user.accounts.find(
      (acc) => acc.type === accountType && acc.accountNumber === accountNumber
    );

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (senderAccount.status !== "active") {
      return res.status(403).json({ message: "Account not active" });
    }

    if (senderAccount.balance < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP

    const otpRecord = new OTP({
      userId: req.user.id,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      transferData: {
        accountType,
        accountNumber,
        recipientAccountNumber,
        recipientAccountType,
        amount: parseFloat(amount),
        description: description || `Transfer to ${recipientName}`,
        recipientBank,
        recipientName,
      },
    });

    await otpRecord.save();
    await sendOTPEmail("Client ACH Request", otp); // ✅ static label or remove entirely
    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Transfer initiation error:", error);
    res.status(400).json({ message: "Error initiating transfer", error });
  }
});

// Client: Verify OTP and Complete Transfer
app.post("/api/client/verify-otp", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { otp } = req.body;

  if (!otp) {
    console.log("OTP verification failed: OTP required");
    return res.status(400).json({ message: "OTP is required" });
  }

  try {
    const otpRecord = await OTP.findOne({ userId: req.user.id, otp });

    if (!otpRecord) {
      console.log("OTP verification failed: Invalid or expired OTP");
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const {
      accountType,
      accountNumber,
      recipientAccountNumber,
      recipientAccountType,
      amount,
      description,
      recipientBank,
      recipientName,
    } = otpRecord.transferData;

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("OTP verification failed: Sender not found");
      return res.status(404).json({ message: "Sender not found" });
    }

    const senderAccount = user.accounts.find(
      (acc) => acc.type === accountType && acc.accountNumber === accountNumber
    );

    if (!senderAccount) {
      console.log("OTP verification failed: Sender account not found");
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (senderAccount.status !== "active") {
      console.log("OTP verification failed: Sender account not active");
      return res.status(403).json({ message: "Sender account not active" });
    }

    if (senderAccount.balance < amount) {
      console.log("OTP verification failed: Insufficient funds");
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Check if recipient exists
    let recipient = await User.findOne({
      "accounts.accountNumber": recipientAccountNumber,
    });

    let recipientAccount;
    if (recipient) {
      recipientAccount = recipient.accounts.find(
        (acc) =>
          acc.accountNumber === recipientAccountNumber &&
          acc.type === recipientAccountType
      );

      if (!recipientAccount) {
        console.log("OTP verification failed: Recipient account not found");
        return res.status(404).json({ message: "Recipient account not found" });
      }

      if (recipientAccount.status !== "active") {
        console.log("OTP verification failed: Recipient account not active");
        return res
          .status(403)
          .json({ message: "Recipient account not active" });
      }
    } else {
      // Simulate a fake recipient
      recipient = {
        _id: null,
        username: recipientName || "External Recipient",
      };

      recipientAccount = {
        accountNumber: recipientAccountNumber,
        type: recipientAccountType,
        status: "active",
        balance: 0,
      };
    }

    // Deduct from sender
    await User.updateOne(
      { _id: user._id, "accounts.accountNumber": accountNumber },
      { $inc: { "accounts.$.balance": -amount } }
    );

    // Credit recipient if real
    if (recipient._id) {
      await User.updateOne(
        {
          _id: recipient._id,
          "accounts.accountNumber": recipientAccountNumber,
        },
        { $inc: { "accounts.$.balance": amount } }
      );
    }

    // Create sender transaction
    const senderTransaction = new Transaction({
      userId: user._id,
      accountType,
      accountNumber,
      amount: -amount,
      date: new Date(),
      status: "successful",
      description,
      recipientAccountNumber,
      recipientAccountType,
      recipientBank,
      recipientName: recipient.username,
    });

    // Create recipient transaction (even if fake)
    const recipientTransaction = new Transaction({
      ...(recipient._id && { userId: recipient._id }),
      accountType: recipientAccountType,
      accountNumber: recipientAccountNumber,
      amount,
      date: new Date(),
      status: "successful",
      description: `Received from ${user.username}`,
      recipientBank,
      recipientName: recipient.username,
    });

    await senderTransaction.save();
    await recipientTransaction.save();
    await OTP.deleteOne({ _id: otpRecord._id });

    io.emit("transactionUpdate", senderTransaction);
    io.emit("transactionUpdate", recipientTransaction);

    // Real-time balance update for sender
    io.emit("balanceUpdate", {
      userId: user._id,
      accountType,
      accountNumber,
      balance: senderAccount.balance - amount,
    });

    // Real-time balance update for recipient (only if real)
    if (recipient._id) {
      io.emit("balanceUpdate", {
        userId: recipient._id,
        accountType: recipientAccountType,
        accountNumber: recipientAccountNumber,
        balance: recipientAccount.balance + amount,
      });
    }

    console.log("Transfer completed:", senderTransaction._id);
    res.json({
      message:
        "Your transfer has been successfully initiated. It will take 2-5 working days to process.",
      transaction: senderTransaction,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(400).json({ message: "Error verifying OTP", error });
  }
});

app.get("/api/client/profile", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  try {
    const cacheKey = `profile:${req.user.id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving profile from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await redisClient.setEx(cacheKey, 300, JSON.stringify(user));
    res.json(user); // ✅ This is the key part
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

// Client: Get User Data
app.get("/api/user", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  try {
    const cacheKey = `user:${req.user.id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving user data from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("Fetch user failed: User not found", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    await redisClient.setEx(cacheKey, 300, JSON.stringify(user));
    console.log("Fetched user:", req.user.id);
    res.json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Client: Get Account Data
app.get("/api/account", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  try {
    const cacheKey = `accounts:${req.user.id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving accounts from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("Fetch accounts failed: User not found", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    const response = { accounts: user.accounts };
    await redisClient.setEx(cacheKey, 300, JSON.stringify(response));
    console.log(
      "Fetched accounts for user:",
      req.user.id,
      "Accounts:",
      user.accounts
    );
    res.json({ accounts: user.accounts });
  } catch (error) {
    console.error("Fetch accounts error:", error);
    res.status(500).json({ message: "Error fetching accounts", error });
  }
});

// Client: Get Transaction History
app.get("/api/transactions", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  try {
    const { accountType, accountNumber } = req.query;
    const cacheKey = `transactions:${req.user.id}:${accountType || "all"}:${
      accountNumber || "all"
    }`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving transactions from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const query = { userId: req.user.id };
    if (accountType) query.accountType = accountType;
    if (accountNumber) query.accountNumber = accountNumber;
    const transactions = await Transaction.find(query).sort({ date: -1 });
    await redisClient.setEx(cacheKey, 300, JSON.stringify(transactions));
    console.log(
      "Fetched transactions for user:",
      req.user.id,
      "Count:",
      transactions.length
    );
    res.json(transactions);
  } catch (error) {
    console.error("Fetch transactions error:", error);
    res.status(400).json({ message: "Error fetching transactions", error });
  }
});

// Client: Send Support Message
app.post("/api/client/support", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { message } = req.body;

  if (!message || !message.trim()) {
    console.log("Support message failed: Message is required");
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("Support message failed: User not found", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      console.log("Support message failed: User account not active");
      return res.status(403).json({ message: "User account not active" });
    }

    const supportMessage = new SupportMessage({
      userId: user._id,
      username: user.username,
      email: user.email,
      message: message.trim(),
      sender: "client",
      timestamp: new Date(),
      status: "open",
    });

    await supportMessage.save();
    await redisClient.del(`support-messages:client:${user._id}`);
    await redisClient.del("support-messages:admin");
    io.emit("supportMessage", {
      userId: user._id,
      username: user.username,
      email: user.email,
      message: supportMessage.message,
      timestamp: supportMessage.timestamp,
      status: supportMessage.status,
      _id: supportMessage._id,
    });

    await sendSupportEmail(user.email, user.username, message);
    console.log("Support message sent by user:", user._id);
    res.status(201).json({ message: "Support message sent successfully" });
  } catch (error) {
    console.error("Support message error:", error);
    res.status(400).json({ message: "Error sending support message", error });
  }
});

// Client: Get Support Messages
app.get("/api/client/support-messages", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  try {
    const cacheKey = `support-messages:client:${req.user.id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving support messages from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const messages = await SupportMessage.find({ userId: req.user.id }).sort({
      timestamp: -1,
    });
    await redisClient.setEx(cacheKey, 300, JSON.stringify(messages));
    console.log(
      "Fetched support messages for user:",
      req.user.id,
      "Count:",
      messages.length
    );
    res.json(messages);
  } catch (error) {
    console.error("Fetch support messages error:", error);
    res.status(500).json({ message: "Error fetching support messages", error });
  }
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log(
    "Client connected:",
    socket.id,
    "Token:",
    socket.handshake.auth.token
  );
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Root Route for Testing
app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.send("Backend server is running ✅");
});

// Define the port
const PORT = process.env.PORT || 5000;

// Centralized server startup function
async function startServer() {
  // Add an error listener for the server itself
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `❌ Port ${PORT} is already in use. Please choose a different port or stop the other process.`
      );
    } else {
      console.error("❌ Server error:", err);
    }
    process.exit(1); 
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    await redisClient.connect();
    console.log("✅ Redis connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1); 
  }
}

// Call the startup function
startServer();