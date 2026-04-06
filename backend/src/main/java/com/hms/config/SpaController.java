package com.hms.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards all non-API, non-static requests to index.html so Angular's
 * client-side router handles the route on page refresh or direct navigation.
 */
@Controller
public class SpaController {

    @GetMapping(value = {"/{path:[^\\.]*}", "/{path:[^\\.]*}/**/{file:[^\\.]*}"})
    public String spa() {
        return "forward:/index.html";
    }
}
