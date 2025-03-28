import TaskModel from "../model/taskModel.js"
import { scheduleMail } from "../utils/reminder.js";
import { clerkClient } from '@clerk/express'

// Helper function to reindex tasks after deletion
async function reindexTasks(userId) {
    const tasks = await TaskModel.find({ userId }).sort('index');

    const bulkOps = tasks.map((task, index) => ({
        updateOne: {
            filter: { _id: task._id },
            update: { $set: { index } }
        }
    }));

    await TaskModel.bulkWrite(bulkOps);
}

const getAllTask = async (req, res) => {

    try {
        const { userId } = req.user

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized Try Again." })
        }

        const tasks = await TaskModel.find({ userId });

        res.json({ success: true, message: 'successfully fetched data', tasks })

    } catch (error) {
        console.log('Error Occured : ', error)
        return res.json({ success: false, message: "Error" })
    }
}

const addtask = async (req, res) => {
    try {
        const { data } = req.body
        const { userId } = req.user

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized Try Again." })
        }

        if (!data || !data.title) {
            return res.json({ success: false, message: "Task cannot be empty." })
        }

        const user = await clerkClient.users.getUser(userId);

        const email = user.emailAddresses[0].emailAddress

        const newTask = new TaskModel({
            userId: userId,
            title: data.title,
            priority: data.priority,
            dueDate: data.dueDate,
        })

        const saveNewTask = await newTask.save()

        if (data.dueDate) {
            scheduleMail(email, data.dueDate)
        }

        if (!saveNewTask) {
            res.json({ success: false, message: "Error Occured in Adding task." })
        }

        res.json({ success: true, message: "Task Added Succesfully." })

    } catch (error) {
        console.log('Error Occured : ', error)
        res.json({ success: false, message: "Error" })
    }
}

const changeCompleted = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.json({ success: false, message: "Unauthorized Try Again." })
        }

        const task = await TaskModel.findById(id)

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(
            id,
            { completed: !task.completed },
            { new: true }
        );

        if (updatedTask.completed)
            res.json({ success: true, message: "Task completed" })

        else
            res.json({ success: true, message: "Task Incompleted" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id } = req.body
        const { userId } = req.user

        if (!id) {
            return res.json({ success: false, message: "Unauthorized Try Again." })
        }

        const task = await TaskModel.findByIdAndDelete(id)

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        await reindexTasks(userId);

        res.json({ success: true, message: 'Task delete Successfully.' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const reorder = async (req, res) => {
    try {
        const { draggedTaskId, targetTaskId } = req.body;
        const { userId } = req.user;

        // Find both tasks
        const draggedTask = await TaskModel.findOne({ _id: draggedTaskId, userId });
        const targetTask = await TaskModel.findOne({ _id: targetTaskId, userId });

        if (!draggedTask || !targetTask) {
            return res.json({ success: false, message: 'One or more tasks not found' });
        }

        // Implement reordering logic
        const userTasks = await TaskModel.find({ userId }).sort('index');

        // Remove the dragged task from its current position
        const updatedTasks = userTasks.filter(task => task._id.toString() !== draggedTaskId);

        // Insert the dragged task at the target task's index
        const targetIndex = userTasks.findIndex(task => task._id.toString() === targetTaskId);
        updatedTasks.splice(targetIndex, 0, draggedTask);

        // Reassign indices
        const reindexedTasks = updatedTasks.map((task, newIndex) => ({
            ...task.toObject(),
            index: newIndex
        }));

        // Bulk write to update indices
        const bulkOps = reindexedTasks.map(task => ({
            updateOne: {
                filter: { _id: task._id },
                update: { $set: { index: task.index } }
            }
        }));

        await TaskModel.bulkWrite(bulkOps);

        res.json({
            success: true,
            message: 'Tasks reordered successfully'
        });
    } catch (error) {
        console.error('Error reordering tasks:', error);
        res.status(500).json({ success: false, message: 'Server error reordering tasks' });
    }
}


export { getAllTask, addtask, changeCompleted, deleteTask, reorder }