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
// const redisClient = require("./redis"); // Assuming redisClient is correctly configured

// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:5173",
//       "https://admin-benningtonstatebkss.vercel.app",
//       "https://benningtonstatebkss.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//   },
// });

// // Middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:5173",
//       "https://admin-benningtonstatebkss.vercel.app",
//       "https://benningtonstatebkss.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Nodemailer Setup
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// // Verify Nodemailer configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Nodemailer configuration error:", error);
//   } else {
//     console.log("✅ Nodemailer ready to send emails");
//   }
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
//     required: true,
//   },
//   accountType: {
//     type: String,
//     enum: ["checking", "savings", "debitcard", "investment", "external"],
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
//   recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   recipientAccountNumber: { type: String },
//   recipientAccountType: {
//     type: String,
//     enum: ["checking", "savings", "debitcard", "investment", "external"],
//   },
//   recipientBank: { type: String },
//   recipientName: { type: String },
//   transactionType: { type: String, enum: ["credit", "debit"], required: true },
// });

// const otpSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   otp: { type: String, required: true },
//   transferData: { type: Object, required: true },
//   createdAt: { type: Date, default: Date.now, expires: 300 },
// });

// const supportMessageSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   username: { type: String, required: true },
//   email: { type: String, required: true },
//   subject: { type: String, required: false },
//   message: { type: String, required: true },
//   sender: {
//     type: String,
//     enum: ["client", "admin", "visitor"],
//     required: true,
//   },
//   conversationId: { type: String, required: true }, // Required for grouping conversation
//   timestamp: { type: Date, default: Date.now },
//   status: { type: String, enum: ["open", "resolved"], default: "open" },
// });

// const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);
// const User = mongoose.model("User", userSchema);
// const Transaction = mongoose.model("Transaction", transactionSchema);
// const OTP = mongoose.model("OTP", otpSchema);

// // Helper function to generate a unique 10-digit account number
// const generateUniqueAccountNumber = async () => {
//   let accountNumber;
//   let isUnique = false;
//   while (!isUnique) {
//     accountNumber = Math.floor(
//       1000000000 + Math.random() * 9000000000
//     ).toString();
//     const existingUser = await User.findOne({
//       "accounts.accountNumber": accountNumber,
//     });
//     if (!existingUser) {
//       isUnique = true;
//     }
//   }
//   return accountNumber;
// };

// // Generate 6-digit OTP
// const generateOTP = () => {
//   return otpGenerator.generate(6, {
//     upperCaseAlphabets: false,
//     specialChars: false,
//     lowerCaseAlphabets: false,
//   });
// };

// // Generate Conversation ID
// const generateConversationId = () => {
//   return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
// };

