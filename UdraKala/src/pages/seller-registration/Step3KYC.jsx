import React, { useState } from 'react';
import { useSellerRegistration } from '../../context/SellerRegistrationContext';
import { Upload, FileText, Check, X } from 'lucide-react';

const Step3KYC = ({ onNext, onPrev }) => {
    const { sellerData, updateSellerData } = useSellerRegistration();
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const upperVal = value.toUpperCase(); // Auto-uppercase IDs
        updateSellerData({ [name]: upperVal });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        updateSellerData({ [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : 'PDF_ICON';
            updateSellerData({
                [fieldName]: file,
                [fieldName.replace('File', 'Preview')]: preview
            });
            if (errors[fieldName]) setErrors({ ...errors, [fieldName]: null });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!sellerData.panNumber) newErrors.panNumber = "PAN is required";
        if (!sellerData.aadhaarNumber) newErrors.aadhaarNumber = "Aadhaar is required";

        // GST is Optional as per requirement
        // if (!sellerData.gstNumber) newErrors.gstNumber = "GST is required";

        if (!sellerData.panFile) newErrors.panFile = "PAN Document required";
        if (!sellerData.aadhaarFile) newErrors.aadhaarFile = "Aadhaar Document required";
        // GST File is optional if number is provided? Or strictly optional?
        // If GST Number is provided, File should probably represent it, but let's keep optional.

        if (!sellerData.bankAccountNo) newErrors.bankAccountNo = "Account No is required";
        if (!sellerData.ifscCode) newErrors.ifscCode = "IFSC is required";
        if (!sellerData.bankName) newErrors.bankName = "Bank Name is required";
        if (!sellerData.accountHolderName) newErrors.accountHolderName = "Account Holder Name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (validate()) {
            onNext();
        }
    };

    // Helper for File Input
    const FileUpload = ({ label, name, file, preview }) => (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
            <div className={`border-2 border-dashed rounded-lg p-3 flex items-center justify-between ${errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                {file ? (
                    <div className="flex items-center gap-2">
                        {preview === 'PDF_ICON' ? <FileText className="text-orange-500" /> : <img src={preview} alt="preview" className="w-8 h-8 object-cover rounded" />}
                        <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                        <button type="button" onClick={() => updateSellerData({ [name]: null, [name.replace('File', 'Preview')]: null })}><X size={16} className="text-red-500" /></button>
                    </div>
                ) : (
                    <label className="cursor-pointer flex items-center gap-2 text-gray-500 text-sm w-full">
                        <Upload size={16} /> Upload {label}
                        <input type="file" className="hidden" onChange={(e) => handleFileChange(e, name)} accept=".jpg,.jpeg,.png,.pdf" />
                    </label>
                )}
            </div>
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <form onSubmit={handleNext} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">KYC & Bank Details</h2>

            {/* IDs Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Identity Proofs</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600">PAN Number</label>
                        <input type="text" name="panNumber" value={sellerData.panNumber} onChange={handleChange} className="w-full p-2 border rounded" placeholder="ABCDE1234F" maxLength="10" />
                        {errors.panNumber && <p className="text-red-500 text-xs">{errors.panNumber}</p>}
                    </div>
                    <FileUpload label="PAN Card" name="panFile" file={sellerData.panFile} preview={sellerData.panPreview} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-600">Aadhaar Number</label>
                        <input type="text" name="aadhaarNumber" value={sellerData.aadhaarNumber} onChange={handleChange} className="w-full p-2 border rounded" placeholder="1234 5678 9012" maxLength="12" />
                        {errors.aadhaarNumber && <p className="text-red-500 text-xs">{errors.aadhaarNumber}</p>}
                    </div>
                    <FileUpload label="Aadhaar Card" name="aadhaarFile" file={sellerData.aadhaarFile} preview={sellerData.aadhaarPreview} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-600">GST Number (Optional)</label>
                        <input type="text" name="gstNumber" value={sellerData.gstNumber} onChange={handleChange} className="w-full p-2 border rounded" placeholder="22AAAAA0000A1Z5" maxLength="15" />
                    </div>
                    <FileUpload label="GST Cert (Optional)" name="gstFile" file={sellerData.gstFile} preview={sellerData.gstPreview} />
                </div>
            </div>

            {/* Bank Section */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="font-bold text-orange-800 mb-3 border-b border-orange-200 pb-2">Bank Details</h3>

                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-600">Account No</label>
                        <input type="text" name="bankAccountNo" value={sellerData.bankAccountNo} onChange={handleBankChange} className="w-full p-2 border rounded" />
                        {errors.bankAccountNo && <p className="text-red-500 text-xs">{errors.bankAccountNo}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600">IFSC Code</label>
                        <input type="text" name="ifscCode" value={sellerData.ifscCode} onChange={handleBankChange} className="w-full p-2 border rounded" placeholder="HDFC0001234" />
                        {errors.ifscCode && <p className="text-red-500 text-xs">{errors.ifscCode}</p>}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="block text-xs font-bold text-gray-600">Bank Name</label>
                    <input type="text" name="bankName" value={sellerData.bankName} onChange={handleBankChange} className="w-full p-2 border rounded" />
                    {errors.bankName && <p className="text-red-500 text-xs">{errors.bankName}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600">Account Holder Name</label>
                    <input type="text" name="accountHolderName" value={sellerData.accountHolderName} onChange={handleBankChange} className="w-full p-2 border rounded" />
                    {errors.accountHolderName && <p className="text-red-500 text-xs">{errors.accountHolderName}</p>}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onPrev}
                    className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="w-1/2 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition"
                >
                    Review & Submit
                </button>
            </div>
        </form>
    );
};

export default Step3KYC;
