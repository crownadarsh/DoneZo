package com.crown.DoneZo.controller;


import com.crown.DoneZo.dto.input.EditPasswordDto;
import com.crown.DoneZo.dto.output.UserProfileDto;
import com.crown.DoneZo.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;

//    Review and rating related endpoints
    @GetMapping("/profile")
    ResponseEntity<UserProfileDto>  getProfile(){
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PatchMapping("/update-password")
    ResponseEntity<String> updatePassword(@RequestBody EditPasswordDto editPasswordDto){

        return ResponseEntity.ok(userService.editPassword(editPasswordDto));
    }

    @PostMapping("/logout")
    ResponseEntity<String> logout(){
        return ResponseEntity.ok(userService.logout());
    }





}
