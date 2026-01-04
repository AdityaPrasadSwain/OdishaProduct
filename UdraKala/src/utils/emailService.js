import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

// Credentials
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_placeholder';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_placeholder';

// Templates
const TEMPLATE_ID_CUSTOMER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER || 'template_customer_placeholder';
const TEMPLATE_ID_SELLER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_SELLER || 'template_seller_placeholder';
const TEMPLATE_ID_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN || 'template_admin_placeholder';

export const initEmailjs = () => {
    emailjs.init(PUBLIC_KEY);
};

// --- Helpers ---

// 1. Strict Email Validation
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// 2. Rate Limiting (30s cooldown)
const checkRateLimit = () => {
    const lastSent = localStorage.getItem('emailLastSent');
    const now = Date.now();
    const COOLDOWN = 30000; // 30 seconds

    if (lastSent && (now - parseInt(lastSent)) < COOLDOWN) {
        const remaining = Math.ceil((COOLDOWN - (now - parseInt(lastSent))) / 1000);
        return { allowed: false, remaining };
    }
    return { allowed: true };
};

// 3. Centralized Wrapper
const sendEmailWrapper = async (templateId, params, recipientEmail = null) => {
    // A. Network Check
    if (!navigator.onLine) {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'No Internet',
            text: 'No internet connection. Please check your network.',
            confirmButtonColor: '#ea580c',
            showCancelButton: true,
            confirmButtonText: 'Retry',
            cancelButtonText: 'Close'
        });

        if (result.isConfirmed) {
            return sendEmailWrapper(templateId, params, recipientEmail);
        }
        return { success: false, error: 'OFFLINE' };
    }

    // B. Rate Limit Check
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
        await Swal.fire({
            icon: 'info',
            title: 'Please Wait',
            text: `Please wait ${rateLimit.remaining} seconds before sending another email.`,
            timer: 3000,
            showConfirmButton: false
        });
        return { success: false, error: 'RATE_LIMIT' };
    }

    // C. Validation Check (if recipient provided)
    if (recipientEmail && !validateEmail(recipientEmail)) {
        await Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Email address does not exist or is invalid. Please check and try again.',
            confirmButtonColor: '#ea580c'
        });
        return { success: false, error: 'INVALID_EMAIL' };
    }

    // D. Attempt Send
    try {
        // Record timestamp BEFORE send to prevent double-click spam logic ideally, 
        // but here we record on success or attempt start? 
        // Better to record start to enforce rate limit immediately.
        localStorage.setItem('emailLastSent', Date.now().toString());

        const response = await emailjs.send(SERVICE_ID, templateId, params, PUBLIC_KEY);
        console.log("Email Sent Successfully:", response.status, response.text);
        return { success: true, response };

    } catch (error) {
        console.error("EmailJS Error:", error);

        // Analyze Error
        let uiMessage = "Email sending failed. Please try again later.";
        let isConfigError = false;

        if (error.text?.includes("template_params") || error.status === 400) {
            uiMessage = "Email configuration error. Please contact support.";
            isConfigError = true;
        }

        const swalOptions = {
            icon: 'error',
            title: 'Email Failed',
            text: uiMessage,
            confirmButtonColor: '#ea580c'
        };

        // Allow Retry for non-config errors
        if (!isConfigError) {
            swalOptions.showCancelButton = true;
            swalOptions.confirmButtonText = 'Retry';
            swalOptions.cancelButtonText = 'Close';
        }

        const result = await Swal.fire(swalOptions);

        if (!isConfigError && result.isConfirmed) {
            return sendEmailWrapper(templateId, params, recipientEmail);
        }

        return { success: false, error: error };
    }
};

// --- Exported Functions (Wrapped) ---

