import express from 'express';
import { addtask, changeCompleted, deleteTask, getAllTask, reorder } from '../controller/taskController.js'
import { clerkMiddleware } from '@clerk/express';
import clerkAuth from '../middleware/authMiddleware.js';

const taskRouter = express.Router();

taskRouter.use(clerkMiddleware())

taskRouter.get('/getAll', clerkAuth, getAllTask);
taskRouter.post('/add', clerkAuth, addtask);
taskRouter.post('/change-completed', changeCompleted)
taskRouter.post('/delete', clerkAuth, deleteTask)
taskRouter.post('/reorder', clerkAuth, reorder)


export default taskRouter;