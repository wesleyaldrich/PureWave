package com.purewave.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "posts")
@Data
public class Post {

    @Id
    private String id;
    private String userId;
    private String name;
    private String picture;
    private String content;
    private String attachment;
    private String attachedTo;
    private Integer replyCount;
}
