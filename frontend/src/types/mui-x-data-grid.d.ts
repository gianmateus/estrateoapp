import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

declare module '@mui/x-data-grid' {
  interface GridRowParams {
    row: GridValidRowModel;
  }
} 