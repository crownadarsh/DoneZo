import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

const RenderTask = ({ markCompleteHandler, deleteHandler, editHandler, tasks }) => {
  

  // Fetch tasks when the component mounts
  

  return (
    <div className="max-h-[500px] overflow-y-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            markCompleteHandler={markCompleteHandler}
            deleteHandler={deleteHandler}
            editHandler={editHandler}
          />
        ))}
      </div>
    </div>
  );
};

export default RenderTask;
