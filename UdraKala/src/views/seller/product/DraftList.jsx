import React, { useEffect, useState } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton, Paper, Button } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import { getDrafts } from '../../../api/productWizardApi';
import { useNavigate } from 'react-router';
import { 
    GlassTableWrapper, 
    GlassThead, 
    GlassTh, 
    GlassTbody, 
    GlassTr, 
    GlassTd, 
    GlassBadge 
} from '../../../components/ui/GlassTable';

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
            <Box sx={{ overflow: 'auto', width: '100%', mt: 2 }}>
                <GlassTableWrapper>
                    <GlassThead>
                        <GlassTh>Product Name</GlassTh>
                        <GlassTh>Price</GlassTh>
                        <GlassTh>Category</GlassTh>
                        <GlassTh>Status</GlassTh>
                        <GlassTh className="text-right">Actions</GlassTh>
                    </GlassThead>
                    <GlassTbody>
                        {drafts.map((product, index) => (
                            <GlassTr key={product.id} index={index}>
                                <GlassTd className="font-medium text-text-primary dark:text-white">
                                    {product.name}
                                </GlassTd>
                                <GlassTd className="font-medium text-text-primary dark:text-white/90">
                                    ₹{product.price}
                                </GlassTd>
                                <GlassTd className="text-text-secondary dark:text-white/80">
                                    {product.category ? product.category.name : 'N/A'}
                                </GlassTd>
                                <GlassTd>
                                    <GlassBadge variant="warning">
                                        DRAFT
                                    </GlassBadge>
                                </GlassTd>
                                <GlassTd className="text-right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEdit(product.id)}
                                        sx={{ borderRadius: '6px', px: 2, textTransform: 'none' }}
                                    >
                                        Edit
                                    </Button>
                                </GlassTd>
                            </GlassTr>
                        ))}
                        {drafts.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-text-secondary dark:text-white/60">
                                    No drafts found.
                                </td>
                            </tr>
                        )}
                    </GlassTbody>
                </GlassTableWrapper>
            </Box>
        </DashboardCard>
    );
};

export default DraftList;
