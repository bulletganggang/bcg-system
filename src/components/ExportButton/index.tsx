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
  // 文件名前缀
  fileNamePrefix?: string;
  // 按钮是否禁用
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  excelData,
  fileNamePrefix = "导出文件",
  disabled = false,
}) => {
  const [exporting, setExporting] = useState(false);

  // 导出 Excel
  const exportToExcel = async () => {
    if (!excelData) {
      message.error("导出数据不能为空！");
      return false;
    }

    try {
      setExporting(true);
      const workbook = XLSX.utils.book_new();

      // 添加所有工作表
      excelData.sheets.forEach(({ name, data }) => {
        if (data && data.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(data);
          XLSX.utils.book_append_sheet(workbook, worksheet, name);
        }
      });

      // 导出文件
      const fileName = `${fileNamePrefix}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      message.success("Excel导出成功！");
      return true;
    } catch (error) {
      const err = error as Error;
      message.error(`Excel导出失败: ${err.message}`);
      console.error("Excel导出错误:", err);
      return false;
    } finally {
      setExporting(false);
    }
  };

  // 导出 PDF
  const exportToPDF = async () => {
    try {
      setExporting(true);

      // 获取整个页面内容
      const contentElement = document.querySelector(
        ".ant-layout-content"
      ) as HTMLElement;
      if (!contentElement) {
        message.error("未找到页面内容");
        return false;
      }

      // 临时调整样式以优化PDF导出
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "visible";

      // 等待图表完全渲染
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 创建canvas
      const canvas = await html2canvas(contentElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: contentElement.scrollWidth,
        windowHeight: contentElement.scrollHeight,
      });

      // 恢复原始样式
      document.body.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // 如果内容高度超过一页，分页处理
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = pdfHeight;
        let position = 0;
        let pageNumber = 1;

        while (heightLeft > 0) {
          if (pageNumber > 1) {
            pdf.addPage();
          }

          pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);

          heightLeft -= pageHeight;
          position -= pageHeight;
          pageNumber++;
        }
      } else {
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`${fileNamePrefix}.pdf`);
      message.success("PDF导出成功！");
      return true;
    } catch (error) {
      const err = error as Error;
      message.error(`PDF导出失败: ${err.message}`);
      console.error("PDF导出错误:", err);
      return false;
    } finally {
      setExporting(false);
    }
  };

  // 导出全部
  const exportAll = async () => {
    try {
      setExporting(true);

      // 先导出Excel
      const excelSuccess = await exportToExcel();

      // 再导出PDF
      const pdfSuccess = await exportToPDF();

      if (excelSuccess && pdfSuccess) {
        message.success("所有数据导出成功！");
      } else if (excelSuccess) {
        message.warning("Excel导出成功，但PDF导出失败");
      } else if (pdfSuccess) {
        message.warning("PDF导出成功，但Excel导出失败");
      } else {
        message.error("所有导出均失败，请重试");
      }
    } catch (error) {
      const err = error as Error;
      message.error(`导出过程中发生错误: ${err.message}`);
      console.error("导出全部错误:", err);
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
    },
    {
      key: "all",
      label: "导出全部",
      icon: <DownloadOutlined />,
      onClick: exportAll,
      disabled: !excelData,
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
