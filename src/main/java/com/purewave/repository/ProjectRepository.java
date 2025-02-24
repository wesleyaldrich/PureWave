package com.purewave.repository;

import com.purewave.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByUserId(String userId);
    Optional<Project> findByAccessId(String accessId);
}
