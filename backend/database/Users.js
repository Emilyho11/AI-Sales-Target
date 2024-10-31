import { connect } from './Connect.js';
import bcrypt from 'bcrypt';

// Insert a new user
export async function insertUser(user) {
  const collection = await connect();
  const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
  user.password = hashedPassword;
  const result = await collection.insertOne(user);
  console.log(`New user inserted `);
}

// Check if user exists in database
export async function userExists(userEmail) {
  const collection = await connect();
  // Check if the user already exists
  const existingUser = await collection.findOne({ email: userEmail });
  if (existingUser) {
    console.log('User already exists');
    return true;
  }
}

// Delete a user by email
export async function deleteUser(userEmail) {
  const collection = await connect();
  const result = await collection.deleteOne({ email: userEmail });
  console.log(`${result.deletedCount} user(s) deleted`);
}

// Update a user by email
export async function updateUser(userEmail, updatedUser) {
  const collection = await connect();
  if (updatedUser.password) {
    updatedUser.password = await bcrypt.hash(updatedUser.password, 10); // Hash the new password
  }
  const result = await collection.updateOne(
    { email: userEmail },
    { $set: updatedUser }
  );
  console.log(`${result.modifiedCount} user(s) updated`);
}

// Retrieve all users
export async function getUsers() {
  const collection = await connect();
  const users = await collection.find({}).toArray();
  console.log('Users retrieved.');
  return users;
}

// Retrieve a user by email
export async function getUserByEmail(userEmail) {
  const collection = await connect();
  const user = await collection.findOne({ email: userEmail });
  console.log('User retrieved.');
  return user;
}

// Login a user
export async function loginUser(email, password) {
  const collection = await connect();
  const user = await collection.findOne({ email: email });
  if (!user) {
    return "User not found";
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return "Incorrect password";
  }
  console.log('User logged in');
  return user;
}

// Example usage
// async function main() {
//   try {
//     // Insert a new user
//     await insertUser({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' });

//     // Retrieve all users
//     const users = await getUsers();
//     console.log('All users:', users);

//     // Login a user
//     await loginUser('john.doe@example.com', 'password123');

//     // Exit the process after completing the operations
//     process.exit(0);
//   } catch (error) {
//     console.error('Error:', error);
//     process.exit(1); // Exit with an error code
//   }
// }

// main();
