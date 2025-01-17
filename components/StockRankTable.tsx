"use client";

import { createTableColumns, createTableData } from "@/utils/tableUtils";
import type { Response } from "@/types/stockFetchData";
import { AnyObject } from "antd/es/_util/type";
import { Table, Spin, Alert, Row } from "antd";
import type { TableColumnsType } from "antd";
import { fetcher } from "@/lib/fetchData";
import React, { useState } from "react";
import useSWR, { preload } from "swr";

preload("https://www.investing.com/pro/_/screener-v2/query", fetcher);

const StockRankTable: React.FC = () => {
  const [columns, setColumns] = useState<TableColumnsType<AnyObject>>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableData, setTableData] = useState<
    { [key: string]: string | number }[]
  >([]);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const { data, error, isLoading } = useSWR<Response, Error>(
    `https://www.investing.com/pro/_/screener-v2/query?currentPage=${currentPage}`,
    (url) =>
      fetcher({
        url,
        page: { skip: (currentPage - 1) * pageSize, limit: pageSize },
      }),
    {
      onSuccess: (response) => {
        if (response?.columns && response?.rows) {
          setIsPaginationLoading(true);
          const convertedColumns = createTableColumns(response);
          const convertedRows = createTableData(response);
          setColumns(convertedColumns);
          setTableData(convertedRows);
          setTotalRecords(response.page.totalItems || 0);
          setPageSize(response.page.pageSize || 10);
          setIsPaginationLoading(false);
        }
      },
    }
  );

  const handlePaginationChange = async (page: number, size: number) => {
    setIsPaginationLoading(true);
    try {
      setCurrentPage(page);
      setPageSize(size);
    } catch (error) {
      console.error("Pagination error:", error);
    } finally {
      setIsPaginationLoading(false);
    }
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error || !data?.columns || !data?.rows) {
    return (
      <Alert
        message="Error Loading Data"
        description={error?.message || "Failed to load stock data"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Row justify="center" align="middle">
      <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={tableData}
        loading={isPaginationLoading}
        pagination={{
          pageSize,
          current: currentPage,
          total: totalRecords,
          responsive: true,
          showSizeChanger: true,
          onChange: handlePaginationChange,
        }}
        scroll={{ x: "max-content" }}
        size="large"
      />
    </Row>
  );
};

export default StockRankTable;

// TODO: Add error handling for pagination failures
// TODO: Implement caching for paginated data
// TODO: Consider adding a debounce for rapid page changes
// TODO: Add validation for pagination parameters
// TODO: Implement server-side pagination if performance becomes an issue
// TODO: Add configurable default page size options
