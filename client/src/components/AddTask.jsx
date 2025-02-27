import React, { useState, useEffect } from "react";
import RenderTask from "./RenderTask";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [mainTask, setMainTask] = useState([]);
  const [error, setError] = useState("");
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      console.error("❌ No user data found in localStorage.");
      setError("User not logged in.");
      return;
    }

    const { accessToken } = JSON.parse(userData);
    if (!accessToken) {
      console.error("❌ Access token missing.");
      setError("Invalid session. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Fetched Tasks:", data);

      // ✅ Ensures UI updates correctly
      setMainTask(data);
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError(err.message);
    }
  };

  const deleteHandler = async (taskId) => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) return;

      const { accessToken } = JSON.parse(userData);
      if (!accessToken) return;

      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      console.log(`✅ Task ${taskId} deleted`);
      setMainTask((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const markCompleteHandler = async (taskId) => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) return;

      const { accessToken } = JSON.parse(userData);
      if (!accessToken) return;

      const response = await fetch(
        `http://localhost:8080/tasks/${taskId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to mark task as completed: ${response.statusText}`
        );
      }

      console.log(`✅ Task ${taskId} marked as completed`);
      fetchTasks()

      const updatedTask = await response.json();
      setMainTask((prevTasks) => {
        return prevTasks.map((task) => 
          task.id === taskId 
            ? { ...task, completed: true, completedAt: new Date().toISOString() } 
            : task
        );
      });
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !deadline) {
      setError("All fields are mandatory");
      return;
    }

    if (title.trim().length <= 3) {
      setError("Title must be more than 3 characters");
      return;
    }

    const descriptionWordCount = description.trim().split(/\s+/).length;
    if (descriptionWordCount < 3 || descriptionWordCount > 50) {
      setError("Description must be between 3 to 50 words");
      return;
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      setError("Deadline must be in the future");
      return;
    }

    const newTask = await addTask(title, description, deadline);
    if (newTask) {
      setMainTask((prevTasks) => [...prevTasks, newTask]);
      setTitle("");
      setDescription("");
      setDeadline("");
    }
  };

  const addTask = async (title, description, deadline) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      console.error("User not logged in.");
      return null;
    }

    const { accessToken } = JSON.parse(userData);
    if (!accessToken) {
      console.error("Access token missing");
      return null;
    }

    try {
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, description, deadline }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Task added:", data);
      return data;
    } catch (error) {
      console.error("Task creation failed:", error.message);
      return null;
    }
  };

  const editHandler = (task) => {
    setEditTask(task);
  };

  const updateTask = async () => {
    if (!editTask) return;

    try {
      const userData = localStorage.getItem("userData");
      const { accessToken } = JSON.parse(userData);

      const response = await fetch(
        `http://localhost:8080/tasks/${editTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(editTask),
        }
      );

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();
      setMainTask((prevTasks) =>
        prevTasks.map((task) => (task.id === editTask.id ? updatedTask : task))
      );
      setEditTask(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <>
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      <form onSubmit={submitHandler}>
        <input
          type="text"
          className="text-2xl border-zinc-800 border-4 m-5 px-4 py-2"
          placeholder="Enter Task here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="text-2xl border-zinc-800 border-4 m-5 px-4 py-2"
          placeholder="Enter Description here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          className="text-2xl border-zinc-800 border-4 m-5 px-4 py-2"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-3 text-2xl font-bold rounded m-5">
          Add Task
        </button>
      </form>
      <hr />
      <div className="p-8 bg-slate-200">
        <h1 className="text-2xl font-bold mb-4">Task List</h1>
        {mainTask.length > 0 ? (
          <RenderTask
            tasks={mainTask}
            markCompleteHandler={markCompleteHandler}
            deleteHandler={deleteHandler}
            editHandler={editHandler}
          />
        ) : (
          <h2>No Task Available</h2>
        )}
      </div>

      {editTask && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00000085] ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Task</h2>
            <input
              className="w-full p-2 mb-3 border border-gray-400 rounded"
              value={editTask.title}
              onChange={(e) =>
                setEditTask({ ...editTask, title: e.target.value })
              }
              placeholder={editTask.title}
            />
            <textarea
              className="w-full p-2 mb-3 border border-gray-400 rounded"
              value={editTask.description}
              onChange={(e) =>
                setEditTask({ ...editTask, description: e.target.value })
              }
              placeholder={editTask.description}
            />
            <input
              type="datetime-local"
              className="w-full p-2 mb-3 border border-gray-400 rounded"
              value={editTask.deadline}
              onChange={(e) =>
                setEditTask({ ...editTask, deadline: e.target.value })
              }
              placeholder={editTask.deadline}
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={updateTask}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setEditTask(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTask;
