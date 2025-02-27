package com.crown.DoneZo.repository;

import com.crown.DoneZo.entity.Tasks;
import com.crown.DoneZo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Tasks, Long> {

    List<Tasks> getAllTaskByUser(User user);

    @Query("SELECT t FROM Tasks t WHERE t.user = :user order by t.updatedAt desc")
    List<Tasks> findAllTaskByUser(User user);
}
