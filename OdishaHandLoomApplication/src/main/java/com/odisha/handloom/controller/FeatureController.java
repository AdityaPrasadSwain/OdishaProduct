package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Feature;
import com.odisha.handloom.repository.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/features")
public class FeatureController {

    @Autowired
    private FeatureRepository featureRepository;

    @GetMapping
    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Feature> addFeature(@RequestBody Feature feature) {
        return ResponseEntity.ok(featureRepository.save(feature));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFeature(@PathVariable UUID id) {
        featureRepository.deleteById(id);
        return ResponseEntity.ok("Feature deleted");
    }
}
