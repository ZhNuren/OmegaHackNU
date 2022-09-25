"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var table_column_directive_1 = require("./table-column.directive");
var TableComponent = (function () {
    function TableComponent() {
        this.rowClick = new core_1.EventEmitter();
        this.headerClick = new core_1.EventEmitter();
    }
    TableComponent.prototype.resolve = function (row, column) {
        return (column.pipes || []).reduce(function (state, current) { return current.transform(state); }, row[column.key] || column.empty);
    };
    TableComponent.prototype.onRowClick = function (event, column, rowIndex) {
        var rowClicked = this.dataSource[rowIndex];
        this.rowClick.emit(__assign({}, event, { column: column, rowIndex: rowIndex, rowClicked: rowClicked }));
    };
    TableComponent.prototype.onHeaderClick = function (event, column) {
        this.headerClick.emit(__assign({}, event, { column: column }));
    };
    __decorate([
        core_1.Input()
    ], TableComponent.prototype, "dataSource");
    __decorate([
        core_1.Input()
    ], TableComponent.prototype, "ngClass");
    __decorate([
        core_1.Input()
    ], TableComponent.prototype, "class");
    __decorate([
        core_1.Output()
    ], TableComponent.prototype, "rowClick");
    __decorate([
        core_1.Output()
    ], TableComponent.prototype, "headerClick");
    __decorate([
        core_1.ContentChildren(table_column_directive_1.TableColumnDirective)
    ], TableComponent.prototype, "columns");
    TableComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cp-table',
            template: "\n    <table [ngClass]=\"ngClass\" [class]=\"class\">\n    <thead>\n      <tr>\n        <th *ngFor=\"let column of columns\" (click)=\"onHeaderClick($event, column)\">\n          {{ column.title }}\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let row of dataSource; let i = index\">\n        <td *ngFor=\"let column of columns\" (click)=\"onRowClick($event, column, i)\" [ngClass]=\"column.ngClass\" [class]=\"column.class\">\n          {{ resolve(row, column) }}\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  "
        })
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
