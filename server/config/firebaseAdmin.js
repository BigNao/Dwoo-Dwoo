/**
 * Firebase Admin SDK initialisation.
 *
 * FIREBASE_ADMIN_SDK_KEY must be a JSON string containing the full
 * service account credentials downloaded from the Firebase console
 * (Project Settings -> Service Accounts -> Generate new private key).
 *
 * Because the key is stored as a single-line JSON string inside .env,
 * literal newlines inside the private_key field are escaped as "\n".
 * We restore them before handing the object to admin.credential.cert().
 */
const admin = require("firebase-admin");

function loadServiceAccount() {
  const raw = process.env.FIREBASE_ADMIN_SDK_KEY;

  if (!raw) {
    throw new Error(
      "FIREBASE_ADMIN_SDK_KEY is not set. Add the service account JSON " +
        "(as a single-line string) to your .env file."
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      "FIREBASE_ADMIN_SDK_KEY could not be parsed as JSON. Make sure the " +
        "entire service account file contents were copied onto one line."
    );
  }

  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }

  return parsed;
}

if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { admin, db, auth, storage };
