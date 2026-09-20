import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createCategory, updateCategory, getAllCategories, deleteCategory, reorderCategories } from '../../api/categoryApi';
import { Trash2, Plus, Edit2, Save, X, GripVertical } from 'lucide-react';
import IconPicker from '../../components/admin/IconPicker';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@arkn/react-icon-picker';

const SortableCategoryRow = ({ category, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr ref={setNodeRef} style={style} className="border-b border-border dark:border-white/10 hover:bg-bg-band dark:hover:bg-white/5 bg-bg-surface dark:bg-bg-dark">
            <td className="px-4 py-3 whitespace-nowrap w-10">
                <div {...attributes} {...listeners} className="cursor-grab text-text-secondary hover:text-primary">
                    <GripVertical size={20} />
                </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    {category.iconName ? (
                        <div className="p-2 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                            <Icon data={category.iconName} size={20} />
                        </div>
                    ) : (
                        <div className="w-9 h-9 rounded-md bg-bg-band dark:bg-white/10" />
                    )}
                    <div>
                        <div className="font-medium text-text-primary dark:text-text-onDark">{category.name}</div>
                        <div className="text-xs text-text-secondary">{category.slug}</div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">
                {category.description}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${category.active ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'}`}>
                    {category.active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onEdit(category)}
                    className="text-primary hover:text-primary-hover mr-3"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => onDelete(category.id)}
                    className="text-status-error hover:text-red-400"
                >
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
};

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        iconName: '',
        active: true
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            // Sort them by displayOrder client side just in case
            const sorted = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            setCategories(sorted);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = categories.findIndex((c) => c.id === active.id);
            const newIndex = categories.findIndex((c) => c.id === over.id);

            const newArr = arrayMove(categories, oldIndex, newIndex);
            setCategories(newArr);

            // Save new order to backend
            const orderRequests = newArr.map((cat, index) => ({
                id: cat.id,
                displayOrder: index
            }));

            try {
                await reorderCategories(orderRequests);
            } catch (error) {
                Swal.fire('Error', 'Failed to save new order', 'error');
            }
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingId(category.id);
            setFormData({
                name: category.name,
                description: category.description || '',
                iconName: category.iconName || '',
                active: category.active
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                description: '',
                iconName: '',
                active: true
            });
        }
        setFieldErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.iconName) {
            Swal.fire('Error', 'Please provide both name and an icon.', 'error');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                displayOrder: editingId ? categories.find(c => c.id === editingId).displayOrder : categories.length
            };

            if (editingId) {
                await updateCategory(editingId, payload);
                Swal.fire('Success', 'Category updated successfully!', 'success');
            } else {
                await createCategory(payload);
                Swal.fire('Success', 'Category created successfully!', 'success');
            }
            
            closeModal();
            fetchCategories();
        } catch (error) {
            if (error.fieldErrors) {
                const errMap = {};
                error.fieldErrors.forEach(err => errMap[err.field] = err.message);
                setFieldErrors(errMap);
            }
            Swal.fire('Error', error.message || 'Failed to save category', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will soft-delete the category. Active products linked to it might prevent deletion.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCategory(id);
                    Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                    fetchCategories();
                } catch (error) {
                    Swal.fire('Error', error.message || 'Failed to delete category', 'error');
                }
            }
        });
    };

    return (
        <div className="p-6 text-text-primary dark:text-text-onDark">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Categories</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-bg-surface dark:bg-bg-dark rounded-lg shadow-sm border border-border dark:border-white/10 overflow-hidden">
                <table className="min-w-full divide-y divide-border dark:divide-white/10">
                    <thead className="bg-bg-page dark:bg-black/30">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Drag</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-white/10 bg-bg-surface dark:bg-bg-dark">
                        <DndContext 
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext 
                                items={categories.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {categories.map((category) => (
                                    <SortableCategoryRow
                                        key={category.id}
                                        category={category}
                                        onEdit={openModal}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                        {categories.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-text-secondary">
                                    No categories found. Click "Add Category" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-bg-surface dark:bg-bg-dark w-full max-w-md rounded-lg shadow-xl border border-border dark:border-white/10 overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-border dark:border-white/10">
                            <h3 className="text-lg font-semibold">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                            <button onClick={closeModal} className="text-text-secondary hover:text-text-primary p-1">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-border dark:border-white/10 bg-bg-page dark:bg-black/50 text-text-primary dark:text-text-onDark p-2 focus:ring-1 focus:ring-primary focus:border-primary"
                                    placeholder="e.g. Sarees"
                                    required
                                />
                                {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-border dark:border-white/10 bg-bg-page dark:bg-black/50 text-text-primary dark:text-text-onDark p-2 focus:ring-1 focus:ring-primary focus:border-primary"
                                    placeholder="Short description"
                                    rows="3"
                                />
                                {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Category Icon</label>
                                <IconPicker 
                                    selectedIcon={formData.iconName}
                                    onSelectIcon={(iconName) => {
                                        setFormData(prev => ({...prev, iconName}));
                                        if (fieldErrors.iconName) setFieldErrors({...fieldErrors, iconName: null});
                                    }} 
                                />
                                {fieldErrors.iconName && <p className="text-red-500 text-xs mt-1">{fieldErrors.iconName}</p>}
                            </div>

                            <div className="flex items-center mt-4">
                                <input
                                    type="checkbox"
                                    id="active"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border dark:border-white/10 rounded"
                                />
                                <label htmlFor="active" className="ml-2 block text-sm text-text-primary dark:text-text-onDark">
                                    Is Active
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-border dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-md border border-border dark:border-white/10 text-text-secondary hover:bg-bg-page dark:hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : <><Save size={16} /> Save</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
