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
        <div className="p-6 text-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

            {/* Add New Category Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newCategory.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder="e.g. Sarees"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={newCategory.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder="Short description"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Image</label>
                        {!newCategory.imagePreview ? (
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors bg-gray-50 dark:bg-gray-700/30">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative inline-block">
                                <img src={newCategory.imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-md border dark:border-gray-600" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Saving...' : <><Plus size={16} className="mr-2" /> Add Category</>}
                    </button>
                </form>
            </div>

            {/* Categories List */}
            <h3 className="text-lg font-semibold mb-4">Existing Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col hover:shadow-md transition-shadow">
                        <div className="h-40 w-full mb-4 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden relative">
                            {cat.imageUrl ? (
                                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No Image</div>
                            )}
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate">{cat.name}</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{cat.description}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-red-500 hover:text-red-600 dark:hover:text-red-400 p-1"
                                title="Delete Category"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && !loading && (
                    <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">No categories found. Add one above!</div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
