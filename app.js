const { createUserWithRole } = require("./create-user")
const { input } = require("@inquirer/prompts")

;(async () => {
  const displayName = await input({
    message: "Enter your name: ",
    required: true,
    validate: (value) => value.trim().length > 0,
  })

  const email = await input({
    message: "Enter your email: ",
    required: true,
    validate: (value) => value.trim().length > 0,
  })

  const password = await input({
    message: "Enter your password: ",
    required: true,
    validate: (value) => value.trim().length > 6,
  })

  const role = await input({
    message: "Enter your role: ",
    default: "admin",
    required: true,
    validate: (value) => value.trim().length > 0,
  })

  try {
    const newUser = await createUserWithRole({
      email,
      displayName,
      password,
      role,
    })

    console.log("User created:", newUser)
  } catch (err) {
    console.error("Failed to create user:", err.message)
  }
})()

process.on("uncaughtException", (error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("👋 until next time!")
  } else {
    // Rethrow unknown errors
    throw error
  }
})
