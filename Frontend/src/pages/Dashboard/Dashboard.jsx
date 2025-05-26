import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { useContext, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Activity, CheckSquare, Moon, Plus, Sun } from "lucide-react";
import AddTaskPage from "../../components/AddTasksPage/AddTaskPage";
import { StoreContext } from "../../Context/StoreContext";
import DisplayTasks from "../../components/DisplayTasks/DisplayTasks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import InsightsPage from "../Insights/InsightsPage";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();
  const { url, colorTheme, setColorTheme } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddTask, setShowAddTask] = useState(false);

  if (!isSignedIn) {
    navigate("/");
    return <p>Loading...</p>;
  }

  // Function to check if a path is active
  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.firstName}!</h1>
        <UserButton>
          <UserButton.MenuItems>
            {colorTheme === "light" ? (
              <UserButton.Action
                label="Dark Mode"
                labelIcon={<Moon size={20} />}
                onClick={() => {
                  setColorTheme("dark");
                }}
              />
            ) : (
              <UserButton.Action
                label="Light Mode"
                labelIcon={<Sun size={20} />}
                onClick={() => {
                  setColorTheme("light");
                }}
              />
            )}
          </UserButton.MenuItems>
        </UserButton>
      </div>

      <div className="dashboard-content-wrapper">
        <div className="dashboard-sidebar">
          <ul className="sidebar-menu">
            <li className={isActive("/dashboard") && !isActive("/dashboard/insights") ? "active" : ""}>
              <Link to="/dashboard/tasks">
                <CheckSquare size={20} />
                <span>Tasks</span>
              </Link>
            </li>
            <li className={isActive("/dashboard/insights") ? "active" : ""}>
              <Link to="/dashboard/insights">
                <Activity size={20} />
                <span>Insights</span>
              </Link>
            </li>
          </ul>
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className="tasks-section">
            <div className="tasks-container">
              <div className="tasks-header">
                <h3 className="tasks-title">
                  {location.pathname.includes("/insights") ? "My Insights" : "My Tasks"}
                </h3>
                <p className="tasks-subtitle">
                  {location.pathname.includes("/insights")
                    ? "Track your progress"
                    : "Organize your day with ease"}
                </p>
                {!location.pathname.includes("/insights") && (
                  <Plus
                    onClick={() => {
                      setShowAddTask(true);
                    }}
                    className="tasks-add-icon"
                    color="black"
                    width={30}
                  />
                )}
              </div>

              {showAddTask && <AddTaskPage setShowAddTask={setShowAddTask} />}

              <Routes>
                {/* Index route shows DisplayTasks by default */}
                <Route
                  index
                  element={
                    <SignedIn>
                      <DisplayTasks />
                    </SignedIn>
                  }
                />

                {/* Explicit tasks route */}
                <Route
                  path="tasks"
                  element={
                    <SignedIn>
                      <DisplayTasks />
                    </SignedIn>
                  }
                />

                {/* Insights route */}
                <Route
                  path="insights"
                  element={
                    <SignedIn>
                      <InsightsPage />
                    </SignedIn>
                  }
                />
              </Routes>
            </div>
          </div>
        </DndProvider>
      </div>
    </div>
  );
};

export default Dashboard;