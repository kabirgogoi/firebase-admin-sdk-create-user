const admin = require("firebase-admin")
const serviceAccount = require("./service-account.json")

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

/**
 * Creates a Firebase Auth user and sets a custom role.
 * @param {Object} userData - User details
 * @param {string} userData.email - The user's email
 * @param {string} userData.displayName - The user's display name
 * @param {string} userData.password - The user's password
 * @param {string} userData.role - Custom role (e.g., 'admin', 'student')
 * @returns {Promise<Object>} The created user record
 */
async function createUserWithRole({ email, displayName, password, role }) {
  try {
    // Create the user
    const userRecord = await admin.auth().createUser({
      email,
      displayName,
      password,
    })

    // Set custom claims (role)
    await admin.auth().setCustomUserClaims(userRecord.uid, { role })

    // Create user document in Firestore
    const userDoc = {
      email,
      name: displayName,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    await admin.firestore().collection("users").doc(userRecord.uid).set(userDoc)

    return {
      uid: userRecord.uid,
      ...userDoc,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

module.exports = { createUserWithRole }
