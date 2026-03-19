package com.vss.address_manager.controller;

import com.vss.address_manager.domain.user.UserService;
import com.vss.address_manager.domain.user.dto.UserCreateDto;
import com.vss.address_manager.domain.user.dto.UserResponseDto;
import com.vss.address_manager.domain.user.dto.UserUpdateDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    private UserService userService;

    @Autowired
    UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("user")
    public ResponseEntity<UserResponseDto> createUser(@RequestBody @Valid UserCreateDto userCreateDto, UriComponentsBuilder uriBuilder) throws InterruptedException {
        UserResponseDto dataResponse = userService.createUser(userCreateDto);
        var uri = uriBuilder.path("/user/{id}").buildAndExpand(dataResponse.id()).toUri();
        return ResponseEntity.created(uri).body(dataResponse);
    }

    @PutMapping("user/{id}")
    public ResponseEntity<UserResponseDto> updateUser(@RequestBody @Valid UserUpdateDto userUpdateDto, @PathVariable Long id){
        UserResponseDto dataResponse = userService.updateUser(userUpdateDto, id);
        return ResponseEntity.ok().body(dataResponse);
    }

    @DeleteMapping("user/{id}")
    public ResponseEntity deteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("user")
    public ResponseEntity<List<UserResponseDto>> getAllUser(){
        return ResponseEntity.ok().body(userService.getAllUser());
    }

    @GetMapping("user/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<UserResponseDto> getUserByCpf(@RequestParam String cpf) {
        return ResponseEntity.ok().body(userService.getUserByCPF(cpf));
    }

}
