package com.purewave.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController {

    @RequestMapping({
        "/",
        "/lab",
        "/history",
        "/project/{id}",
        "/gethelp"
    })
    public String forward() {
        return "forward:/index.html"; // Forward to React
    }
}
