package com.ecommerce.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mongo")
@CrossOrigin(origins = "http://localhost:3000")
public class MongoTestController {

    @GetMapping("/ping")
    public String mongoTest() {
        return "MongoDB Atlas Connected Successfully!";
    }
}
