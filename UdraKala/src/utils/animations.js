// Standard Animation Tokens for UdraKala

export const TRANSITION = {
    fast: { duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] },
    normal: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }, // Standard "Apple" ease
    slow: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    spring: { type: "spring", stiffness: 300, damping: 30 },
};

// Variants
export const VARIANTS = {
    // Basic Fades
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: TRANSITION.normal },
    },
    fadeInUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: TRANSITION.normal },
    },
    fadeInDown: {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: TRANSITION.normal },
    },

    // Scale
    scaleIn: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: TRANSITION.normal },
    },

    // Container Stagger
    staggerContainer: {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },

    // Smooth Page Transition
    page: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0, transition: TRANSITION.normal },
        exit: { opacity: 0, x: 20, transition: TRANSITION.fast },
    },
};

// Micro-interactions
export const INTERACTIONS = {
    hoverLift: {
        y: -5,
        transition: TRANSITION.fast,
    },
    hoverScale: {
        scale: 1.05,
        transition: TRANSITION.fast,
    },
    tapPress: {
        scale: 0.95,
        transition: { duration: 0.1 },
    },
};
