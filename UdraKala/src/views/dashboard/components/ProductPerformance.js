import React, { useEffect, useState } from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Button
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import { getMyProducts } from '../../../api/productWizardApi';
import { useNavigate } from 'react-router';

const ProductPerformance = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getMyProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleEdit = (id) => {
        navigate(`/seller/products/edit/${id}`);
    };

    return (
        <DashboardCard title="Product List">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="products table"
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
                                    Stock
                                </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#94A3B8" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                    Action
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: '#94A3B8' }}>Loading...</TableCell>
                            </TableRow>
                        ) : products.map((product) => (
                            <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: 'rgba(123, 97, 255, 0.05)' }, transition: 'background-color 0.2s ease' }}>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Typography variant="subtitle1" fontWeight={600} color="#F8FAFC">
                                        {product.name}
                                    </Typography>
                                    <Typography color="textSecondary" variant="caption">
                                        #{product.id}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Typography variant="subtitle2" fontWeight={600} color="#F8FAFC">
                                        ₹{product.price}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Typography variant="subtitle2" fontWeight={400} color="#CBD5E1">
                                        {product.category ? product.category.name : 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Chip
                                        sx={{
                                            bgcolor: product.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' :
                                                product.status === 'DRAFT' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                            color: product.status === 'ACTIVE' ? '#10B981' :
                                                product.status === 'DRAFT' ? '#F59E0B' : '#EF4444',
                                            fontWeight: 700,
                                            borderRadius: '6px',
                                        }}
                                        size="small"
                                        label={product.status}
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Typography variant="h6" color="#F8FAFC">{product.stockQuantity || 0}</Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        onClick={() => handleEdit(product.id)}
                                        sx={{ borderRadius: '6px', fontSize: '0.75rem', px: 2 }}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!loading && products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No products found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
