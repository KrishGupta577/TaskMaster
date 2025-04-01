import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { useContext, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Activity, Moon, Plus, Sun } from "lucide-react";
import AddTaskPage from "../../components/AddTasksPage/addTaskPage";
import { StoreContext } from "../../Context/StoreContext";
import DisplayTasks from "../../components/DisplayTasks/DisplayTasks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();
  const { url, colorTheme, setColorTheme } = useContext(StoreContext)
  const navigate = useNavigate();
  const [showAddTask, setShowAddTask] = useState(false)

  console.log(user.id)

  if (!isSignedIn) {
    navigate("/");
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.firstName}!</h1>
        <UserButton >
          <UserButton.MenuItems>
            {colorTheme === 'light' ?
              <UserButton.Action label="Dark Mode" labelIcon={<Moon size={20} />} onClick={() => { setColorTheme('dark') }} />
              :
              <UserButton.Action label="Light Mode" labelIcon={<Sun size={20} />} onClick={() => { setColorTheme('light') }} />
            }
            <UserButton.Action label="Insights" labelIcon={<Activity size={20} />} onClick={() => { navigate('/insights') }} />
          </UserButton.MenuItems>
        </UserButton>
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

            <Routes>
              <Route
                path='tasks'
                element={
                  <SignedIn>
                    <DisplayTasks />
                  </SignedIn>
                }
              >
              </Route>
            </Routes>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default Dashboard;
