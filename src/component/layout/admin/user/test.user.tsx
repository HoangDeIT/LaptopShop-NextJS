import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { useDemoData } from '@mui/x-data-grid-generator';

export default function PaginationCommunityNoSnap() {
    const { data, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 500,
        maxColumns: 6,
    });
    console.log(data)
    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid {...data} loading={loading} slots={{ toolbar: GridToolbar }} />
        </div>
    );
}