// // Retry-enabled email sending
// const sendEmailWithRetry = async (
//   mailOptions,
//   maxRetries = 3,
//   retryDelay = 2000
// ) => {
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log(
//         `✅ Email sent successfully (attempt ${attempt}):`,
//         info.messageId
//       );
//       return info;
//     } catch (error) {
//       console.error(
//         `❌ Email send error (attempt ${attempt}/${maxRetries}):`,
//         error
//       );
//       if (attempt === maxRetries) {
//         throw new Error(
//           `Failed to send email after ${maxRetries} attempts: ${error.message}`
//         );
//       }
//       await new Promise((resolve) => setTimeout(resolve, retryDelay));
//     }
//   }
// };

// // Send OTP Email
// const sendOTPEmail = async (userEmail, numericOTP) => {
//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: process.env.ORGANIZER_EMAIL,
//     subject:
//       "New One-Time Password (OTP) for User Transaction - Bennington State Bank",
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//         <h1 style="color: #1a73e8; font-size: 24px;"><strong>Bennington State Bank</strong></h1>
//         <p>Dear Admin,</p>
//         <p>A new transaction has been initiated by a user. Below is the One-Time Password (OTP) for the transaction:</p>
//         <h2 style="font-size: 22px; color: #000; margin: 20px 0;">User OTP: <span style="color: #1a73e8;"><strong>${numericOTP}</strong></span></h2>
//         <p><strong>User Email:</strong> ${userEmail}</p>
//         <h3>Important Instructions:</h3>
//         <ul>
//           <li>Please verify the transaction details in the admin panel.</li>
//           <li>This OTP is valid for <strong>5 minutes</strong> only.</li>
//           <li>Share this OTP with the user securely to complete their transaction.</li>
//         </ul>
//         <p style="font-size: 14px; color: #666;">
//           For any issues, contact the system administrator or check the admin dashboard.
//           <br><br>
//           Customer Support: <strong>1-800-555-1234</strong> <br>
//           Email: <a href="mailto:support@benningtonstatebank.com">support@benningtonstatebank.com</a>
//         </p>
//         <p>Best regards,<br><strong>Bennington State Bank System</strong></p>
//       </div>
//     `,
//   };

//   try {
//     await sendEmailWithRetry(mailOptions);
//     console.log(
//       "✅ OTP email sent successfully to:",
//       process.env.ORGANIZER_EMAIL,
//       "for user:",
//       userEmail
//     );
//   } catch (error) {
//     console.error(
//       "❌ Failed to send OTP email to",
//       process.env.ORGANIZER_EMAIL,
//       "for user:",
//       userEmail,
//       ":",
//       error
//     );
//     throw new Error(
//       "Failed to send OTP email. Please check your email configuration."
//     );
//   }
// };

// // Send Support Email to Admin
// const sendSupportEmail = async (
//   userEmail,
//   username,
//   message,
//   subject = "New Support Message - Bennington State Bank",
//   conversationId
// ) => {
//   if (!process.env.ORGANIZER_EMAIL) {
//     console.error("❌ ORGANIZER_EMAIL is not defined in .env");
//     throw new Error("ORGANIZER_EMAIL is not defined");
//   }

//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: process.env.ORGANIZER_EMAIL,
//     subject,
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//         <h1 style="color: #1a73e8; font-size: 24px;"><strong>Bennington State Bank</strong></h1>
//         <p>Dear Admin,</p>
//         <p>A new support message has been received:</p>
//         <p><strong>Username:</strong> ${username}</p>
//         <p><strong>Email:</strong> ${userEmail}</p>
//         <p><strong>Conversation ID:</strong> ${conversationId}</p>
//         ${
//           subject !== "New Support Message - Bennington State Bank"
//             ? `<p><strong>Subject:</strong> ${subject}</p>`
//             : ""
//         }
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//         <p>Please respond via the admin support dashboard or contact the sender directly.</p>
//         <p style="font-size: 14px; color: #666;">
//           Customer Support: <strong>1-800-555-1234</strong> <br>
//           Email: <a href="mailto:support@benningtonstatebank.com">support@benningtonstatebank.com</a>
//         </p>
//         <p>Best regards,<br><strong>Bennington State Bank System</strong></p>
//       </div>
//     `,
//   };

//   try {
//     await sendEmailWithRetry(mailOptions);
//     console.log("✅ Support email sent to admin:", process.env.ORGANIZER_EMAIL);
//   } catch (error) {
//     console.error(
//       "❌ Support email send error to:",
//       process.env.ORGANIZER_EMAIL,
//       ":",
//       error
//     );
//     throw error;
//   }
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
//       console.error("JWT verification error:", err);
//       if (err.name === "TokenExpiredError") {
//         return res.status(401).json({
//           message: "Session expired. Please log in again.",
//           expiredAt: err.expiredAt,
//         });
//       }
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

// // Routes
// // Admin: Login
// app.post("/api/admin/login", async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
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
//         expiresIn: "8h",
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

// // Unauthenticated Contact Form Submission
// app.post("/api/support/contact", async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
//   const { name, email, subject, message, conversationId } = req.body;

//   console.log("Contact form submission received:", req.body);

//   if (!name || !email || !subject || !message) {
//     console.log("Missing required fields for contact form.");
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const newConversationId = conversationId || generateConversationId();
//     const supportMessage = new SupportMessage({
//       userId: null,
//       username: name,
//       email,
//       subject,
//       message,
//       sender: "visitor",
//       conversationId: newConversationId,
//       status: "open",
//       timestamp: new Date(),
//     });

//     await supportMessage.save();
//     console.log("Support message saved:", supportMessage._id);

//     await sendSupportEmail(
//       email,
//       name,
//       message,
//       `New Contact Form Submission: ${subject}`,
//       newConversationId
//     );

//     io.to(newConversationId).emit("supportMessage", {
//       _id: supportMessage._id,
//       userId: null,
//       username: name,
//       email,
//       subject,
//       message,
//       sender: "visitor",
//       conversationId: newConversationId,
//       status: "open",
//       timestamp: supportMessage.timestamp,
//     });

//     res.json({
//       message: "Your message has been sent successfully!",
//       conversationId: newConversationId,
//       email,
//     });
//   } catch (error) {
//     console.error("Error processing contact form:", error);
//     res
//       .status(500)
//       .json({ message: "Error sending message. Please try again." });
//   }
// });

// // Visitor: Get Messages by Conversation ID
// app.get("/api/support/messages/:conversationId", async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
//   const { conversationId } = req.params;

//   if (!conversationId) {
//     console.log("Missing conversationId for fetching messages");
//     return res.status(400).json({ message: "Conversation ID is required" });
//   }

//   try {
//     const messages = await SupportMessage.find({ conversationId }).sort({
//       timestamp: 1,
//     });
//     console.log(
//       `Fetched ${messages.length} messages for conversationId: ${conversationId}`
//     );
//     res.json(messages);
//   } catch (error) {
//     console.error("Error fetching conversation messages:", error);
//     res.status(500).json({ message: "Error fetching messages", error });
//   }
// });

// // Admin: Reply to Support Message
// app.post(
//   "/api/admin/support/reply",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "no-store");
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
//         subject: `Reply to: ${originalMessage.subject || "Support Inquiry"}`,
//         message: reply.trim(),
//         sender: "admin",
//         conversationId: originalMessage.conversationId,
//         timestamp: new Date(),
//         status: "open",
//       });

//       await supportReply.save();
//       await SupportMessage.updateOne(
//         { _id: messageId },
//         { status: "resolved" }
//       );
//       await redisClient.del(
//         `support-messages:client:${originalMessage.userId || "visitor"}`
//       );
//       await redisClient.del("support-messages:admin");

//       io.to(originalMessage.conversationId).emit("supportReply", {
//         userId: originalMessage.userId,
//         username: originalMessage.username,
//         email: originalMessage.email,
//         subject: supportReply.subject,
//         message: supportReply.message,
//         sender: "admin",
//         conversationId: originalMessage.conversationId,
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
//   res.setHeader("Cache-Control", "no-store");
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
//           accountNumber: await generateUniqueAccountNumber(),
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
//   res.setHeader("Cache-Control", "no-store");
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
//         accountNumber: await generateUniqueAccountNumber(),
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

// // Admin: Approve Pending User Account
// app.put(
//   "/api/admin/users/:userId/approve",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "no-store");
//     try {
//       const user = await User.findById(req.params.userId);
//       if (!user) {
//         console.log("User approval failed: User not found", req.params.userId);
//         return res.status(404).json({ message: "User not found" });
//       }
//       user.status = "active";
//       user.accounts.forEach((acc) => (acc.status = "active"));
//       await user.save();

//       await redisClient.del("users:admin");
//       io.emit("accountStatusUpdate", { userId: user._id, status: "active" });

//       console.log("User approved:", user._id);
//       res.json({ message: "User approved successfully" });
//     } catch (error) {
//       console.error("User approval error:", error);
//       res.status(500).json({ message: "Error approving user", error });
//     }
//   }
// );

// // Admin: Reject (Delete) Pending User Account
// app.delete(
//   "/api/admin/users/:userId/reject",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "no-store");
//     try {
//       const user = await User.findById(req.params.userId);
//       if (!user) {
//         console.log("User rejection failed: User not found", req.params.userId);
//         return res.status(404).json({ message: "User not found" });
//       }

//       if (user.status !== "pending") {
//         console.log(
//           "User rejection failed: User is not pending",
//           req.params.userId
//         );
//         return res
//           .status(400)
//           .json({ message: "Only pending users can be rejected." });
//       }

//       await User.findByIdAndDelete(req.params.userId);

//       await redisClient.del("users:admin");
//       io.emit("userDeleted", { userId: req.params.userId });

//       console.log("User rejected and deleted:", req.params.userId);
//       res.json({ message: "User rejected and deleted successfully" });
//     } catch (error) {
//       console.error("User rejection error:", error);
//       res.status(500).json({ message: "Error rejecting user", error });
//     }
//   }
// );

// // Admin: Suspend/Activate User Account
// app.put(
//   "/api/admin/users/:userId/status",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "no-store");
//     const { status } = req.body;
//     if (!["active", "suspended"].includes(status)) {
//       console.log("User status update failed: Invalid status", status);
//       return res.status(400).json({ message: "Invalid status provided." });
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

//       await redisClient.del("users:admin");
//       io.emit("accountStatusUpdate", { userId: user._id, status });

//       console.log(`User status updated to '${status}':`, user._id);
//       res.json({ message: `User status successfully updated to ${status}` });
//     } catch (error) {
//       console.error("User status update error:", error);
//       res.status(500).json({ message: "Error updating user status", error });
//     }
//   }
// );

// // Admin: Add New Account for Existing User
// app.post(
//   "/api/admin/users/:userId/accounts",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "no-store");
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
//         accountNumber: await generateUniqueAccountNumber(),
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

// // Admin: Credit/Debit User Account
// app.post(
//   "/api/admin/credit-debit-user",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "no-store");
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
//         transactionType: action,
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
//     res.setHeader("Cache-Control", "no-store");
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
//     res.setHeader("Cache-Control", "no-store");
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
//           accountNumber: await generateUniqueAccountNumber(),
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

// // Admin: Get OTPs
// app.get("/api/admin/otps", authenticateToken, isAdmin, async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
//   try {
//     const otps = await OTP.find()
//       .populate("userId", "username firstName lastName email")
//       .sort({ createdAt: -1 });
//     console.log("Fetched OTPs for admin:", otps.length);
//     res.json(otps);
//   } catch (error) {
//     console.error("Fetch OTPs error:", error);
//     res.status(500).json({ message: "Error fetching OTPs", error });
//   }
// });

// // Admin: Get Support Messages
// app.get(
//   "/api/admin/support-messages",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "no-store");
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

// // Admin: Get All Transactions
// app.get(
//   "/api/admin/transactions",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "public, max-age=300");
//     try {
//       const cacheKey = "transactions:admin";
//       const cachedData = await redisClient.get(cacheKey);
//       if (cachedData) {
//         console.log("Serving transactions from Redis cache");
//         return res.json(JSON.parse(cachedData));
//       }

//       const transactions = await Transaction.find()
//         .populate("userId", "username firstName lastName")
//         .populate("recipientId", "username firstName lastName")
//         .sort({ date: -1 });
//       await redisClient.setEx(cacheKey, 300, JSON.stringify(transactions));
//       console.log("Fetched transactions:", transactions.length);
//       res.json(transactions);
//     } catch (error) {
//       console.error("Fetch transactions error:", error);
//       res.status(500).json({ message: "Error fetching transactions", error });
//     }
//   }
// );

// // Admin: Update Transaction
// app.put(
//   "/api/admin/transactions/:id",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     const { status } = req.body;

//     try {
//       const transaction = await Transaction.findById(req.params.id);
//       if (!transaction) {
//         return res.status(404).json({ message: "Transaction not found" });
//       }

//       const user = await User.findById(transaction.userId);
//       const recipient = transaction.recipientId
//         ? await User.findById(transaction.recipientId)
//         : null;

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const previousStatus = transaction.status;
//       const amount = transaction.amount;

//       if (transaction.type === "debit") {
//         if (previousStatus !== "approved" && status === "approved") {
//           if (user.balance < amount) {
//             return res
//               .status(400)
//               .json({ message: "Insufficient balance to approve debit" });
//           }
//           user.balance -= amount;
//         } else if (previousStatus === "approved" && status !== "approved") {
//           user.balance += amount;
//         }
//       }

//       if (transaction.type === "credit") {
//         if (previousStatus !== "approved" && status === "approved") {
//           user.balance += amount;
//         } else if (previousStatus === "approved" && status !== "approved") {
//           user.balance -= amount;
//         }
//       }

//       transaction.status = status;

//       await transaction.save();
//       await user.save();
//       if (recipient) await recipient.save();

//       io.emit("transactionUpdated", transaction);

//       res.json(transaction);
//     } catch (error) {
//       console.error("Error updating transaction:", error);
//       res.status(500).json({ message: "Server error", error });
//     }
//   }
// );

// // Admin: Get All Users
// app.get("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
//   try {
//     const users = await User.find({ role: "client" })
//       .sort({ _id: -1 })
//       .select("-password");
//     console.log("Fetched users:", users.length, "clients");
//     res.json(users);
//   } catch (error) {
//     console.error("Fetch users error:", error);
//     res.status(500).json({ message: "Error fetching users", error });
//   }
// });

// // Client: Register
// app.post("/api/register", async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
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
//         accountNumber: await generateUniqueAccountNumber(),
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
//   res.setHeader("Cache-Control", "no-store");
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
//         expiresIn: "24h",
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

// // Client: Initiate Transfer
// app.post("/api/client/transfers", authenticateToken, async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
//   const {
//     accountType,
//     accountNumber,
//     recipientAccountNumber,
//     recipientAccountType,
//     amount,
//     description,
//     recipientBank,
//     recipientName,
//   } = req.body;

//   console.log("Transfer initiation request received:", req.body);

//   if (
//     !accountType ||
//     !accountNumber ||
//     !recipientAccountNumber ||
//     !recipientAccountType ||
//     !amount ||
//     !recipientBank ||
//     !recipientName
//   ) {
//     console.log("Missing required fields for transfer initiation.");
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   if (parseFloat(amount) <= 0) {
//     console.log("Amount must be positive.");
//     return res.status(400).json({ message: "Amount must be positive" });
//   }

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       console.log("Sender user not found for initiation.");
//       return res.status(404).json({ message: "User not found" });
//     }

//     const senderAccount = user.accounts.find(
//       (acc) => acc.type === accountType && acc.accountNumber === accountNumber
//     );

//     if (!senderAccount) {
//       console.log(
//         "Sender account not found or does not match type/accountNumber."
//       );
//       return res.status(404).json({ message: "Sender account not found" });
//     }

//     if (senderAccount.status !== "active") {
//       console.log("Sender account is not active.");
//       return res.status(403).json({ message: "Account not active" });
//     }

//     if (senderAccount.balance < parseFloat(amount)) {
//       console.log("Insufficient funds in the selected account.");
//       return res.status(400).json({ message: "Insufficient funds" });
//     }

//     let recipientUserId = null;
//     const recipientUser = await User.findOne({
//       "accounts.accountNumber": recipientAccountNumber,
//     });
//     if (recipientUser) {
//       const internalRecipientAccount = recipientUser.accounts.find(
//         (acc) =>
//           acc.accountNumber === recipientAccountNumber &&
//           acc.type === recipientAccountType
//       );
//       if (!internalRecipientAccount) {
//         console.log(
//           "Recipient account type does not match the provided account number for internal user."
//         );
//         return res
//           .status(404)
//           .json({ message: "Recipient account type mismatch." });
//       }
//       if (internalRecipientAccount.status !== "active") {
//         console.log("Internal recipient account is not active.");
//         return res
//           .status(403)
//           .json({ message: "Recipient account not active." });
//       }
//       recipientUserId = recipientUser._id;
//     } else {
//       console.log(
//         "Recipient is external (no internal user found with that account number)."
//       );
//     }

//     const otp = generateOTP();
//     const otpRecord = new OTP({
//       userId: req.user.id,
//       otp,
//       transferData: {
//         accountType,
//         accountNumber,
//         recipientAccountNumber,
//         recipientAccountType,
//         amount: parseFloat(amount),
//         description: description || `Transfer to ${recipientName}`,
//         recipientBank,
//         recipientName,
//         recipientUserId,
//       },
//     });

//     await otpRecord.save();
//     console.log(
//       `OTP ${otp} saved for user ${req.user.id}. Sending email to ${user.email}.`
//     );
//     await sendOTPEmail(user.email, otp);

//     res.json({
//       message:
//         "OTP sent to your email. Please verify to complete the transfer.",
//     });
//   } catch (error) {
//     console.error("❌ Transfer initiation error (sending OTP):", error);
//     res.status(500).json({
//       message: error.message || "Error initiating transfer. Please try again.",
//     });
//   }
// });

// // Client: Verify OTP and Complete Transfer
// app.post("/api/client/verify-otp", authenticateToken, async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
//   const { otp } = req.body;

//   console.log("Verify OTP request received. OTP:", otp);

//   if (!otp) {
//     console.log("OTP verification failed: OTP required");
//     return res.status(400).json({ message: "OTP is required" });
//   }

//   try {
//     const otpRecord = await OTP.findOne({
//       userId: req.user.id,
//       otp,
//       createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
//     });

//     if (!otpRecord) {
//       console.log(
//         "OTP verification failed: Invalid or expired OTP for user",
//         req.user.id
//       );
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired OTP. Please request a new one." });
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
//       recipientUserId,
//     } = otpRecord.transferData;

//     console.log("Transfer Data from OTP record:", otpRecord.transferData);

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       console.log(
//         "OTP verification failed: Sender user not found for user ID:",
//         req.user.id
//       );
//       return res.status(404).json({ message: "Sender user not found." });
//     }

//     const currentSenderUser = await User.findById(user._id);
//     if (!currentSenderUser) {
//       console.error("Error re-fetching sender user after OTP verification.");
//       return res
//         .status(500)
//         .json({ message: "Internal server error during balance update." });
//     }
//     const currentSenderAccount = currentSenderUser.accounts.find(
//       (acc) => acc.type === accountType && acc.accountNumber === accountNumber
//     );

//     if (!currentSenderAccount) {
//       console.log(
//         "OTP verification failed: Sender account not found or mismatch for user (after re-fetch):",
//         user._id,
//         "account:",
//         accountNumber
//       );
//       return res.status(404).json({ message: "Sender account not found." });
//     }

//     if (currentSenderAccount.status !== "active") {
//       console.log(
//         "OTP verification failed: Sender account not active for user (after re-fetch):",
//         user._id
//       );
//       return res.status(403).json({ message: "Sender account not active." });
//     }

//     if (currentSenderAccount.balance < amount) {
//       console.log(
//         "OTP verification failed: Insufficient funds for user (after re-fetch):",
//         user._id,
//         "balance:",
//         currentSenderAccount.balance,
//         "amount:",
//         amount
//       );
//       return res.status(400).json({ message: "Insufficient funds." });
//     }

//     let recipient = null;
//     let recipientAccount = null;

//     if (recipientUserId) {
//       recipient = await User.findById(recipientUserId);
//       if (!recipient) {
//         console.log(
//           "OTP verification failed: Internal recipient user not found with ID:",
//           recipientUserId
//         );
//         return res
//           .status(404)
//           .json({ message: "Internal recipient user not found." });
//       }
//       recipientAccount = recipient.accounts.find(
//         (acc) =>
//           acc.accountNumber === recipientAccountNumber &&
//           acc.type === recipientAccountType
//       );
//       if (!recipientAccount) {
//         console.log(
//           "OTP verification failed: Internal recipient account not found for user:",
//           recipientUserId,
//           "account:",
//           recipientAccountNumber
//         );
//         return res
//           .status(404)
//           .json({ message: "Internal recipient account not found." });
//       }
//       if (recipientAccount.status !== "active") {
//         console.log(
//           "OTP verification failed: Internal recipient account not active for user:",
//           recipientUserId
//         );
//         return res
//           .status(403)
//           .json({ message: "Internal recipient account not active." });
//       }
//     } else {
//       console.log(
//         `External transfer detected to account: ${recipientAccountNumber} at ${recipientBank}. No internal user to credit directly.`
//       );
//     }

//     console.log(
//       "Sender's balance BEFORE debit (from re-fetched object):",
//       currentSenderAccount.balance
//     );
//     const senderUpdateResult = await User.updateOne(
//       { _id: user._id, "accounts.accountNumber": accountNumber },
//       { $inc: { "accounts.$.balance": -amount } }
//     );
//     console.log("Sender update result:", senderUpdateResult);

//     const finalSenderUser = await User.findById(user._id);
//     const finalSenderAccount = finalSenderUser.accounts.find(
//       (acc) => acc.type === accountType && acc.accountNumber === accountNumber
//     );
//     console.log(
//       "Sender's balance AFTER debit (from final re-fetched object):",
//       finalSenderAccount.balance
//     );

//     let finalRecipientAccount = null;
//     if (recipient && recipientAccount) {
//       console.log(
//         "Recipient's balance BEFORE credit (from in-memory object):",
//         recipientAccount.balance
//       );
//       const recipientUpdateResult = await User.updateOne(
//         {
//           _id: recipient._id,
//           "accounts.accountNumber": recipientAccountNumber,
//         },
//         { $inc: { "accounts.$.balance": amount } }
//       );
//       console.log("Recipient update result:", recipientUpdateResult);

//       const finalRecipient = await User.findById(recipient._id);
//       finalRecipientAccount = finalRecipient.accounts.find(
//         (acc) =>
//           acc.accountNumber === recipientAccountNumber &&
//           acc.type === recipientAccountType
//       );
//       console.log(
//         "Recipient's balance AFTER credit (from final re-fetched object):",
//         finalRecipientAccount.balance
//       );
//     }

//     const senderTransaction = new Transaction({
//       userId: user._id,
//       accountType,
//       accountNumber,
//       amount: -amount,
//       date: new Date(),
//       status: "successful",
//       description,
//       recipientId: recipientUserId,
//       recipientAccountNumber,
//       recipientAccountType,
//       recipientBank,
//       recipientName,
//       transactionType: "debit",
//     });

//     let recipientTransaction = null;
//     if (recipientUserId) {
//       recipientTransaction = new Transaction({
//         userId: recipientUserId,
//         accountType: recipientAccountType,
//         accountNumber: recipientAccountNumber,
//         amount: amount,
//         date: new Date(),
//         status: "successful",
//         description: `Received from ${user.firstName} ${user.lastName}`,
//         recipientId: user._id,
//         recipientBank,
//         recipientName: user.firstName + " " + user.lastName,
//         transactionType: "credit",
//       });
//     }

//     await senderTransaction.save();
//     if (recipientTransaction) {
//       await recipientTransaction.save();
//     }
//     await OTP.deleteOne({ _id: otpRecord._id });

//     io.emit("transactionUpdate", senderTransaction);
//     io.emit("balanceUpdate", {
//       userId: user._id,
//       accountType,
//       accountNumber,
//       balance: finalSenderAccount.balance,
//     });
//     if (recipientUserId && finalRecipientAccount) {
//       io.emit("balanceUpdate", {
//         userId: recipientUserId,
//         accountType: recipientAccountType,
//         accountNumber: recipientAccountNumber,
//         balance: finalRecipientAccount.balance,
//       });
//     }

//     console.log("Transfer completed successfully.");
//     res.json({
//       message:
//         "Your transfer has been successfully initiated. It will typically take 2-5 working days to process.",
//       transaction: senderTransaction,
//     });
//   } catch (error) {
//     console.error(
//       "❌ ERROR: OTP verification or transfer completion failed:",
//       error
//     );
//     res.status(500).json({
//       message: error.message || "Error completing transfer. Please try again.",
//     });
//   }
// });

// // Client: Get User Data
// app.get("/api/user", authenticateToken, async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
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
//   res.setHeader("Cache-Control", "no-store");
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
//   res.setHeader("Cache-Control", "no-store");
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
//   res.setHeader("Cache-Control", "no-store");
//   const { message, subject, conversationId } = req.body;

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

//     const newConversationId = conversationId || generateConversationId();
//     const supportMessage = new SupportMessage({
//       userId: user._id,
//       username: user.username,
//       email: user.email,
//       subject: subject || "Support Inquiry",
//       message: message.trim(),
//       sender: "client",
//       conversationId: newConversationId,
//       timestamp: new Date(),
//       status: "open",
//     });

//     await supportMessage.save();
//     await redisClient.del(`support-messages:client:${user._id}`);
//     await redisClient.del("support-messages:admin");
//     io.to(newConversationId).emit("supportMessage", {
//       userId: user._id,
//       username: user.username,
//       email: user.email,
//       subject: supportMessage.subject,
//       message: supportMessage.message,
//       sender: "client",
//       conversationId: newConversationId,
//       timestamp: supportMessage.timestamp,
//       status: supportMessage.status,
//       _id: supportMessage._id,
//     });

//     await sendSupportEmail(
//       user.email,
//       user.username,
//       message,
//       `New Support Message: ${supportMessage.subject}`,
//       newConversationId
//     );
//     console.log("Support message sent by user:", user._id);
//     res.status(201).json({
//       message: "Support message sent successfully",
//       conversationId: newConversationId,
//     });
//   } catch (error) {
//     console.error("Support message error:", error);
//     res.status(400).json({ message: "Error sending support message", error });
//   }
// });

// // Client: Get Support Messages
// app.get("/api/client/support-messages", authenticateToken, async (req, res) => {
//   res.setHeader("Cache-Control", "no-store");
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
//     socket.handshake.auth.token ? "Provided" : "Not Provided"
//   );

//   socket.on("joinConversation", (conversationId) => {
//     if (conversationId) {
//       socket.join(conversationId);
//       console.log(`Client ${socket.id} joined conversation ${conversationId}`);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // Root Route for Testing
// app.get("/", (req, res) => {
//   res.setHeader("Cache-Control", "public, max-age=300");
//   res.send("Backend server is running ✅");
// });

// // Centralized server startup function
// async function startServer() {
//   server.on("error", (err) => {
//     if (err.code === "EADDRINUSE") {
//       console.error(
//         `❌ Port ${PORT} is already in use. Please choose a different port or stop the other process.`
//       );
//     } else {
//       console.error("❌ Server error:", err);
//     }
//     process.exit(1);
//   });

//   try {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//       console.log("✅ Redis connected");
//     }




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
const redisClient = require("./redis"); // Assuming redisClient is correctly configured

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://admin-benningtonstatebkss.vercel.app",
      "https://benningtonstatebkss.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://admin-benningtonstatebkss.vercel.app",
      "https://benningtonstatebkss.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify Nodemailer configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer configuration error:", error);
  } else {
    console.log("✅ Nodemailer ready to send emails");
  }
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
    required: true,
  },
  accountType: {
    type: String,
    enum: ["checking", "savings", "debitcard", "investment", "external"],
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
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipientAccountNumber: { type: String },
  recipientAccountType: {
    type: String,
    enum: ["checking", "savings", "debitcard", "investment", "external"],
  },
  recipientBank: { type: String },
  recipientName: { type: String },
  transactionType: { type: String, enum: ["credit", "debit"], required: true },
});

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  transferData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

const supportMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: false },
  message: { type: String, required: true },
  sender: {
    type: String,
    enum: ["client", "admin", "visitor"],
    required: true,
  },
  conversationId: { type: String, required: true }, // Required for grouping conversation
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "resolved"], default: "open" },
});

const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);
const User = mongoose.model("User", userSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const OTP = mongoose.model("OTP", otpSchema);

// Helper function to generate a unique 10-digit account number
const generateUniqueAccountNumber = async () => {
  let accountNumber;
  let isUnique = false;
  while (!isUnique) {
    accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
    const existingUser = await User.findOne({
      "accounts.accountNumber": accountNumber,
    });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return accountNumber;
};

// Generate 6-digit OTP
const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

// Generate Conversation ID
const generateConversationId = () => {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// Retry-enabled email sending
const sendEmailWithRetry = async (
  mailOptions,
  maxRetries = 3,
  retryDelay = 2000
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(
        `✅ Email sent successfully (attempt ${attempt}):`,
        info.messageId
      );
      return info;
    } catch (error) {
      console.error(
        `❌ Email send error (attempt ${attempt}/${maxRetries}):`,
        error
      );
      if (attempt === maxRetries) {
        throw new Error(
          `Failed to send email after ${maxRetries} attempts: ${error.message}`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

// Send OTP Email
const sendOTPEmail = async (userEmail, numericOTP) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.ORGANIZER_EMAIL,
    subject:
      "New One-Time Password (OTP) for User Transaction - Bennington State Bank",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #1a73e8; font-size: 24px;"><strong>Bennington State Bank</strong></h1>
        <p>Dear Admin,</p>
        <p>A new transaction has been initiated by a user. Below is the One-Time Password (OTP) for the transaction:</p>
        <h2 style="font-size: 22px; color: #000; margin: 20px 0;">User OTP: <span style="color: #1a73e8;"><strong>${numericOTP}</strong></span></h2>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <h3>Important Instructions:</h3>
        <ul>
          <li>Please verify the transaction details in the admin panel.</li>
          <li>This OTP is valid for <strong>5 minutes</strong> only.</li>
          <li>Share this OTP with the user securely to complete their transaction.</li>
        </ul>
        <p style="font-size: 14px; color: #666;">
          For any issues, contact the system administrator or check the admin dashboard.
          <br><br>
          Customer Support: <strong>1-800-555-1234</strong> <br>
          Email: <a href="mailto:support@benningtonstatebank.com">support@benningtonstatebank.com</a>
        </p>
        <p>Best regards,<br><strong>Bennington State Bank System</strong></p>
      </div>
    `,
  };

  try {
    await sendEmailWithRetry(mailOptions);
    console.log(
      "✅ OTP email sent successfully to:",
      process.env.ORGANIZER_EMAIL,
      "for user:",
      userEmail
    );
  } catch (error) {
    console.error(
      "❌ Failed to send OTP email to",
      process.env.ORGANIZER_EMAIL,
      "for user:",
      userEmail,
      ":",
      error
    );
    throw new Error(
      "Failed to send OTP email. Please check your email configuration."
    );
  }
};

// Send Support Email to Admin
const sendSupportEmail = async (
  userEmail,
  username,
  message,
  subject = "New Support Message - Bennington State Bank",
  conversationId
) => {
  if (!process.env.ORGANIZER_EMAIL) {
    console.error("❌ ORGANIZER_EMAIL is not defined in .env");
    throw new Error("ORGANIZER_EMAIL is not defined");
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.ORGANIZER_EMAIL,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #1a73e8; font-size: 24px;"><strong>Bennington State Bank</strong></h1>
        <p>Dear Admin,</p>
        <p>A new support message has been received:</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Conversation ID:</strong> ${conversationId}</p>
        ${
          subject !== "New Support Message - Bennington State Bank"
            ? `<p><strong>Subject:</strong> ${subject}</p>`
            : ""
        }
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p>Please respond via the admin support dashboard or contact the sender directly.</p>
        <p style="font-size: 14px; color: #666;">
          Customer Support: <strong>1-800-555-1234</strong> <br>
          Email: <a href="mailto:support@benningtonstatebank.com">support@benningtonstatebank.com</a>
        </p>
        <p>Best regards,<br><strong>Bennington State Bank System</strong></p>
      </div>
    `,
  };

  try {
    await sendEmailWithRetry(mailOptions);
    console.log("✅ Support email sent to admin:", process.env.ORGANIZER_EMAIL);
  } catch (error) {
    console.error(
      "❌ Support email send error to:",
      process.env.ORGANIZER_EMAIL,
      ":",
      error
    );
    throw error;
  }
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
      console.error("JWT verification error:", err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please log in again.",
          expiredAt: err.expiredAt,
        });
      }
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
        expiresIn: "8h",
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

// Unauthenticated Contact Form Submission
app.post("/api/support/contact", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { name, email, subject, message, conversationId } = req.body;

  console.log("Contact form submission received:", req.body);

  if (!name || !email || !subject || !message) {
    console.log("Missing required fields for contact form.");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newConversationId = conversationId || generateConversationId();
    const supportMessage = new SupportMessage({
      userId: null,
      username: name,
      email,
      subject,
      message,
      sender: "visitor",
      conversationId: newConversationId,
      status: "open",
      timestamp: new Date(),
    });

    await supportMessage.save();
    console.log("Support message saved:", supportMessage._id);

    await sendSupportEmail(
      email,
      name,
      message,
      `New Contact Form Submission: ${subject}`,
      newConversationId
    );

    io.to(newConversationId).emit("supportMessage", {
      _id: supportMessage._id,
      userId: null,
      username: name,
      email,
      subject,
      message,
      sender: "visitor",
      conversationId: newConversationId,
      status: "open",
      timestamp: supportMessage.timestamp,
    });

    res.json({
      message: "Your message has been sent successfully!",
      conversationId: newConversationId,
      email,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res
      .status(500)
      .json({ message: "Error sending message. Please try again." });
  }
});

// Visitor: Get Messages by Conversation ID
app.get("/api/support/messages/:conversationId", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { conversationId } = req.params;

  if (!conversationId) {
    console.log("Missing conversationId for fetching messages");
    return res.status(400).json({ message: "Conversation ID is required" });
  }

  try {
    const messages = await SupportMessage.find({ conversationId }).sort({
      timestamp: 1,
    });
    console.log(
      `Fetched ${messages.length} messages for conversationId: ${conversationId}`
    );
    res.json(messages);
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    res.status(500).json({ message: "Error fetching messages", error });
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
        subject: `Reply to: ${originalMessage.subject || "Support Inquiry"}`,
        message: reply.trim(),
        sender: "admin",
        conversationId: originalMessage.conversationId,
        timestamp: new Date(),
        status: "open",
      });

      await supportReply.save();
      await SupportMessage.updateOne(
        { _id: messageId },
        { status: "resolved" }
      );
      await redisClient.del(
        `support-messages:client:${originalMessage.userId || "visitor"}`
      );
      await redisClient.del("support-messages:admin");

      io.to(originalMessage.conversationId).emit("supportReply", {
        userId: originalMessage.userId,
        username: originalMessage.username,
        email: originalMessage.email,
        subject: supportReply.subject,
        message: supportReply.message,
        sender: "admin",
        conversationId: originalMessage.conversationId,
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
          accountNumber: await generateUniqueAccountNumber(),
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
        accountNumber: await generateUniqueAccountNumber(),
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

      await redisClient.del("users:admin");
      io.emit("accountStatusUpdate", { userId: user._id, status: "active" });

      console.log("User approved:", user._id);
      res.json({ message: "User approved successfully" });
    } catch (error) {
      console.error("User approval error:", error);
      res.status(500).json({ message: "Error approving user", error });
    }
  }
);

// Admin: Reject (Delete) Pending User Account
app.delete(
  "/api/admin/users/:userId/reject",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        console.log("User rejection failed: User not found", req.params.userId);
        return res.status(404).json({ message: "User not found" });
      }

      if (user.status !== "pending") {
        console.log(
          "User rejection failed: User is not pending",
          req.params.userId
        );
        return res
          .status(400)
          .json({ message: "Only pending users can be rejected." });
      }

      await User.findByIdAndDelete(req.params.userId);

      await redisClient.del("users:admin");
      io.emit("userDeleted", { userId: req.params.userId });

      console.log("User rejected and deleted:", req.params.userId);
      res.json({ message: "User rejected and deleted successfully" });
    } catch (error) {
      console.error("User rejection error:", error);
      res.status(500).json({ message: "Error rejecting user", error });
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
      return res.status(400).json({ message: "Invalid status provided." });
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

      await redisClient.del("users:admin");
      io.emit("accountStatusUpdate", { userId: user._id, status });

      console.log(`User status updated to '${status}':`, user._id);
      res.json({ message: `User status successfully updated to ${status}` });
    } catch (error) {
      console.error("User status update error:", error);
      res.status(500).json({ message: "Error updating user status", error });
    }
  }
);

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
        accountNumber: await generateUniqueAccountNumber(),
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
        transactionType: action,
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
          accountNumber: await generateUniqueAccountNumber(),
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

