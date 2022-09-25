import { EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { TableColumnDirective } from './table-column.directive';
import { TableClickEvent } from './table.models';
export declare class TableComponent {
    dataSource: Array<any>;
    ngClass: NgClass;
    class: string;
    rowClick: EventEmitter<TableClickEvent>;
    headerClick: EventEmitter<TableClickEvent>;
    columns: TableColumnDirective[];
    constructor();
    private resolve(row, column);
    private onRowClick(event, column, rowIndex);
    private onHeaderClick(event, column);
}
