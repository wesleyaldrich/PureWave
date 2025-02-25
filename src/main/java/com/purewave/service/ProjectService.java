package com.purewave.service;

import com.purewave.exception.ProjectNotFoundException;
import com.purewave.exception.UnauthorizedException;
import com.purewave.model.Project;
import com.purewave.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * This service class provides business logic for managing Project entities. It facilitates
 * interactions between the application's controllers and the ProjectRepository for handling
 * project-related operations, including retrieval, creation, updating, and deletion.

 * This class relies on Spring dependency injection for wiring the required repository,
 * and it utilizes an Authentication object for obtaining and verifying the identity of
 * the currently authenticated user.
 */
@Service
public class ProjectService {
    /**
     * Repository instance for handling database operations related to the `Project` entity.

     * This variable is automatically injected by Spring's dependency injection mechanism.
     * It serves as the connection point to the `ProjectRepository`, enabling the service layer
     * to perform CRUD operations and execute custom queries for managing `Project` data.
     */
    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Retrieves the list of projects that belong to the currently authenticated user.
     * The user's identity is determined from the provided authentication object.
     *
     * @param authentication the security context containing the authenticated user's details.
     *                        The user's email is extracted from the principal to identify ownership.
     * @return a list of {@code Project} objects associated with the authenticated user. If no projects
     *         are found, an empty list is returned.
     */
    public List<Project> getOwnProjects(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        return projectRepository.findByUserId(email);
    }

    /**
     * Opens a project by its unique access ID.
     * This method retrieves a project entity from the repository based on the provided access ID.
     *
     * @param accessId the unique identifier assigned to the project to be retrieved
     * @return an {@code Optional} containing the project if found, or an empty {@code Optional} if no project exists with the given access ID
     */
    public Optional<Project> openProject(String accessId) {
        return projectRepository.findByAccessId(accessId);
    }

    /**
     * Saves a project for the authenticated user. The method assigns a generated access ID
     * and the user's email (retrieved from the authentication object) to the project before saving it
     * to the repository.
     *
     * @param project the project to be saved, containing details such as title and audio references.
     * @param authentication the security context containing the authenticated user's details.
     *                        The user's email is extracted from the principal and assigned to the project.
     * @return the saved project, including the generated access ID and associated user ID.
     */
    public Project saveProject(Project project, Authentication authentication) {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        String accessId = getSaltString();
        project.setAccessId(accessId);
        project.setUserId(email);

        System.out.println("Project before saving: " + project);

        return projectRepository.save(project);
    }

    /**
     * Generates a random alphanumeric string of length 12 using uppercase
     * letters and digits. The resulting string is typically used as a
     * unique identifier or access key.
     *
     * @return a randomly generated 12-character alphanumeric string
     */
    private String getSaltString() {
        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();

        while (salt.length() < 12) {
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }

        return salt.toString();
    }

    /**
     * Renames an existing project by updating its title. This method ensures that the project
     * belongs to the authenticated user before making any changes. If the project does not exist
     * or the user is not authorized, an appropriate exception is thrown.
     *
     * @param id the unique identifier of the project to be renamed
     * @param newName the new title to be assigned to the project
     * @param authentication the security context containing the authenticated user's details
     */
    public void renameProject(String id, String newName, Authentication authentication) {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with ID: " + id));

        // Validate user
        if (!existingProject.getUserId().equals(email)) {
            throw new UnauthorizedException("You are not authorized to delete this post.");
        }

        existingProject.setTitle(newName);

        projectRepository.save(existingProject);
    }

    /**
     * Deletes a project identified by its unique ID. This method ensures
     * that the authenticated user owns the project before performing the deletion.
     *
     * @param id the unique identifier of the project to be deleted
     * @param authentication the security context containing the authenticated user's details
     *                        used to verify project ownership
     * @throws ProjectNotFoundException if no project is found with the given ID
     * @throws UnauthorizedException if the authenticated user is*/
    public void deleteProject(String id, Authentication authentication) {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with ID: " + id));

        // Validate user
        if (!existingProject.getUserId().equals(email)) {
            throw new UnauthorizedException("You are not authorized to delete this post.");
        }

        projectRepository.deleteById(id);
    }
}
