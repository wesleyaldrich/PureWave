package com.purewave.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * ReactController is responsible for handling specific request mappings
 * and forwarding them to the React application's entry point.

 * This controller enables the backend to serve the SPA (Single Page Application)
 * by forwarding specified routes to the React front-end's index.html.
 */
@Controller
public class ReactController {

    /**
     * Handles specific route mappings and forwards them to the React application's entry point.
     * This method ensures that the backend properly serves the React-based Single Page Application (SPA)
     * by forwarding specified requests to the React front-end's index.html.
     *
     * @return a forward directive to the SPA's main index.html entry point
     */
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
