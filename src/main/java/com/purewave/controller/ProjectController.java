package com.purewave.controller;

import com.purewave.model.Project;
import com.purewave.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for managing projects. Provides endpoints for creating, retrieving, updating,
 * and deleting projects. This controller communicates with the ProjectService to perform the
 * business logic and handles HTTP requests and responses.

 * Mapped to the base URL "/data/projects".
 */
@RestController
@RequestMapping("/data/projects")
public class ProjectController {
    /**
     * Service layer dependency responsible for managing Project-related operations.
     * It provides functionalities such as retrieving a list of projects owned by a user,
     * updating project details, creating new projects, and deleting existing ones.

     * This field is injected into the controller to delegate business logic related to projects.
     */
    @Autowired
    private ProjectService projectService;

    /**
     * Retrieves a list of projects owned by the authenticated user.
     *
     * @param authentication the security context providing the authenticated user's details
     * @return a list of projects associated with the currently authenticated user
     */
    @GetMapping
    public List<Project> getOwnProjects(Authentication authentication) {
        return projectService.getOwnProjects(authentication);
    }

    /**
     * Retrieves a specific project based on the provided access ID.
     *
     * @param accessId the unique access identifier associated with the project to be retrieved
     * @return an {@code Optional} containing the project if found, or an empty {@code Optional} if no project matches the access ID
     */
    @GetMapping("/{accessId}")
    public Optional<Project> openProject(@PathVariable String accessId) {
        return projectService.openProject(accessId);
    }

    /**
     * Renames an existing project with a new title.
     * This endpoint ensures the project belongs to the authenticated user before updating.
     *
     * @param id the unique identifier of the project to rename
     * @param req a map containing the request body; expects a key "title" with the new project title
     * @param authentication the security context containing the authenticated user's details
     */
    @PutMapping("/{id}")
    public void renameProject(@PathVariable String id, @RequestBody Map<String, String> req, Authentication authentication){
        String newName = req.get("title");

        projectService.renameProject(id, newName, authentication);
    }

    /**
     * Creates a new project for the authenticated user. The project will be initialized
     * with an access ID and user ID corresponding to the authenticated user and saved
     * to the repository.
     *
     * @param project the project to be created, provided in the request body
     * @param authentication the security context containing the authenticated user's details
     * @return the created project instance, including the generated access ID and user ID
     */
    @PostMapping
    public Project createProject(@RequestBody Project project, Authentication authentication) {
        return projectService.saveProject(project, authentication);
    }

    /**
     * Deletes an existing project identified by its unique ID. This operation
     * ensures that the project belongs to the authenticated user before deletion.
     *
     * @param id the unique identifier of the project to be deleted
     * @param authentication the security context providing the authenticated user's details
     */
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable String id, Authentication authentication) {
        projectService.deleteProject(id, authentication);
    }
}
