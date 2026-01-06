import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCoupons, deleteCoupon, toggleCouponStatus } from '../../../store/slices/couponSlice';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, Chip, Typography, Box } from '@mui/material';
import { Edit, Delete, Add, ToggleOn, ToggleOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminCouponList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { coupons, loading } = useSelector((state) => state.coupon);

    useEffect(() => {
        dispatch(fetchAllCoupons());
    }, [dispatch]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteCoupon(id));
                Swal.fire('Deleted!', 'Coupon has been deleted.', 'success');
            }
        });
    };

    const handleToggle = (id) => {
        dispatch(toggleCouponStatus(id));
    };

    const columns = [
        { field: 'code', headerName: 'Code', width: 150, renderCell: (params) => <strong>{params.value}</strong> },
        { field: 'discountType', headerName: 'Type', width: 120 },
        {
            field: 'discountValue',
            headerName: 'Value',
            width: 120,
            renderCell: (params) => params.row.discountType === 'PERCENTAGE' ? `${params.value}%` : `₹${params.value}`
        },
        {
            field: 'minOrderAmount',
            headerName: 'Min Order',
            width: 120,
            renderCell: (params) => {
                const val = params.value || 0;
                return `₹${val.toLocaleString()}`;
            }
        },
        {
            field: 'expiryDate',
            headerName: 'Expiry',
            width: 200,
            renderCell: (params) => {
                if (!params.value) return 'N/A';
                return new Date(params.value).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        },
        {
            field: 'usage',
            headerName: 'Usage',
            width: 150,
            renderCell: (params) => {
                const percent = (params.row.globalUsageCount / params.row.globalUsageLimit) * 100;
                return (
                    <Box sx={{ width: '100%' }}>
                        <Typography variant="body2">{params.row.globalUsageCount} / {params.row.globalUsageLimit}</Typography>
                    </Box>
                );
            }
        },
        {
            field: 'isActive',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Active' : 'Inactive'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box>
                    <IconButton color="primary" onClick={() => navigate(`/admin/coupons/edit/${params.row.id}`)}>
                        <Edit />
                    </IconButton>
                    <IconButton color={params.row.isActive ? 'success' : 'default'} onClick={() => handleToggle(params.row.id)}>
                        {params.row.isActive ? <ToggleOn /> : <ToggleOff />}
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                        <Delete />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Coupon Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/admin/coupons/create')}
                >
                    Create Coupon
                </Button>
            </Box>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={coupons}
                    columns={columns}
                    loading={loading}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                />
            </div>
        </Box>
    );
};

export default AdminCouponList;
