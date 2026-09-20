import React, { useState, useMemo } from 'react';
import { GlassTableWrapper, GlassThead, GlassTh, GlassTbody, GlassTr, GlassTd } from './GlassTable';
import Pagination from './Pagination';

const DataTable = ({ rows = [], columns = [], pageSize = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState(null);

    const handleSort = (field) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.field === field && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ field, direction });
    };

    const sortedRows = useMemo(() => {
        let sortableItems = [...rows];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const column = columns.find(c => c.field === sortConfig.field);
                
                // Use valueGetter if it exists for this column
                const valA = column && column.valueGetter ? column.valueGetter(null, a) : a[sortConfig.field];
                const valB = column && column.valueGetter ? column.valueGetter(null, b) : b[sortConfig.field];

                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [rows, sortConfig, columns]);

    const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
    const paginatedRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="w-full">
            <GlassTableWrapper>
                <GlassThead>
                    {columns.map((col) => (
                        !col.hide && (
                            <GlassTh 
                                key={col.field}
                                sortable={col.sortable !== false}
                                sortDirection={sortConfig?.field === col.field ? sortConfig.direction : null}
                                onClick={() => col.sortable !== false && handleSort(col.field)}
                                className={col.flex ? 'w-full' : ''}
                            >
                                {col.headerName}
                            </GlassTh>
                        )
                    ))}
                </GlassThead>
                <GlassTbody>
                    {paginatedRows.length > 0 ? (
                        paginatedRows.map((row, index) => (
                            <GlassTr key={row.id || index} index={index}>
                                {columns.map((col) => (
                                    !col.hide && (
                                        <GlassTd key={col.field} className={col.flex ? 'w-full' : ''}>
                                            {col.renderCell ? col.renderCell({ row, value: row[col.field] }) 
                                              : col.valueGetter ? col.valueGetter(null, row) 
                                              : row[col.field]}
                                        </GlassTd>
                                    )
                                ))}
                            </GlassTr>
                        ))
                    ) : (
                        <GlassTr>
                            <GlassTd className="text-center py-8" colSpan={columns.filter(c => !c.hide).length}>
                                No data available
                            </GlassTd>
                        </GlassTr>
                    )}
                </GlassTbody>
            </GlassTableWrapper>
            
            {totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default DataTable;
