package com.purewave.controller;

import com.purewave.service.AudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/audio")
public class AudioController {
    @Autowired
    private AudioService audioService;

    @PostMapping
    public String uploadAudio(@RequestParam("audio") MultipartFile file) throws IOException {
        return audioService.saveAudio(file);
    }
}
