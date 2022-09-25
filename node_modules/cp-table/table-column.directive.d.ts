import { PipeTransform, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
export declare class TableColumnDirective implements OnInit {
    title: string;
    key: string;
    empty: string;
    pipes: PipeTransform[];
    ngClass: NgClass;
    class: string;
    ngOnInit(): void;
}
