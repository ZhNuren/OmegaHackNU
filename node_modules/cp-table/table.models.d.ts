import { TableColumnDirective } from './table-column.directive';
export interface TableClickEvent extends MouseEvent {
    column: TableColumnDirective;
    rowClicked?: any;
    rowIndex?: number;
}
