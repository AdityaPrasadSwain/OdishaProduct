import { useState, useEffect } from 'react';
import API from '../../api/api';
import Swal from 'sweetalert2';
import { validatePAN, validateAadhaar, validateGST, validateRequired } from '../../utils/validation';
import { Upload, FileText, X, Check } from 'lucide-react';

const FileUploadField = ({
    label,
    name,
    value,
    fileState,
    previewState,
    placeholder,
    maxLength,
    onChange,
    onFileChange,
    onRemove,
    error,
    fileError
}) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            maxLength={maxLength}
            onChange={onChange}
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none mb-3 ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={placeholder}
        />
        {error && <p className="text-red-500 text-xs -mt-2 mb-2">{error}</p>}

        <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${fileError ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-orange-400 bg-white'}`}>
            {fileState ? (
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {previewState && previewState !== 'PDF_ICON' ? (
                            <img src={previewState} alt="Preview" className="w-12 h-12 object-cover rounded" />
                        ) : (
                            <FileText className="text-orange-500 w-10 h-10" />
                        )}
                        <div className="text-sm overflow-hidden max-w-[150px]">
                            <p className="font-medium text-gray-700 truncate">{fileState.name}</p>
                            <p className="text-xs text-gray-500">{(fileState.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button type="button" onClick={onRemove} className="text-red-500 hover:bg-red-100 p-1.5 rounded-full">
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <label className="cursor-pointer flex flex-col items-center w-full">
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Click to upload document</span>
                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={onFileChange} />
                </label>
            )}
        </div>
        {fileError && <p className="text-red-500 text-xs mt-1 text-center">{fileError}</p>}
    </div>
);

const Step2Documents = ({ onNext }) => {
    const [formData, setFormData] = useState({
        panNumber: '',
        aadhaarNumber: '',
        gstNumber: ''
    });
    const [files, setFiles] = useState({
        panFile: null,
        aadhaarFile: null,
        gstFile: null
    });
    const [previews, setPreviews] = useState({
        panFile: null,
        aadhaarFile: null,
        gstFile: null
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('seller_reg_step2');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const upperValue = value.toUpperCase();
        setFormData(prev => ({ ...prev, [name]: upperValue }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        localStorage.setItem('seller_reg_step2', JSON.stringify({ ...formData, [name]: upperValue }));
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire('File too large', 'Max file size is 5MB.', 'error');
                return;
            }
            if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                Swal.fire('Invalid Format', 'Only PDF, JPEG, PNG allowed.', 'error');
                return;
            }

            setFiles(prev => ({ ...prev, [fieldName]: file }));
            setErrors(prev => ({ ...prev, [fieldName]: null }));

            if (file.type.startsWith('image/')) {
                setPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
            } else {
                setPreviews(prev => ({ ...prev, [fieldName]: 'PDF_ICON' }));
            }
        }
    };

    const removeFile = (fieldName) => {
        setFiles(prev => ({ ...prev, [fieldName]: null }));
        setPreviews(prev => ({ ...prev, [fieldName]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!validatePAN(formData.panNumber)) newErrors.panNumber = "Invalid PAN (Format: ABCDE1234F)";
        if (!validateAadhaar(formData.aadhaarNumber)) newErrors.aadhaarNumber = "Invalid Aadhaar (12 digits)";
        if (!validateGST(formData.gstNumber)) newErrors.gstNumber = "Invalid GST Number (15 chars)";

        if (!files.panFile) newErrors.panFile = "PAN document required";
        if (!files.aadhaarFile) newErrors.aadhaarFile = "Aadhaar document required";
        if (!files.gstFile) newErrors.gstFile = "GST document required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        Object.keys(files).forEach(key => data.append(key, files[key]));

        // Add Email explicitly for fallback identification
        const step1Data = localStorage.getItem('seller_reg_step1');
        if (step1Data) {
            const { email } = JSON.parse(step1Data);
            if (email) data.append('email', email);
        }

        try {
            await API.post('/sellers/register/documents', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                icon: 'success',
                title: 'Documents Uploaded',
                text: 'Moving to bank details...',
                timer: 1500,
                showConfirmButton: false
            });
            onNext();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: error.response?.data?.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Document Verification</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Please provide your legal business documents.</p>

            <div className="space-y-6">
                <FileUploadField
                    label="PAN Number"
                    name="panNumber"
                    value={formData.panNumber}
                    fileState={files.panFile}
                    previewState={previews.panFile}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    onChange={handleChange}
                    onFileChange={(e) => handleFileChange(e, 'panFile')}
                    onRemove={() => removeFile('panFile')}
                    error={errors.panNumber}
                    fileError={errors.panFile}
                />

                <FileUploadField
                    label="Aadhaar Number"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    fileState={files.aadhaarFile}
                    previewState={previews.aadhaarFile}
                    placeholder="123456789012"
                    maxLength={12}
                    onChange={handleChange}
                    onFileChange={(e) => handleFileChange(e, 'aadhaarFile')}
                    onRemove={() => removeFile('aadhaarFile')}
                    error={errors.aadhaarNumber}
                    fileError={errors.aadhaarFile}
                />

                <FileUploadField
                    label="GST Number"
                    name="gstNumber"
                    value={formData.gstNumber}
                    fileState={files.gstFile}
                    previewState={previews.gstFile}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                    onChange={handleChange}
                    onFileChange={(e) => handleFileChange(e, 'gstFile')}
                    onRemove={() => removeFile('gstFile')}
                    error={errors.gstNumber}
                    fileError={errors.gstFile}
                />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? 'Uploading Details...' : 'Submit Documents & Continue'}
            </button>
        </form>
    );
};

export default Step2Documents;
