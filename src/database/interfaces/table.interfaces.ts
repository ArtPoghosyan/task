export interface TABLE_FILE {
  created_at: Date;
  path: string;
  format: 'JSON';
  name: string;
  table: TABLE_ITEM[];
}

export interface TABLE_ITEM {
  id: number;
  [key: string]: any;
}
