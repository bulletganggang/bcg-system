import React, { useState } from "react";
import { Button, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportButtonProps {
  // 导出 Excel 时的数据
  excelData?: {
    sheets: {
      name: string;
      data: Record<string, any>[];
    }[];
  };
  // 导出 PDF 时要截图的元素的选择器
  pdfTargetSelector?: string;
  // 文件名前缀
  fileNamePrefix?: string;
  // 按钮是否禁用
  disabled?: boolean;
  // 导出成功的回调
  onExportSuccess?: () => void;
  // 导出失败的回调
  onExportError?: (error: Error) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  excelData,
  pdfTargetSelector,
  fileNamePrefix = "导出文件",
  disabled = false,
  onExportSuccess,
  onExportError,
}) => {
  const [exporting, setExporting] = useState(false);

  // 导出 Excel
  const exportToExcel = async () => {
    if (!excelData) {
      message.error("导出数据不能为空！");
      return;
    }

    try {
      setExporting(true);
      const workbook = XLSX.utils.book_new();

      // 添加所有工作表
      excelData.sheets.forEach(({ name, data }) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, name);
      });

      // 导出文件
      const fileName = `${fileNamePrefix}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      message.success("Excel导出成功！");
      onExportSuccess?.();
    } catch (error) {
      const err = error as Error;
      message.error("Excel导出失败，请重试！");
      console.error("Excel导出错误:", err);
      onExportError?.(err);
    } finally {
      setExporting(false);
    }
  };

  // 导出 PDF
  const exportToPDF = async () => {
    if (!pdfTargetSelector) {
      message.error("未指定要导出的内容！");
      return;
    }

    try {
      setExporting(true);
      const element = document.querySelector(pdfTargetSelector) as HTMLElement;
      if (!element) {
        throw new Error("未找到要导出的内容");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileNamePrefix}.pdf`);
      message.success("PDF导出成功！");
      onExportSuccess?.();
    } catch (error) {
      const err = error as Error;
      message.error("PDF导出失败，请重试！");
      console.error("PDF导出错误:", err);
      onExportError?.(err);
    } finally {
      setExporting(false);
    }
  };

  // 一键导出
  const exportAll = async () => {
    try {
      setExporting(true);
      await exportToExcel();
      await exportToPDF();
      message.success("所有文件导出成功！");
      onExportSuccess?.();
    } catch (error) {
      const err = error as Error;
      console.error("一键导出错误:", err);
      onExportError?.(err);
    } finally {
      setExporting(false);
    }
  };

  // 导出菜单项
  const exportMenu: MenuProps["items"] = [
    {
      key: "excel",
      label: "导出Excel",
      icon: <DownloadOutlined />,
      onClick: exportToExcel,
      disabled: !excelData,
    },
    {
      key: "pdf",
      label: "导出PDF",
      icon: <DownloadOutlined />,
      onClick: exportToPDF,
      disabled: !pdfTargetSelector,
    },
    {
      key: "all",
      label: "导出全部",
      icon: <DownloadOutlined />,
      onClick: exportAll,
      disabled: !excelData || !pdfTargetSelector,
    },
  ];

  return (
    <Dropdown menu={{ items: exportMenu }} disabled={disabled || exporting}>
      <Button
        type="primary"
        icon={exporting ? <LoadingOutlined /> : <DownloadOutlined />}
      >
        {exporting ? "导出中..." : "导出数据"}
      </Button>
    </Dropdown>
  );
};

export default ExportButton;