// Admin: Get OTPs
app.get("/api/admin/otps", authenticateToken, isAdmin, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const otps = await OTP.find()
      .populate("userId", "username firstName lastName email")
      .sort({ createdAt: -1 });
    console.log("Fetched OTPs for admin:", otps.length);
    res.json(otps);
  } catch (error) {
    console.error("Fetch OTPs error:", error);
    res.status(500).json({ message: "Error fetching OTPs", error });
  }
});

// Admin: Get Support Messages
app.get(
  "/api/admin/support-messages",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      const { userId, status, page = 1, limit = 10 } = req.query;
      const query = {};
      if (userId) query.userId = userId;
      if (status) query.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const messages = await SupportMessage.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await SupportMessage.countDocuments(query);

      console.log(
        `Fetched ${messages.length} support messages for page ${page}, limit ${limit}, total ${total}`
      );
      res.json({ messages, total });
    } catch (error) {
      console.error("Fetch support messages error:", error);
      res
        .status(500)
        .json({ message: "Error fetching support messages", error });
    }
  }
);

// Admin: Get All Transactions
app.get(
  "/api/admin/transactions",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300");
    try {
      const cacheKey = "transactions:admin";
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Serving transactions from Redis cache");
        return res.json(JSON.parse(cachedData));
      }

      const transactions = await Transaction.find()
        .populate("userId", "username firstName lastName")
        .populate("recipientId", "username firstName lastName")
        .sort({ date: -1 });
      await redisClient.setEx(cacheKey, 300, JSON.stringify(transactions));
      console.log("Fetched transactions:", transactions.length);
      res.json(transactions);
    } catch (error) {
      console.error("Fetch transactions error:", error);
      res.status(500).json({ message: "Error fetching transactions", error });
    }
  }
);

