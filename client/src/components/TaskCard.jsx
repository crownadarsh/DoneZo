import React, { useState } from "react";

const TaskCard = ({ task, markCompleteHandler, deleteHandler, editHandler }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border relative w-full max-w-sm">
      <h3 className="text-lg font-semibold">{task.title || "N/A"}</h3>
      <p className="text-gray-600">{task.description || "N/A"}</p>

      <div className="text-sm text-gray-500 mt-2">
        <p>
          <strong>Created:</strong>{" "}
          {task.createdAt ? new Date(task.createdAt).toLocaleString() : "N/A"}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {task.deadline ? new Date(task.deadline).toLocaleString() : "N/A"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {task.isCompleted ? (
            <span className="text-green-600 font-medium">Completed</span>
          ) : (
            <span className="text-red-600 font-medium">Pending</span>
          )}
        </p>
        {task.isCompleted && task.completedAt && (
          <p>
            <strong>Completed At:</strong>{" "}
            {new Date(task.completedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Actions Dropdown */}
      <div className="absolute top-4 right-4">
        <button
          className="bg-[#033452] text-white px-3 py-1 rounded hover:bg-gray-300 focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Actions
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
            <button
              onClick={() => {
                if (!task.isCompleted) {
                    editHandler(task);
                    setDropdownOpen(false);
                } 
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                task.isCompleted
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              disabled={task.isCompleted}
            >
              Edit Task
            </button>
            <button
              onClick={() => {
                if (!task.isCompleted) {
                  markCompleteHandler(task.id);
                  setDropdownOpen(false);
                }
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                task.isCompleted
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              disabled={task.isCompleted}
            >
              Mark as Completed
            </button>
            <button
              onClick={() => {
                deleteHandler(task.id);
                setDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
