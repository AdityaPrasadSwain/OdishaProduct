import React, { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';

const AuthRegister = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'BUYER', // Default to BUYER
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async () => {
        setError('');
        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('phoneNumber', formData.phoneNumber);
            data.append('role', formData.role);

            // Using fetch to call the API Gateway directly
            const API_BASE_URL = "http://localhost:8085/api/auth/signup";

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                body: data, // Content-Type header is automatically set for FormData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Registration failed');
            }

            // Success
            navigate('/auth/login');
        } catch (err) {
            console.error(err);
            setError(err.message || 'A network error occurred');
        }
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='fullName' mb="5px" color="#CBD5E1">Name</Typography>
                    <CustomTextField id="fullName" variant="outlined" fullWidth value={formData.fullName} onChange={handleChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px" color="#CBD5E1">Email Address</Typography>
                    <CustomTextField id="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='phoneNumber' mb="5px" mt="25px" color="#CBD5E1">Phone Number</Typography>
                    <CustomTextField id="phoneNumber" variant="outlined" fullWidth value={formData.phoneNumber} onChange={handleChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px" color="#CBD5E1">Password</Typography>
                    <CustomTextField id="password" type="password" variant="outlined" fullWidth value={formData.password} onChange={handleChange} />
                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth onClick={handleSubmit} sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700 }}>
                    Sign Up
                </Button>
            </Box>
            {subtitle}
        </>
    );
};

export default AuthRegister;
