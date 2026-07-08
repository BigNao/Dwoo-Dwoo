/**
 * Returns the post-authentication destination based on Firestore user role.
 */
export function getPostLoginPath(profile, fallback = "/citizen") {
  if (profile?.role === "admin") return "/admin";
  if (profile?.role === "citizen") return "/citizen";
  return fallback;
}
