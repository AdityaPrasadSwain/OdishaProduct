import React from 'react';
import { motion } from 'motion/react';
import { VARIANTS } from '../../utils/animations';

const AdminTable = ({ columns, data, renderRow, emptyMessage = "No data available" }) => {
    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={`p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <motion.tbody
                    variants={VARIANTS.staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-gray-100 dark:divide-gray-700"
                >
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <motion.tr
                                key={item.id || index}
                                variants={VARIANTS.fadeInUp}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                                {renderRow(item)}
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </motion.tbody>
            </table>
        </div>
    );
};

export default AdminTable;
