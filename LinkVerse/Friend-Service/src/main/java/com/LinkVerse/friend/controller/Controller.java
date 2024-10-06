package com.LinkVerse.friend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

    @PostMapping("Hello")
    public String Hello(){
        return "Hello";
    }
}
