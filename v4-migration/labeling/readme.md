Labeling Stategy 
===========================

This stategy is based on an HTML Table that are conform to the 12 WCAG additional technique defined in the WET.

Only the first data group is considerated. Summary group, additional data group and the hiearchy relationship between group are ignored because we need more use case. 

Dependency: The WET Complex Table Parser

The labeling can be read from the table at the horizontal or vertical.

It is during the labeling process where the steps (x-axis) value is calculated. That value is know as being ```flotdelta``` set at the cells.

## Technical

### Espected Parameters Required

* Tabular Data understood as *Vertical* or *Horizontal*
* Vector Position for the text labels
* Vector Position be used as a reference value (where each items will be know as a value of one

### Definition

Vector: Row or Colum in a table

## How it currently work

### Main entry function

* ```function horizontalLabels()``` : Return an array (key, value) of the labels for the x-axis based on the row group header (thead)
* ```function verticalLabels()``` : Return an array (key, value) of the labels for the x-axis based on the column group header (first colgroup)

Only one of the preceding options is called per tables.

## For the future

To not use 2 different function for vertical/horizontal parsing, but use only one. This may require a re-design/optimization of the current table parser and on how the parsed data is provided.