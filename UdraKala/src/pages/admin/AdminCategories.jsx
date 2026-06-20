import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createCategory, getAllCategories, deleteCategory } from '../../api/categoryApi';
import { Trash2, Plus, Upload, X } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        image: null,
        imagePreview: null,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                Swal.fire('Error', 'Please upload an image file.', 'error');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire('Error', 'Image size should be less than 5MB.', 'error');
                return;
            }

            setNewCategory({
                ...newCategory,
                image: file,
                imagePreview: URL.createObjectURL(file),
            });
        }
    };

    const removeImage = () => {
        setNewCategory({ ...newCategory, image: null, imagePreview: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newCategory.name || !newCategory.image) {
            Swal.fire('Error', 'Please provide both name and image.', 'error');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', newCategory.name);
            formData.append('description', newCategory.description);
            formData.append('image', newCategory.image);

            await createCategory(formData);

            Swal.fire('Success', 'Category created successfully!', 'success');
            setNewCategory({ name: '', description: '', image: null, imagePreview: null });
            fetchCategories();
        } catch (error) {
            Swal.fire('Error', error.message || 'Failed to create category', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
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
            <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

            {/* Add New Category Form */}
            <div className="bg-bg-surface dark:bg-bg-dark p-6 rounded-lg shadow-sm dark:shadow-md dark:shadow-black/40 mb-8 border border-border dark:border-transparent">
                <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary">Category Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newCategory.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-border dark:border-white/10 bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="e.g. Sarees"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={newCategory.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-border dark:border-white/10 bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="Short description"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Category Image</label>
                        {!newCategory.imagePreview ? (
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-border dark:border-white/10 border-dashed rounded-md cursor-pointer hover:border-primary dark:hover:border-primary transition-colors bg-bg-page dark:bg-bg-dark/30">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-text-secondary dark:text-text-secondary" />
                                    <div className="flex text-sm text-text-secondary dark:text-text-secondary justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary dark:text-primary hover:text-primary dark:hover:text-primary focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-text-secondary dark:text-text-secondary">PNG, JPG, GIF up to 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative inline-block">
                                <img src={newCategory.imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-md border dark:border-transparent" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-status-error text-text-onDark rounded-full p-1 hover:bg-status-error shadow-md"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-text-onDark bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Saving...' : <><Plus size={16} className="mr-2" /> Add Category</>}
                    </button>
                </form>
            </div>

            {/* Categories List */}
            <h3 className="text-lg font-semibold mb-4">Existing Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-bg-surface dark:bg-bg-dark rounded-lg shadow-sm dark:shadow-md dark:shadow-black/40 border border-border dark:border-transparent p-4 flex flex-col hover:shadow-md transition-shadow">
                        <div className="h-40 w-full mb-4 bg-bg-band dark:bg-bg-dark rounded-md overflow-hidden relative">
                            {cat.imageUrl ? (
                                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-secondary dark:text-text-secondary">No Image</div>
                            )}
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="font-bold text-lg text-text-primary dark:text-text-onDark truncate">{cat.name}</h4>
                                <p className="text-text-secondary dark:text-text-secondary text-sm line-clamp-2">{cat.description}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-status-error hover:text-status-error dark:hover:text-red-400 p-1"
                                title="Delete Category"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && !loading && (
                    <div className="col-span-full text-center text-text-secondary dark:text-text-secondary py-10">No categories found. Add one above!</div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
