import React, { useContext, useState, useCallback } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./DisplayTasks.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuth } from "@clerk/clerk-react";

const DisplayTasks = () => {
    const { tasks, setTasks, url, refreshTasks } = useContext(StoreContext);
    const [showCompleted, setShowCompleted] = useState(false);
    const { getToken } = useAuth()

    const toggleTask = async (id) => {
        try {
            const response = await axios.post(url + "/task/change-completed", { id });

            if (response.data.success) {
                refreshTasks();
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error updating task");
            console.error(error);
        }
    };

    const deletetask = async (id) => {
        const token = await getToken()
        try {
            const response = await axios.post(url + "/task/delete", { id }, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                refreshTasks();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting task");
            console.error(error);
        }
    };

    const moveTask = useCallback(async (draggedTask, targetTask) => {
        const token = await getToken()
        try {
            // Send reorder request to backend
            const response = await axios.post(url + "/task/reorder", {
                draggedTaskId: draggedTask._id,
                targetTaskId: targetTask._id
            },
                { headers: { token } }
            );

            if (response.data.success) {
                // Refresh tasks to get updated order
                refreshTasks();
            } else {
                // toast.error("Failed to reorder tasks");
            }
        } catch (error) {
            console.error("Error reordering tasks", error);
            // toast.error("Failed to reorder tasks");
        }
    }, [url, refreshTasks]);


    if (tasks.length === 0) {
        return <p>No Tasks</p>;
    }

    const completedTasks = tasks.filter((task) => task.completed === true)
        .sort((a, b) => a.index - b.index);
    const activeTasks = tasks.filter((task) => task.completed === false)
        .sort((a, b) => a.index - b.index);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="display-tasks">
                <div className="tasks-active-header">
                    <h3>Active Tasks ({activeTasks.length})</h3>
                </div>

                <ul className="tasks-list">
                    {activeTasks.map((task, index) => (
                        <DraggableTask
                            key={task._id}
                            task={task}
                            index={index}
                            tasks={activeTasks}
                            toggleTask={toggleTask}
                            deletetask={deletetask}
                            moveTask={moveTask}
                            type="ACTIVE_TASK"
                        />
                    ))}
                </ul>

                <span className="toggle-completed-btn" onClick={() => setShowCompleted(!showCompleted)}>
                    {showCompleted ? (
                        <>
                            Completed <ChevronUp />
                        </>
                    ) : (
                        <>
                            Completed ({completedTasks.length}) <ChevronDown />
                        </>
                    )}
                </span>

                {showCompleted && (
                    <div className="completed-tasks-section">
                        <h2>Completed Tasks</h2>
                        <ul className="tasks-list">
                            {completedTasks.map((task, index) => (
                                <DraggableTask
                                    key={task._id}
                                    task={task}
                                    index={index}
                                    tasks={completedTasks}
                                    toggleTask={toggleTask}
                                    deletetask={deletetask}
                                    moveTask={moveTask}
                                    type="COMPLETED_TASK"
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};

// 🏗️ Draggable Task Component
const DraggableTask = ({ task, index, tasks, toggleTask, deletetask, moveTask, type }) => {
    const [{ isDragging }, drag] = useDrag({
        type: type,
        item: { task, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: type,
        hover: (draggedItem, monitor) => {
            if (draggedItem.task._id !== task._id) {
                moveTask(draggedItem.task, task);
            }
        },
    });

    return (
        <li
            ref={(node) => drag(drop(node))}
            className={`task-item ${task.completed ? 'task-completed' : ''}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: "grab",
            }}
        >
            <div className="task-content">
                <h3
                    className="task-text"
                    onClick={() => toggleTask(task._id)}
                >
                    {task.title}
                </h3>
                {task.description && (
                    <p className="task-description">
                        {task.description}
                    </p>
                )}
            </div>
            <div className="task-actions">
                <button
                    className="task-delete-btn"
                    onClick={() => deletetask(task._id)}
                >
                    🗑️
                </button>
            </div>
        </li>
    );
};

export default DisplayTasks;