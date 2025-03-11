/**
 * 导出表格接口
 */
export interface ExportSheet {
  name: string;
  data: Record<string, any>[];
}

/**
 * 导出数据接口
 */
export interface ExportData {
  sheets: ExportSheet[];
}
