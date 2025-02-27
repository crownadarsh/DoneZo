package com.crown.DoneZo.controller;

import com.crown.DoneZo.dto.input.CreateTaskDto;
import com.crown.DoneZo.dto.output.TaskDto;
import com.crown.DoneZo.service.TasksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TasksService tasksService;

    // Create Task
    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody CreateTaskDto tasks) {
        return ResponseEntity.ok(tasksService.createTask(tasks));
    }

    // Get All Tasks
    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        return ResponseEntity.ok(tasksService.getMyAllTasks());
    }

    // Get Task by ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(tasksService.getTaskById(id));
    }

    // Update Task
    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @RequestBody TaskDto updatedTask) {
        return ResponseEntity.ok(tasksService.updateTask(id, updatedTask));
    }

    // Delete Task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        tasksService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskDto> markTaskAsCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(tasksService.markTaskAsCompleted(id));
    }
}
