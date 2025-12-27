---
description: Implement Seller Registration and Admin Verification System
---

1.  **Define Data Model**
    -   Update `User` entity with `RegistrationStatus` enum.
    -   Create `SellerDocuments` entity for PAN, Aadhaar, GST.
    -   Create `SellerBankDetails` entity for account info.
    -   Create `AdminActionLog` and `SellerNote` for audit trails.

2.  **Create Repositories**
    -   `SellerDocumentsRepository`
    -   `SellerBankDetailsRepository`
    -   `AdminActionLogRepository`
    -   `SellerNoteRepository`

3.  **Implement Backend Logic**
    -   Create `SellerRegistrationController` with endpoints:
        -   `/api/sellers/register/basic` (Step 1)
        -   `/api/sellers/register/documents` (Step 2)
        -   `/api/sellers/register/bank` (Step 3)
    -   Create `AdminSellerVerificationController` with endpoints:
        -   `/api/admin/sellers` (List)
        -   `/api/admin/sellers/{id}` (Details)
        -   Verify/Reject/Approve/Suspend endpoints.

4.  **Implement Frontend (Seller Side)**
    -   Create `SellerRegistrationWizard` (State manager).
    -   Create Step components: `Step1BasicDetails`, `Step2Documents`, `Step3BankDetails`.
    -   Add route `/register/seller`.

5.  **Implement Frontend (Admin Side)**
    -   Create `AdminSellersList` for overview.
    -   Create `AdminSellerDetails` for verification actions.
    -   Add protected routes `/admin/sellers` and `/admin/sellers/:id`.

6.  **Verify & Build**
    -   Compile backend (`mvn clean compile`).
    -   Restart application.
    -   Test registration flow.
    -   Test admin verification flow.
