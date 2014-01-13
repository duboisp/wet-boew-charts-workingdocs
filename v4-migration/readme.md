Migration to WET 4 Architecture
===========================

_See completed change at the ends (v4 migration notes)_

Goal
---------------------------

* Use less code 
* Be small (kilo byte) (at least when compressed)
* Be faster as possible
* Take the full advantage of JEP (Javascript Event Programming)
* Write code with style (lint)


On Going
---------------------------
* Looking in a strategy where the JSON data can be use at his optimal way.
* Studing how Flot can handle the options and how it is currently used by the wb-charts
* Looking to remove the function ```setClassOptions()```
* Looking to keep the "preset" functionality from ```setClassOptions()``` function
* Looking on how to keep the justification on how some technical decision was take and will be taken.

Todo:
* Redifine the support for a stacked charts. Now it is disabled and only bar charts is supported. 
* For Bar charts side by side, try to use an existing plugin for providing support.
* Adapt each working example with the new way to provide data ```data-flot``` and ```data-wet-boew```
* Find a way to ease the adhoc integration of preset.


### JSON Data

Goal: Use the flot data structure from a HTML data attribute set on a table element. 

Done for:

* Global flot setting (set on ```<table>``` element)
* 2d charts (area, bar, line)
* Pie charts (setting location is now set on the cell header)
* Global charts settings (set on ```<table>``` element)


#### Predefined Preset

By using a CSS option, it is possible to load preset, see pie.html working for an example.


#### Type of table elements 

* The container: ```<table>```
* Structural: ```<tr> <col> <thead> <tbody> <tfoot> <colgroup>```
* Informative: ```<caption> <th> <td>```


#### Suggestive choice

The container ```<table>``` elements will be the best place to carry any Global Option. 

The informative elements, more specificly the cell header ```<th>``` that represent the series (use to label the series) would be the better place to carry the series options

Any options set on informative elements like ```<caption> <td>``` will be ignored. 

The html contained in the ```<caption>``` will be copied (cloned) in the ```<figcaption>``` as is.

Only the value of the data cell and may be his quantifier would be extracted from the ```<td>```

Any options set on the structural element like ```<thead> <tbody> <tfoot> <colgroup>``` would be ignored.

May be considerate to use the vector structural elements ```<tr> <col>``` in order to provide a default for the first series (first data set). Summary data set would be out of scope for any options set to vectors elements.


#### Flot Data Structure (for reference)

```
// For a series object
{
    color: color or number
    data: rawdata
    label: string
    lines: specific lines options
    bars: specific bars options
    points: specific points options
    xaxis: number
    yaxis: number
    clickable: boolean
    hoverable: boolean
    shadowSize: number
    highlightColor: color or number
}


// Plot Option (Global Option)
{
    series: {
        lines: { show: true },
        points: { show: true }
    },
    // Series More elaborated example
	series: { 
		lines, points, bars: {
			show: boolean
			lineWidth: number
			fill: boolean or number
			fillColor: null or color/gradient
		}

		lines, bars: {
			zero: boolean
		}

		points: {
			radius: number
			symbol: "circle" or function
		}

		bars: {
			barWidth: number
			align: "left", "right" or "center"
			horizontal: boolean
		}

		lines: {
			steps: boolean
		}

		shadowSize: number
		highlightColor: color or number
	},
	colors: [ color1, color2, ... ],
    legend: {
		show: boolean
		labelFormatter: null or (fn: string, series object -> string)
		labelBoxBorderColor: color
		noColumns: number
		position: "ne" or "nw" or "se" or "sw"
		margin: number of pixels or [x margin, y margin]
		backgroundColor: null or color
		backgroundOpacity: number between 0 and 1
		container: null or jQuery object/DOM element/jQuery expression
		sorted: null/false, true, "ascending", "descending", "reverse", or a comparator
	},
	xaxis: {
		show: null or true/false
		position: "bottom" or "top" or "left" or "right"
		mode: null or "time" ("time" requires jquery.flot.time.js plugin)
		timezone: null, "browser" or timezone (only makes sense for mode: "time")

		color: null or color spec
		tickColor: null or color spec
		font: null or font spec object

		min: null or number
		max: null or number
		autoscaleMargin: null or number

		transform: null or fn: number -> number
		inverseTransform: null or fn: number -> number

		ticks: null or number or ticks array or (fn: axis -> ticks array)
		tickSize: number or array
		minTickSize: number or array
		tickFormatter: (fn: number, object -> string) or string
		tickDecimals: null or number

		labelWidth: null or number
		labelHeight: null or number
		reserveSpace: null or true

		tickLength: null or number

		alignTicksWithAxis: null or number
	},
	yaxis: {
		show: null or true/false
		position: "bottom" or "top" or "left" or "right"
		mode: null or "time" ("time" requires jquery.flot.time.js plugin)
		timezone: null, "browser" or timezone (only makes sense for mode: "time")

		color: null or color spec
		tickColor: null or color spec
		font: null or font spec object

		min: null or number
		max: null or number
		autoscaleMargin: null or number

		transform: null or fn: number -> number
		inverseTransform: null or fn: number -> number

		ticks: null or number or ticks array or (fn: axis -> ticks array)
		tickSize: number or array
		minTickSize: number or array
		tickFormatter: (fn: number, object -> string) or string
		tickDecimals: null or number

		labelWidth: null or number
		labelHeight: null or number
		reserveSpace: null or true

		tickLength: null or number

		alignTicksWithAxis: null or number
	},
	grid: {
		show: boolean
		aboveData: boolean
		color: color
		backgroundColor: color/gradient or null
		margin: number or margin object
		labelMargin: number
		axisMargin: number
		markings: array of markings or (fn: axes -> array of markings)
		borderWidth: number or object with "top", "right", "bottom" and "left" properties with different widths
		borderColor: color or null or object with "top", "right", "bottom" and "left" properties with different colors
		minBorderMargin: number or null
		clickable: boolean
		hoverable: boolean
		autoHighlight: boolean
		mouseActiveRadius: number
	},
	interaction: {
		redrawOverlayInterval: number or -1
	}
}

```


Use Less Code
---------------------------

Suggested to let the web-editor to code a JSON string directly in a HTML5 data attribute and do almost literal transfer to flot


Be Small
---------------------------

Suggested to let the web-editor to code a JSON string directly in a HTML5 data attribute and do almost literal transfer to flot

Be Faster
---------------------------

By using JEP and do variable caching

Use JEP approach
---------------------------

Currently only the plugin use JEP. TODO: use a JEP structure inside the charts for each components

Be Styled
---------------------------

The grunt build script help to avoid minimal styling error.

Currently Done - To be included in v4 migration notes
---------------------------

* The labeling strategy and code was fully re-written in order to be more clear and more usable.
* Default chart type was change for the default flot chart. That means default are now a line chart and bar chart need to be explicitly defined
* Custom Parameter for pie chart was changed from the data cell location to be set to the appropriate cell header.
* Any Flot parameter is set by using the ```data-flot``` attribute. Table for Flot global setting and appropriate cell header for Flot series setting.

Background about migration strategy prior WET 4
---------------------------

See the Chart and graph wet-boew wiki 
