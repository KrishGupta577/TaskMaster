import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Tag, AlarmClock, AlertCircle, X, Store } from 'lucide-react';
import './AddTaskPage.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';

const AddTaskPage = ({ setShowAddTask }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const { url, refreshTasks } = useContext(StoreContext)
  const { getToken } = useAuth();

  const onSubmit = async (data) => {
    const token = await getToken();

    if (!token) {
      toast.error("Authentication error: No token found.");
      return;
    }

    try {
      const response = await axios.post(url + '/task/add', { data }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        refreshTasks()
        setShowAddTask(false)
        reset()
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="task-page-container">
      <div className="task-card">
        <div className="add-task-header">
          <h2 className="task-title">Create New Task</h2>\
          <X className='close-icon' size={24} onClick={() => { setShowAddTask(false) }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="task-form">
          {/* Title Input */}
          <div className="task-form-group">
            <label htmlFor="task-title" className="task-label">
              <Tag className="task-icon" />
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Enter task title"
              className="task-input"
              {...register("title", {
                required: "Task title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters"
                }
              })}
            />
            {errors.title && (
              <span className="task-error">{errors.title.message}</span>
            )}
          </div>

          {/* Description Input */}
          <div className="task-form-group">
            <label htmlFor="task-description" className="task-label">
              <AlertCircle className="task-icon" />
              Description
            </label>
            <textarea
              id="task-description"
              placeholder="Enter task description"
              className="task-input task-textarea"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters"
                }
              })}
            />
            {errors.description && (
              <span className="task-error">{errors.description.message}</span>
            )}
          </div>

          {/* Due Date Input */}
          <div className="task-form-group">
            <label htmlFor="task-dueDate" className="task-label">
              <Calendar className="task-icon" />
              Due Date
            </label>
            <input
              id="task-dueDate"
              type="date"
              className="task-input"
              {...register("dueDate", {
                required: "Due date is required"
              })}
            />
            {errors.dueDate && (
              <span className="task-error">{errors.dueDate.message}</span>
            )}
          </div>

          {/* Priority Select */}
          <div className="task-form-group">
            <label htmlFor="task-priority" className="task-label">
              <AlarmClock className="task-icon" />
              Priority
            </label>
            <select
              id="task-priority"
              className="task-input"
              {...register("priority", {
                required: "Priority is required"
              })}
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <span className="task-error">{errors.priority.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="task-submit-btn">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPage;
