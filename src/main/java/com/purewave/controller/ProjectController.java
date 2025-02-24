package com.purewave.controller;

import com.purewave.model.Project;
import com.purewave.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/data/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping
    public List<Project> getOwnProjects(Authentication authentication) {
        return projectService.getOwnProjects(authentication);
    }

    @GetMapping("/{accessId}")
    public Optional<Project> openProject(@PathVariable String accessId) {
        return projectService.openProject(accessId);
    }

    @PutMapping("/{id}")
    public void renameProject(@PathVariable String id, @RequestBody Map<String, String> req, Authentication authentication){
        String newName = req.get("title");

        projectService.renameProject(id, newName, authentication);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project, Authentication authentication) {
        return projectService.saveProject(project, authentication);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable String id, Authentication authentication) {
        projectService.deleteProject(id, authentication);
    }
}