// Admin: Update Transaction
app.put(
  "/api/admin/transactions/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { status } = req.body;

    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      const user = await User.findById(transaction.userId);
      const recipient = transaction.recipientId
        ? await User.findById(transaction.recipientId)
        : null;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const previousStatus = transaction.status;
      const amount = transaction.amount;

      if (transaction.type === "debit") {
        if (previousStatus !== "approved" && status === "approved") {
          if (user.balance < amount) {
            return res
              .status(400)
              .json({ message: "Insufficient balance to approve debit" });
          }
          user.balance -= amount;
        } else if (previousStatus === "approved" && status !== "approved") {
          user.balance += amount;
        }
      }

      if (transaction.type === "credit") {
        if (previousStatus !== "approved" && status === "approved") {
          user.balance += amount;
        } else if (previousStatus === "approved" && status !== "approved") {
          user.balance -= amount;
        }
      }

      transaction.status = status;

      await transaction.save();
      await user.save();
      if (recipient) await recipient.save();

      io.emit("transactionUpdated", transaction);

      res.json(transaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Admin: Get All Users
app.get("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const users = await User.find({ role: "client" })
      .sort({ _id: -1 })
      .select("-password");
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
        accountNumber: await generateUniqueAccountNumber(),
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
        expiresIn: "24h",
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

// Client: Initiate Transfer
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

  console.log("Transfer initiation request received:", req.body);

  if (
    !accountType ||
    !accountNumber ||
    !recipientAccountNumber ||
    !recipientAccountType ||
    !amount ||
    !recipientBank ||
    !recipientName
  ) {
    console.log("Missing required fields for transfer initiation.");
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (parseFloat(amount) <= 0) {
    console.log("Amount must be positive.");
    return res.status(400).json({ message: "Amount must be positive" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("Sender user not found for initiation.");
      return res.status(404).json({ message: "User not found" });
    }

    const senderAccount = user.accounts.find(
      (acc) => acc.type === accountType && acc.accountNumber === accountNumber
    );

    if (!senderAccount) {
      console.log(
        "Sender account not found or does not match type/accountNumber."
      );
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (senderAccount.status !== "active") {
      console.log("Sender account is not active.");
      return res.status(403).json({ message: "Account not active" });
    }

    if (senderAccount.balance < parseFloat(amount)) {
      console.log("Insufficient funds in the selected account.");
      return res.status(400).json({ message: "Insufficient funds" });
    }

    let recipientUserId = null;
    const recipientUser = await User.findOne({
      "accounts.accountNumber": recipientAccountNumber,
    });
    if (recipientUser) {
      const internalRecipientAccount = recipientUser.accounts.find(
        (acc) =>
          acc.accountNumber === recipientAccountNumber &&
          acc.type === recipientAccountType
      );
      if (!internalRecipientAccount) {
        console.log(
          "Recipient account type does not match the provided account number for internal user."
        );
        return res
          .status(404)
          .json({ message: "Recipient account type mismatch." });
      }
      if (internalRecipientAccount.status !== "active") {
        console.log("Internal recipient account is not active.");
        return res
          .status(403)
          .json({ message: "Recipient account not active." });
      }
      recipientUserId = recipientUser._id;
    } else {
      console.log(
        "Recipient is external (no internal user found with that account number)."
      );
    }

    const otp = generateOTP();
    const otpRecord = new OTP({
      userId: req.user.id,
      otp,
      transferData: {
        accountType,
        accountNumber,
        recipientAccountNumber,
        recipientAccountType,
        amount: parseFloat(amount),
        description: description || `Transfer to ${recipientName}`,
        recipientBank,
        recipientName,
        recipientUserId,
      },
    });

    await otpRecord.save();
    console.log(
      `OTP ${otp} saved for user ${req.user.id}. Sending email to ${user.email}.`
    );
    await sendOTPEmail(user.email, otp);

    res.json({
      message:
        "OTP sent to your email. Please verify to complete the transfer.",
    });
  } catch (error) {
    console.error("❌ Transfer initiation error (sending OTP):", error);
    res.status(500).json({
      message: error.message || "Error initiating transfer. Please try again.",
    });
  }
});

// Client: Verify OTP and Complete Transfer
app.post("/api/client/verify-otp", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { otp } = req.body;

  console.log("Verify OTP request received. OTP:", otp);

  if (!otp) {
    console.log("OTP verification failed: OTP required");
    return res.status(400).json({ message: "OTP is required" });
  }

  try {
    const otpRecord = await OTP.findOne({
      userId: req.user.id,
      otp,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
    });

    if (!otpRecord) {
      console.log(
        "OTP verification failed: Invalid or expired OTP for user",
        req.user.id
      );
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP. Please request a new one." });
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
      recipientUserId,
    } = otpRecord.transferData;

    console.log("Transfer Data from OTP record:", otpRecord.transferData);

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log(
        "OTP verification failed: Sender user not found for user ID:",
        req.user.id
      );
      return res.status(404).json({ message: "Sender user not found." });
    }

    const currentSenderUser = await User.findById(user._id);
    if (!currentSenderUser) {
      console.error("Error re-fetching sender user after OTP verification.");
      return res
        .status(500)
        .json({ message: "Internal server error during balance update." });
    }
    const currentSenderAccount = currentSenderUser.accounts.find(
      (acc) => acc.type === accountType && acc.accountNumber === accountNumber
    );

    if (!currentSenderAccount) {
      console.log(
        "OTP verification failed: Sender account not found or mismatch for user (after re-fetch):",
        user._id,
        "account:",
        accountNumber
      );
      return res.status(404).json({ message: "Sender account not found." });
    }

    if (currentSenderAccount.status !== "active") {
      console.log(
        "OTP verification failed: Sender account not active for user (after re-fetch):",
        user._id
      );
      return res.status(403).json({ message: "Sender account not active." });
    }

    if (currentSenderAccount.balance < amount) {
      console.log(
        "OTP verification failed: Insufficient funds for user (after re-fetch):",
        user._id,
        "balance:",
        currentSenderAccount.balance,
        "amount:",
        amount
      );
      return res.status(400).json({ message: "Insufficient funds." });
    }

    let recipient = null;
    let recipientAccount = null;

    if (recipientUserId) {
      recipient = await User.findById(recipientUserId);
      if (!recipient) {
        console.log(
          "OTP verification failed: Internal recipient user not found with ID:",
          recipientUserId
        );
        return res
          .status(404)
          .json({ message: "Internal recipient user not found." });
      }
      recipientAccount = recipient.accounts.find(
        (acc) =>
          acc.accountNumber === recipientAccountNumber &&
          acc.type === recipientAccountType
      );
      if (!recipientAccount) {
        console.log(
          "OTP verification failed: Internal recipient account not found for user:",
          recipientUserId,
          "account:",
          recipientAccountNumber
        );
        return res
          .status(404)
          .json({ message: "Internal recipient account not found." });
      }
      if (recipientAccount.status !== "active") {
        console.log(
          "OTP verification failed: Internal recipient account not active for user:",
          recipientUserId
        );
        return res
          .status(403)
          .json({ message: "Internal recipient account not active." });
      }
    } else {
      console.log(
        `External transfer detected to account: ${recipientAccountNumber} at ${recipientBank}. No internal user to credit directly.`
      );
    }

    console.log(
      "Sender's balance BEFORE debit (from re-fetched object):",
      currentSenderAccount.balance
    );
    const senderUpdateResult = await User.updateOne(
      { _id: user._id, "accounts.accountNumber": accountNumber },
      { $inc: { "accounts.$.balance": -amount } }
    );
    console.log("Sender update result:", senderUpdateResult);

    const finalSenderUser = await User.findById(user._id);
    const finalSenderAccount = finalSenderUser.accounts.find(
      (acc) => acc.type === accountType && acc.accountNumber === accountNumber
    );
    console.log(
      "Sender's balance AFTER debit (from final re-fetched object):",
      finalSenderAccount.balance
    );

    let finalRecipientAccount = null;
    if (recipient && recipientAccount) {
      console.log(
        "Recipient's balance BEFORE credit (from in-memory object):",
        recipientAccount.balance
      );
      const recipientUpdateResult = await User.updateOne(
        {
          _id: recipient._id,
          "accounts.accountNumber": recipientAccountNumber,
        },
        { $inc: { "accounts.$.balance": amount } }
      );
      console.log("Recipient update result:", recipientUpdateResult);

      const finalRecipient = await User.findById(recipient._id);
      finalRecipientAccount = finalRecipient.accounts.find(
        (acc) =>
          acc.accountNumber === recipientAccountNumber &&
          acc.type === recipientAccountType
      );
      console.log(
        "Recipient's balance AFTER credit (from final re-fetched object):",
        finalRecipientAccount.balance
      );
    }

    const senderTransaction = new Transaction({
      userId: user._id,
      accountType,
      accountNumber,
      amount: -amount,
      date: new Date(),
      status: "successful",
      description,
      recipientId: recipientUserId,
      recipientAccountNumber,
      recipientAccountType,
      recipientBank,
      recipientName,
      transactionType: "debit",
    });

    let recipientTransaction = null;
    if (recipientUserId) {
      recipientTransaction = new Transaction({
        userId: recipientUserId,
        accountType: recipientAccountType,
        accountNumber: recipientAccountNumber,
        amount: amount,
        date: new Date(),
        status: "successful",
        description: `Received from ${user.firstName} ${user.lastName}`,
        recipientId: user._id,
        recipientBank,
        recipientName: user.firstName + " " + user.lastName,
        transactionType: "credit",
      });
    }

    await senderTransaction.save();
    if (recipientTransaction) {
      await recipientTransaction.save();
    }
    await OTP.deleteOne({ _id: otpRecord._id });

    io.emit("transactionUpdate", senderTransaction);
    io.emit("balanceUpdate", {
      userId: user._id,
      accountType,
      accountNumber,
      balance: finalSenderAccount.balance,
    });
    if (recipientUserId && finalRecipientAccount) {
      io.emit("balanceUpdate", {
        userId: recipientUserId,
        accountType: recipientAccountType,
        accountNumber: recipientAccountNumber,
        balance: finalRecipientAccount.balance,
      });
    }

    console.log("Transfer completed successfully.");
    res.json({
      message:
        "Your transfer has been successfully initiated. It will typically take 2-5 working days to process.",
      transaction: senderTransaction,
    });
  } catch (error) {
    console.error(
      "❌ ERROR: OTP verification or transfer completion failed:",
      error
    );
    res.status(500).json({
      message: error.message || "Error completing transfer. Please try again.",
    });
  }
});

// Client: Get User Data
app.get("/api/user", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("Fetch user failed: User not found", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Fetched user:", req.user.id);
    res.json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Client: Get Account Data
app.get("/api/account", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("Fetch accounts failed: User not found", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
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
  res.setHeader("Cache-Control", "no-store");
  try {
    const { accountType, accountNumber } = req.query;
    const query = { userId: req.user.id };
    if (accountType) query.accountType = accountType;
    if (accountNumber) query.accountNumber = accountNumber;
    const transactions = await Transaction.find(query).sort({ date: -1 });
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
  const { message, subject, conversationId } = req.body;

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

    const newConversationId = conversationId || generateConversationId();
    const supportMessage = new SupportMessage({
      userId: user._id,
      username: user.username,
      email: user.email,
      subject: subject || "Support Inquiry",
      message: message.trim(),
      sender: "client",
      conversationId: newConversationId,
      timestamp: new Date(),
      status: "open",
    });

    await supportMessage.save();
    await redisClient.del(`support-messages:client:${user._id}`);
    await redisClient.del("support-messages:admin");
    io.to(newConversationId).emit("supportMessage", {
      userId: user._id,
      username: user.username,
      email: user.email,
      subject: supportMessage.subject,
      message: supportMessage.message,
      sender: "client",
      conversationId: newConversationId,
      timestamp: supportMessage.timestamp,
      status: supportMessage.status,
      _id: supportMessage._id,
    });

    await sendSupportEmail(
      user.email,
      user.username,
      message,
      `New Support Message: ${supportMessage.subject}`,
      newConversationId
    );
    console.log("Support message sent by user:", user._id);
    res.status(201).json({
      message: "Support message sent successfully",
      conversationId: newConversationId,
    });
  } catch (error) {
    console.error("Support message error:", error);
    res.status(400).json({ message: "Error sending support message", error });
  }
});

// Client: Get Support Messages
app.get("/api/client/support-messages", authenticateToken, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const messages = await SupportMessage.find({ userId: req.user.id }).sort({
      timestamp: -1,
    });
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
    socket.handshake.auth.token ? "Provided" : "Not Provided"
  );

  socket.on("joinConversation", (conversationId) => {
    if (conversationId) {
      socket.join(conversationId);
      console.log(`Client ${socket.id} joined conversation ${conversationId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Root Route for Testing
app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.send("Backend server is running ✅");
});

// Centralized server startup function
async function startServer() {
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
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected");
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    if (err.message.includes("MongoDB")) {
      console.error(
        "Please ensure your MongoDB server is running and the MONGODB_URI in your .env file is correct."
      );
    }
    if (err.message.includes("Redis")) {
      console.error(
        "Please ensure your Redis server is running and the connection details are correct."
      );
    }
    process.exit(1);
  }
}

// Call the startup function
const PORT = process.env.PORT || 5000;
startServer();
