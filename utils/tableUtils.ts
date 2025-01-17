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

export function createTableData(result: ApiResponse) {
  return result.rows.map((row: Row, index: number) => {
    const rowData: { [key: string]: string | number } = {
      key: index,
      ticker: row.asset.ticker,
    };

    row.data.forEach((dataItem: { value: string | number }, idx: number) => {
      const columnMetric = result.columns[idx]?.metric;
      if (columnMetric) {
        rowData[columnMetric] = dataItem.value || "-";
      }
    });

    return rowData;
  });
}