export const sendWelcomeEmail = async (userEmail, userName) => {
    const templateParams = {
        to_email: userEmail,
        to_name: userName,
        subject: 'Welcome to UdraKala!',
        message: 'Thank you for registering with UdraKala. We are excited to have you on board.',
    };
    return await sendEmailWrapper(TEMPLATE_ID_CUSTOMER, templateParams, userEmail);
};

export const sendOrderEmail = async (customerEmail, customerName, orderId, totalAmount) => {
    const templateParams = {
        to_email: customerEmail,
        to_name: customerName,
        order_id: orderId,
        total_amount: totalAmount,
        subject: `Order Confirmation #${orderId}`,
        message: `Your order #${orderId} has been placed successfully. Total: ₹${totalAmount}`,
    };
    return await sendEmailWrapper(TEMPLATE_ID_CUSTOMER, templateParams, customerEmail);
};

export const sendStatusUpdateEmail = async (customerEmail, customerName, orderId, newStatus, courier, trackingId) => {
    const templateParams = {
        to_email: customerEmail,
        email: customerEmail,        // Fallback 1
        user_email: customerEmail,   // Fallback 2
        recipient: customerEmail,    // Fallback 3
        to_name: customerName,
        order_id: orderId,
        status: newStatus,
        courier_name: courier || 'N/A',
        tracking_id: trackingId || 'N/A',
        subject: `Update on Order #${orderId}: ${newStatus}`,
        message: `Your order #${orderId} status has been updated to ${newStatus}.`,
    };
    console.log("Sending Email Payload:", templateParams);
    return await sendEmailWrapper(TEMPLATE_ID_CUSTOMER, templateParams, customerEmail);
};

export const sendReturnRequestEmail = async (adminEmail, orderId, reason) => {
    const templateParams = {
        to_email: adminEmail, // Admin email for validation
        order_id: orderId,
        reason: reason,
        subject: `Return Request for Order #${orderId}`,
        message: `A return has been requested for Order #${orderId}. Reason: ${reason}`,
    };
    return await sendEmailWrapper(TEMPLATE_ID_ADMIN, templateParams, adminEmail);
};

export const sendAdminNotification = async (sellerName, sellerEmail) => {
    const templateParams = {
        seller_name: sellerName,
        seller_email: sellerEmail,
        subject: 'New Seller Registration',
        message: `A new seller ${sellerName} (${sellerEmail}) has registered and is pending approval.`,
    };
    return await sendEmailWrapper(TEMPLATE_ID_ADMIN, templateParams, null);
};

export const sendSellerOrderNotification = async (sellerEmail, sellerName, orderId, items) => {
    const itemsList = items.map(i => `${i.name} (Qty: ${i.quantity})`).join(', ');
    const templateParams = {
        to_email: sellerEmail,
        seller_name: sellerName,
        order_id: orderId,
        items_list: itemsList,
        subject: `New Order Received #${orderId}`,
        message: `You have received a new order #${orderId} for the following items: ${itemsList}.`,
    };
    return await sendEmailWrapper(TEMPLATE_ID_SELLER, templateParams, sellerEmail);
};

export const sendSellerApprovalEmail = async (sellerEmail, sellerName) => {
    const templateParams = {
        to_email: sellerEmail,
        to_name: sellerName,
        subject: 'Seller Account Approved',
        message: `Congratulations! Your seller account has been approved. You can now log in and start selling.`,
    };
    return await sendEmailWrapper(TEMPLATE_ID_SELLER, templateParams, sellerEmail);
};

export const sendReturnUpdateEmail = async (customerEmail, customerName, orderId, status, remarks) => {
    const templateParams = {
        to_email: customerEmail,
        to_name: customerName,
        order_id: orderId,
        status: status,
        remarks: remarks || 'No remarks',
        subject: `Return Request ${status} for Order #${orderId}`,
        message: `Your return request for Order #${orderId} has been ${status}. Remarks: ${remarks || 'None'}`,
    };
    return await sendEmailWrapper(TEMPLATE_ID_CUSTOMER, templateParams, customerEmail);
};
