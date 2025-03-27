import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TaskModel from '../src/model/taskModel.js'; // Ensure the path is correct

dotenv.config(); // Load environment variables

// 🏗 Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://krishnagupta2022:krish67890@cluster0.afxjfdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        });
        console.log("🔥 Database Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Error:", error);
        process.exit(1);
    }
};

// 📝 Sample Tasks Data
const sampleTasks = Array.from({ length: 10 }).map((_, index) => ({
    userId: "user_2utO9sunQCGU7z05nX5jJmbevRV", // Replace with actual user ID
    title: `Task ${index + 1}`,
    description: `This is task number ${index + 1}`,
    completed: index % 2 === 0, // Alternate between completed and not
    priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)], // Random priority
    dueDate: new Date(Date.now() + index * 24 * 60 * 60 * 1000), // Due dates in sequence
    index: index, // Ensure sequential index
}));

// 🚀 Insert Seed Data
const seedDatabase = async () => {
    await connectDB();
    try {
        await TaskModel.deleteMany(); // Clear existing tasks
        await TaskModel.insertMany(sampleTasks);
        console.log("✅ Seed Data Inserted Successfully");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedDatabase();
