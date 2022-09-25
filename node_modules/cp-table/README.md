Super simple HTML table generator for Agular

[Live example]()

# Installation
`npm i cp-table -S`

# Usage
Once you import `CpTableModule` to your `app.module.ts` you can add `CpTables` to your template.

```html
<cp-table [dataSource]="dataSource">
  <cp-table-column key="id"></cp-table-column>
  <cp-table-column key="name"></cp-table-column>
</cp-table>
```

## Setting column title
`CpTable` allows to set a different title to your columns. By default the column header will be the `key` name with a capital letter (ej: name will be Name).
In some cases you want to use a different name for the table column. To achieve this you can add the `title` attribute to `cp-table-column`.

```html
<cp-table [dataSource]="dataSource">
  <cp-table-column key="id"></cp-table-column>
  <cp-table-column key="name" title="Product"></cp-table-column>
</cp-table>
```

## Using default values
Not every column must have a value and sometimes you might want to use a default value for an specific table. You can do that using `empty` attribute.

```html
<cp-table [dataSource]="dataSource">
  <cp-table-column key="id"></cp-table-column>
  <cp-table-column key="name" empty="(No name)"></cp-table-column>
</cp-table>
```

## Formatting columns
Some columns need special treatment. Imagine you want to format a column as a price using Angular [CurrencyPipe](https://angular.io/api/common/CurrencyPipe). You can add an array of `PipeTransform` classes to the `pipes` property of the column.

```typescript
// app.component.ts

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  currencyPipes: PipeTransform[];

  constructor(private currency: CurrencyPipe) {
    this.currencyPipes = [currency];
  }
}
```
```html
<cp-table [dataSource]="source">
  <cp-table-column title="#" key="id"></cp-table-column>
  <cp-table-column key="name"></cp-table-column>
  <cp-table-column [pipes]="currencyPipes" key="price"></cp-table-column>
</cp-table>
```

`CpTable` will run every pipe on every single row for that column.

## Using custom classes
`TableComponent` and `TableColumnDirective` both accept `[ngClass]` and `class` as attributes, allowing you to style the table as you want.

```html
<cp-table [dataSource]="source" [ngClass]="{ 'table': true }">
  <cp-table-column title="#" key="id"></cp-table-column>
  <cp-table-column key="name" class="font-italic"></cp-table-column>
  <cp-table-column [pipes]="currencyPipes" key="price" class="font-weight-bold"></cp-table-column>
</cp-table>
```

## Listening to events
`CpTables` will trigger events on column click. `CpTables` has its own `TableClickEvent` that is an extension of `MouseEvent`.

```typescript
import { TableColumnDirective } from '../table-column.directive';

export interface TableClickEvent extends MouseEvent {
  column: TableColumnDirective;
  rowClicked?: any; // All values of the clicked row
  rowIndex?: number;
}
```

### Listening to events on row click

```html
<cp-table [dataSource]="source" (rowClick)="onRowClicked($event)" class="table">
  <cp-table-column title="#" key="id"></cp-table-column>
  <cp-table-column key="name" empty="--" class="font-italic"></cp-table-column>
  <cp-table-column [pipes]="currencyPipes" key="price" class="font-weight-bold"></cp-table-column>
</cp-table>
```

### Listening to events on header click
```html
<cp-table [dataSource]="source" (headerClick)="onHeaderClicked($event)" class="table">
  <cp-table-column title="#" key="id"></cp-table-column>
  <cp-table-column key="name" empty="--" class="font-italic"></cp-table-column>
  <cp-table-column [pipes]="currencyPipes" key="price" class="font-weight-bold"></cp-table-column>
</cp-table>
```