package com.purewave.repository;

import com.purewave.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Interface for managing Project entities within a MongoDB collection.

 * This repository provides methods to perform CRUD operations and custom queries
 * specific to the Project entity, such as retrieving projects by user ID or by a unique access ID.
 * It extends the MongoRepository interface to inherit core database interaction capabilities.
 */
public interface ProjectRepository extends MongoRepository<Project, String> {
    /**
     * Finds all projects associated with the specified user ID.
     *
     * @param userId the unique identifier of the user whose projects are to be retrieved.
     * @return a list of Project objects associated with the specified user ID. If no projects
     *         are found, an empty list is returned.
     */
    List<Project> findByUserId(String userId);
    /**
     * Retrieves a project by its unique access ID.
     *
     * @param accessId the unique identifier assigned to a project, used for locating the project.
     * @return an Optional containing the project if found, or an empty Optional if no project exists with the given access ID.
     */
    Optional<Project> findByAccessId(String accessId);
}
