package com.hms.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards all non-API, non-static requests to index.html so Angular's
 * client-side router handles the route on page refresh or direct navigation.
 *
 * Spring Boot 3 PathPatternParser does not allow patterns after **, so we
 * enumerate depth levels (covers all Angular routes in this app).
 */
@Controller
public class SpaController {

    // /dashboard  /appointments  /billing  etc.
    @GetMapping("/{path:[^\\.]*}")
    public String spa1() { return "forward:/index.html"; }

    // /patients/42  /admin/users  etc.
    @GetMapping("/{p1:[^\\.]*}/{p2:[^\\.]*}")
    public String spa2() { return "forward:/index.html"; }

    // /any/deeper/route  (safety net)
    @GetMapping("/{p1:[^\\.]*}/{p2:[^\\.]*}/{p3:[^\\.]*}")
    public String spa3() { return "forward:/index.html"; }
}
