package com.crown.DoneZo.service;

import com.crown.DoneZo.dto.input.CreateTaskDto;
import com.crown.DoneZo.dto.output.TaskDto;
import com.crown.DoneZo.entity.Tasks;
import com.crown.DoneZo.entity.User;
import com.crown.DoneZo.exceptions.ResourceNotFoundException;
import com.crown.DoneZo.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TasksService {

    private final TaskRepository tasksRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public TaskDto createTask(CreateTaskDto tasks) {
        User user = userService.getCurrentUser();
        Tasks task = Tasks.builder()
                .title(tasks.getTitle())
                .description(tasks.getDescription())
                .deadline(tasks.getDeadline())
                .isCompleted(false)
                .user(user)
                .updatedAt(LocalDateTime.now())
                .build();
        return modelMapper.map(tasksRepository.save(task), TaskDto.class);
    }

    public List<TaskDto> getMyAllTasks() {
        User user = userService.getCurrentUser();
        List<Tasks> tasks = tasksRepository.findAllTaskByUser(user);
        return tasks.stream().map(task -> modelMapper.map(task, TaskDto.class)).collect(Collectors.toList());
    }

    public TaskDto getTaskById(Long id) {
        Tasks task = tasksRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Task not found with id: "+ id )
        );
        return modelMapper.map(task, TaskDto.class);
    }

    public TaskDto updateTask(Long id, TaskDto updatedTasks) {
        Tasks task = tasksRepository.findById(id).map(tasks -> {
            tasks.setTitle(updatedTasks.getTitle());
            tasks.setDescription(updatedTasks.getDescription());
            tasks.setIsCompleted(updatedTasks.getIsCompleted());
            return updateTask(tasks);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
        return modelMapper.map(task, TaskDto.class);
    }

    public void deleteTask(Long id) {
        tasksRepository.deleteById(id);
    }

    public Tasks updateTask(Tasks task){
        task.setUpdatedAt(LocalDateTime.now());
        return tasksRepository.save(task);
    }

    public TaskDto markTaskAsCompleted(Long id) {
        Tasks task = tasksRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Task not found with id: "+ id )
        );
        task.setIsCompleted(true);
        task.setCompletedAt(LocalDateTime.now());
        updateTask(task);
        return modelMapper.map(task, TaskDto.class);
    }
}

