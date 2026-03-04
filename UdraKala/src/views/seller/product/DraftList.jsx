import React, { useEffect, useState } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton, Paper, Button } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import { getDrafts } from '../../../api/productWizardApi';
import { useNavigate } from 'react-router';

const DraftList = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = async () => {
        try {
            const data = await getDrafts();
            setDrafts(data);
        } catch (error) {
            console.error("Failed to load drafts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/seller/products/edit/${id}`);
    };

    return (
        <DashboardCard title="Draft Products">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#94A3B8" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                    Product Name
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#94A3B8" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                    Price
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#94A3B8" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                    Category
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#94A3B8" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                    Status
                                </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#94A3B8" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                    Actions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {drafts.map((product) => (
                            <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: 'rgba(123, 97, 255, 0.05)' }, transition: 'background-color 0.2s ease' }}>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Typography variant="subtitle1" fontWeight={600} color="#F8FAFC">
                                        {product.name}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Typography color="#CBD5E1" variant="subtitle2" fontWeight={600}>
                                        ₹{product.price}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Typography color="#CBD5E1" variant="subtitle2" fontWeight={400}>
                                        {product.category ? product.category.name : 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Chip
                                        sx={{
                                            bgcolor: 'rgba(245, 158, 11, 0.15)',
                                            color: '#F59E0B',
                                            borderRadius: '6px',
                                            fontWeight: 700,
                                        }}
                                        size="small"
                                        label="DRAFT"
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEdit(product.id)}
                                        sx={{ borderRadius: '6px', px: 2 }}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {drafts.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body1" sx={{ py: 3 }}>
                                        No drafts found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default DraftList;
