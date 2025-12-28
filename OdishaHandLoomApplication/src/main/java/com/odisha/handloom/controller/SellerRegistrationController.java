package com.odisha.handloom.controller;

import com.odisha.handloom.entity.*;
import com.odisha.handloom.payload.request.SellerBankDetailsRequest;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.repository.SellerBankDetailsRepository;
import com.odisha.handloom.repository.SellerDocumentsRepository;
import com.odisha.handloom.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sellers/register")
public class SellerRegistrationController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SellerDocumentsRepository docsRepository;

    @Autowired
    SellerBankDetailsRepository bankRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    com.odisha.handloom.service.CloudinaryService cloudinaryService;

    // Removed local file storage initialization

    @PostMapping("/basic")
    public ResponseEntity<?> registerBasicDetails(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("password") String password,
            @RequestParam("businessName") String businessName,
            @RequestParam(value = "role", defaultValue = "SELLER") String roleStr,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        if (userRepository.existsByPhoneNumber(phone)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone number is already in use!"));
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhoneNumber(phone);
        user.setPassword(encoder.encode(password));
        user.setShopName(businessName);
        user.setRole(Role.SELLER);
        user.setRegistrationStatus(RegistrationStatus.PENDING_DOCS);
        user.setApproved(false);

        // Handle Profile Image
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                // Save initially without ID, then update? Or generate UUID first?
                // User ID is generated on save.
                // We can save user first, then update image path.
                user = userRepository.save(user); // Save to get ID

                // Save to Cloudinary
                String imageUrl = cloudinaryService.uploadImage(profileImage, "sellers/profiles");
                user.setProfilePictureUrl(imageUrl);
                userRepository.save(user); // Update with image path

                return ResponseEntity.ok(new MessageResponse("User registered successfully. Status: PENDING_DOCS"));
            } catch (IOException e) {
                // If image fails, should we rollback user?
                // For now, log and return error, or just continue with warning?
                // Let's continue but warn.
                System.err.println("Failed to upload profile image: " + e.getMessage());
                // We already saved the user, so technically success but image missing.
                // Return OK to allow flow to proceed.
                return ResponseEntity
                        .ok(new MessageResponse("User registered (Image upload failed). Status: PENDING_DOCS"));
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully. Status: PENDING_DOCS"));
    }

    @PostMapping("/documents")
    public ResponseEntity<?> uploadDocuments(
            @RequestParam("panNumber") String panNumber,
            @RequestParam("aadhaarNumber") String aadhaarNumber,
            @RequestParam("gstNumber") String gstNumber,
            @RequestParam("panFile") MultipartFile panFile,
            @RequestParam("aadhaarFile") MultipartFile aadhaarFile,
            @RequestParam("gstFile") MultipartFile gstFile,
            @RequestParam(value = "email", required = false) String emailParam,
            Authentication authentication) {

        String email = null;

        if (authentication != null) {
            email = authentication.getName();
        } else if (emailParam != null && !emailParam.isEmpty()) {
            email = emailParam;
        } else {
            return ResponseEntity.status(401)
                    .body(new MessageResponse("Unauthorized. Please login or provide email to continue."));
        }

        String finalEmail = email; // for lambda
        User user = userRepository.findByEmail(finalEmail).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRegistrationStatus() != RegistrationStatus.PENDING_DOCS
                && user.getRegistrationStatus() != RegistrationStatus.PENDING_BANK) {
            // Allow re-upload
        }

        try {
            // Upload to Cloudinary
            String panPath = cloudinaryService.uploadFile(panFile, "sellers/docs/" + user.getId());
            String aadhaarPath = cloudinaryService.uploadFile(aadhaarFile, "sellers/docs/" + user.getId());
            String gstPath = cloudinaryService.uploadFile(gstFile, "sellers/docs/" + user.getId());

            SellerDocuments docs = docsRepository.findBySeller(user).orElse(new SellerDocuments());
            docs.setSeller(user);
            docs.setPanNumber(panNumber);
            docs.setAadhaarNumber(aadhaarNumber);
            docs.setGstNumber(gstNumber);
            docs.setPanFileUrl(panPath);
            docs.setAadhaarFileUrl(aadhaarPath);
            docs.setGstFileUrl(gstPath);

            docsRepository.save(docs);

            // Sync GST to User table for easier access
            user.setGstNumber(gstNumber);
            user.setRegistrationStatus(RegistrationStatus.PENDING_BANK);
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Documents uploaded. Status: PENDING_BANK"));

        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Failed to upload files"));
        }
    }

    @PostMapping("/bank")
    public ResponseEntity<?> registerBankDetails(@Valid @RequestBody SellerBankDetailsRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized."));
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        SellerBankDetails bank = bankRepository.findBySeller(user).orElse(new SellerBankDetails());
        bank.setSeller(user);
        bank.setAccountHolderName(request.getAccountHolderName());
        bank.setAccountNumber(request.getAccountNumber());
        bank.setIfscCode(request.getIfscCode());
        bank.setBankName(request.getBankName());

        bankRepository.save(bank);

        // Sync to User table
        user.setAccountHolderName(request.getAccountHolderName());
        user.setBankAccountNumber(request.getAccountNumber());
        user.setIfscCode(request.getIfscCode());
        user.setBankName(request.getBankName());
        user.setRegistrationStatus(RegistrationStatus.COMPLETED);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Bank details saved. Registration COMPLETED."));
    }

    @PostMapping("/full-register")
    public ResponseEntity<?> registerFullSeller(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("password") String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,

            @RequestParam("businessName") String businessName,
            @RequestParam("businessType") String businessType,
            @RequestParam("address") String address,
            @RequestParam("state") String state,
            @RequestParam("city") String city,
            @RequestParam("pincode") String pincode,

            @RequestParam("panNumber") String panNumber,
            @RequestParam("aadhaarNumber") String aadhaarNumber,
            @RequestParam("gstNumber") String gstNumber,

            @RequestParam("panFile") MultipartFile panFile,
            @RequestParam("aadhaarFile") MultipartFile aadhaarFile,
            @RequestParam(value = "gstFile", required = false) MultipartFile gstFile,

            @RequestParam("accountHolderName") String accountHolderName,
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("ifscCode") String ifscCode,
            @RequestParam("bankName") String bankName) {

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        if (userRepository.existsByPhoneNumber(phone)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone number is already in use!"));
        }

        try {
            // 1. Create User (Basic Details)
            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPhoneNumber(phone);
            user.setPassword(encoder.encode(password));
            user.setRole(Role.SELLER);
            user.setRegistrationStatus(RegistrationStatus.PENDING_VERIFICATION);
            user.setApproved(false);

            // Step 2 Business Details
            user.setShopName(businessName);
            user.setBusinessType(businessType);
            user.setAddress(address);
            user.setState(state);
            user.setCity(city);
            user.setPincode(pincode);

            // Save initially to get ID
            user = userRepository.save(user);

            // Step 1 Profile Image
            if (profileImage != null && !profileImage.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(profileImage, "sellers/profiles");
                user.setProfilePictureUrl(imageUrl);
            }

            // Step 3 Documents (Cloudinary)
            String panPath = cloudinaryService.uploadFile(panFile, "sellers/docs/" + user.getId());
            String aadhaarPath = cloudinaryService.uploadFile(aadhaarFile, "sellers/docs/" + user.getId());
            String gstPath = null;
            if (gstFile != null && !gstFile.isEmpty()) {
                gstPath = cloudinaryService.uploadFile(gstFile, "sellers/docs/" + user.getId());
            }

            SellerDocuments docs = new SellerDocuments();
            docs.setSeller(user);
            docs.setPanNumber(panNumber);
            docs.setAadhaarNumber(aadhaarNumber);
            docs.setGstNumber(gstNumber);
            docs.setPanFileUrl(panPath);
            docs.setAadhaarFileUrl(aadhaarPath);
            docs.setGstFileUrl(gstPath);
            docsRepository.save(docs);

            // Sync to User
            user.setGstNumber(gstNumber);
            user.setPanNumber(panNumber);

            // Step 3 Bank Details
            SellerBankDetails bank = new SellerBankDetails();
            bank.setSeller(user);
            bank.setAccountHolderName(accountHolderName);
            bank.setAccountNumber(accountNumber);
            bank.setIfscCode(ifscCode);
            bank.setBankName(bankName);
            bankRepository.save(bank);

            // Sync to User
            user.setAccountHolderName(accountHolderName);
            user.setBankAccountNumber(accountNumber);
            user.setIfscCode(ifscCode);
            user.setBankName(bankName);
            user.setRegistrationStatus(RegistrationStatus.PENDING_VERIFICATION);

            userRepository.save(user);

            return ResponseEntity.ok(
                    new MessageResponse("Seller registration submitted successfully. Please wait for verification."));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error uploading files: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error during registration: " + e.getMessage()));
        }
    }

    // Keep existing methods but they might become obsolete or used for partial
    // updates
    // ...

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized."));
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new java.util.HashMap<String, String>() {
            {
                put("status", user.getRegistrationStatus() != null ? user.getRegistrationStatus().name() : "UNKNOWN");
            }
        });
    }

    // Local storeFile method removed in favor of CloudinaryService
}
