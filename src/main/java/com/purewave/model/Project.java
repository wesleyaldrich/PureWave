package com.purewave.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "projects")
@Data
public class Project {

    @Id
    private String id;
    private String accessId;
    private String userId;
    private String title;
    private String dryAudio;
    private String wetAudio;
}
