package com.odisha.handloom.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

/**
 * Controller to handle Agents requests.
 * Currently returning empty lists as the Delivery Agent system has been
 * removed.
 * Kept to prevent frontend "NoResourceFoundException".
 */
@RestController
@RequestMapping("/api/admin/agents")
public class AdminAgentController {

    @GetMapping
    public ResponseEntity<List<?>> getAllAgents() {
        return ResponseEntity.ok(Collections.emptyList());
    }
}
