export interface TABLE_FILE {
  created_at: Date;
  path: string;
  format: 'JSON';
  name: string;
  table: Array<object>;
}
