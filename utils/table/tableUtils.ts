/**
 * Utility functions for table data processing
 * TODO: Add support for custom column renderers
 * TODO: Add sorting functionality
 * TODO: Add pagination support
 */

interface Column {
  label: string;
  metric: string;
}

interface Row {
  asset: {
    ticker: string;
  };
  data: Array<{
    value: string | number;
  }>;
}

interface ApiResponse {
  columns: Column[];
  rows: Row[];
}

/**
 * Creates table columns from API response
 * @param result - API response containing columns data
 * @returns Array of table column configurations
 */
export function createTableColumns(result: ApiResponse) {
  return result.columns.map((col: Column, index: number) => ({
    title: col.label,
    dataIndex: col.metric,
    key: col.metric,
    ...(index < 2 && {
      fixed: "left" as "left" | "right" | undefined,
      width: 100,
    }),
  }));
}

/**
 * Creates table data with role-based stock visibility
 * @param result - API response containing stock data
 * @param role - User role from Supabase (1 = public, 2 = free access, 3 = full access)
 * @returns Filtered table data based on user role
 */
export function createTableData(result: ApiResponse, role: number) {
  return result.rows
    .map((row: Row, index: number) => {
      const rowData: { [key: string]: string | number } = {
        key: index,
        ticker: row.asset.ticker,
      };

      row.data.forEach((dataItem: { value: string | number }, idx: number) => {
        const columnMetric = result.columns[idx]?.metric;
        if (columnMetric) {
          // Apply role-based visibility rules
          if (columnMetric === 'stock_number') {
            const stockNumber = Number(dataItem.value);
            
            // Level 1 (public): show only stock numbers >= 21
            if (role === 1 && stockNumber < 21) {
              rowData[columnMetric] = "Restricted";
              return;
            }
            
            // Level 2 (free access): show only stock numbers >= 11
            if (role === 2 && stockNumber < 11) {
              rowData[columnMetric] = "Restricted";
              return;
            }
          }
          
          rowData[columnMetric] = dataItem.value || "-";
        }
      });

      return rowData;
    });
}
