/**
 * One-off script to create (or promote) a test admin account.
 *
 * Usage:
 *   node scripts/seedAdmin.js admin@example.com StrongPassw0rd "Admin User"
 *
 * Requires the same FIREBASE_ADMIN_SDK_KEY / FIREBASE_STORAGE_BUCKET env
 * vars as the main server (loaded from ../.env).
 */
require("dotenv").config();
const { admin, auth, db } = require("../config/firebaseAdmin");

async function seedAdmin() {
  const [, , email, password, displayName] = process.argv;

  if (!email || !password) {
    console.error("Usage: node scripts/seedAdmin.js <email> <password> [displayName]");
    process.exit(1);
  }

  let userRecord;

  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`Found existing Firebase Auth user: ${userRecord.uid}`);
  } catch (err) {
    userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName || "Admin User",
    });
    console.log(`Created new Firebase Auth user: ${userRecord.uid}`);
  }

  await db
    .collection("users")
    .doc(userRecord.uid)
    .set(
      {
        user_id: userRecord.uid,
        display_name: displayName || userRecord.displayName || "Admin User",
        email_address: email,
        registration_timestamp: admin.firestore.Timestamp.now(),
        report_count: 0,
        role: "admin",
      },
      { merge: true }
    );

  console.log(`✔ ${email} is now an admin (uid: ${userRecord.uid}).`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Failed to seed admin user:", err);
  process.exit(1);
});
