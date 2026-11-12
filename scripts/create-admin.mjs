import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "Administrator" } = process.env;
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local before running this command.");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 12) {
  console.error("ADMIN_PASSWORD must contain at least 12 characters.");
  process.exit(1);
}

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: "Administrator" },
}, { timestamps: true, versionKey: false });

try {
  await mongoose.connect(MONGODB_URI);
  const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
  const email = ADMIN_EMAIL.toLowerCase().trim();
  if (await Admin.exists({})) {
    console.error("An administrator already exists. No account was changed.");
    process.exitCode = 1;
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({ email, passwordHash, name: ADMIN_NAME });
    console.log(`Administrator created: ${email}`);
  }
} catch (error) {
  console.error("Could not create administrator:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
