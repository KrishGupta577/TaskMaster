import { UserButton, useUser } from "@clerk/clerk-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Plus } from "lucide-react";
import AddTaskPage from "../../components/AddTasksPage/addTaskPage";
import { StoreContext } from "../../Context/StoreContext";
import DisplayTasks from "../../components/DisplayTasks/DisplayTasks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();
  const { url } = useContext(StoreContext)
  const navigate = useNavigate();
  const [showAddTask, setShowAddTask] = useState(false)

  if (!isSignedIn) {
    navigate("/");
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.firstName}!</h1>
        <UserButton />
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="tasks-section">
          <div className="tasks-container">
            <div className="tasks-header">
              <h3 className="tasks-title">My Tasks</h3>
              <p className="tasks-subtitle">Organize your day with ease</p>
              <Plus onClick={() => { setShowAddTask(true) }} className="tasks-add-icon" color="black" width={30} />
            </div>

            {showAddTask && <AddTaskPage setShowAddTask={setShowAddTask} />}

            <DisplayTasks />
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default Dashboard;
