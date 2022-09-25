"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var TableColumnDirective = (function () {
    function TableColumnDirective() {
    }
    TableColumnDirective.prototype.ngOnInit = function () {
        if (!this.title) {
            this.title = this.key.charAt(0).toUpperCase() + this.key.slice(1);
        }
    };
    __decorate([
        core_1.Input()
    ], TableColumnDirective.prototype, "title");
    __decorate([
        core_1.Input()
    ], TableColumnDirective.prototype, "key");
    __decorate([
        core_1.Input()
    ], TableColumnDirective.prototype, "empty");
    __decorate([
        core_1.Input()
    ], TableColumnDirective.prototype, "pipes");
    __decorate([
        core_1.Input()
    ], TableColumnDirective.prototype, "ngClass");
    __decorate([
        core_1.Input()
    ], TableColumnDirective.prototype, "class");
    TableColumnDirective = __decorate([
        core_1.Directive({
            selector: 'cp-table-column'
        })
    ], TableColumnDirective);
    return TableColumnDirective;
}());
exports.TableColumnDirective = TableColumnDirective;
