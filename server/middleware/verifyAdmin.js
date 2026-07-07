const { auth, db } = require("../config/firebaseAdmin");

/**
 * verifyAdmin
 *
 * Expects an "Authorization: Bearer <Firebase ID token>" header.
 *  - 401 if the token is missing, malformed, or invalid/expired.
 *  - 403 if the token is valid but the user's Firestore role !== "admin".
 *
 * On success, attaches { uid, email, role, ...userDoc } to req.user.
 */
async function verifyAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        error: "Unauthenticated",
        message: "Missing or malformed Authorization header. Expected 'Bearer <token>'.",
      });
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (err) {
      return res.status(401).json({
        error: "Unauthenticated",
        message: "Invalid or expired authentication token.",
      });
    }

    const userSnap = await db.collection("users").doc(decodedToken.uid).get();

    if (!userSnap.exists) {
      return res.status(403).json({
        error: "Forbidden",
        message: "No user record found for this account.",
      });
    }

    const userData = userSnap.data();

    if (userData.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "This action requires administrator privileges.",
      });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userData,
    };

    return next();
  } catch (err) {
    console.error("verifyAdmin error:", err);
    return res.status(500).json({
      error: "InternalServerError",
      message: "Failed to verify administrator credentials.",
    });
  }
}

module.exports = verifyAdmin;
