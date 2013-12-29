Migration to WET 4 Architecture
===========================

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

Currently Done
---------------------------

* The labeling strategy and code was fully re-written in order to be more clear and more usable.

Background about migration strategy prior WET 4
---------------------------

See the Chart and graph wet-boew wiki 