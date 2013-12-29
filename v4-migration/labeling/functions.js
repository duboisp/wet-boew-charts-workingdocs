
	/** 
	 * @method getColumnGroupHeaderCalculateSteps
	 * @param {object} colGroupHead - Column Group Header Object from the table parser
	 * @param {number} referenceValuePosition - Vector position use as reference for defining the steps, zero based position
	 */
	function getColumnGroupHeaderCalculateSteps( colGroupHead, referenceValuePosition ) {
		// Get the appropriate ticks
		var headerCell, i, _ilen,
			calcStep = 1;
			
			
		if ( !colGroupHead ) {
			return; // There is an error, may be each series do not have an header
		}

		for ( i = 0, _ilen = colGroupHead.col[ referenceValuePosition ].cell.length; i < _ilen; i += 1 ) {

			headerCell = colGroupHead.col[ referenceValuePosition ].cell[ i ];

			if ( i === 0 || ( i > 0 && colGroupHead.col[ 0 ].cell[ i - 1 ].uid !== headerCell.uid ) ) {

				if ( headerCell.rowgroup && headerCell.rowgroup.type === 3 ) {
					// We only process the first column data group
					break;
				}

				if ( headerCell.type === 1 || headerCell.type === 7 ) {
					if ( headerCell.child.length > 0 ) {
						calcStep = calcStep * groupHeaderCalculateStepsRecursive( headerCell, 1 );
					}
				}
			}
		}

		return calcStep;
	}

	/** 
	 * @method getRowGroupHeaderCalculateSteps
	 * @param {object} rowGroupHead - Row Group Header Object from the table parser
	 * @param {number} referenceValuePosition - Vector position use as reference for defining the steps, zero based position
	 * @param {number} dataColgroupStart - Column position where the column data group start 
	 */
	function getRowGroupHeaderCalculateSteps( rowGroupHead, referenceValuePosition, dataColgroupStart ) {
		// Find the range of the first data colgroup
		var headerCell, i, _ilen,
			calcStep = 1;

		for ( i = 0, _ilen = rowGroupHead[ referenceValuePosition ].elem.cells.length; i < _ilen; i += 1 ) {

			headerCell = $( rowGroupHead[ referenceValuePosition ].elem.cells[ i ] ).data().tblparser;

			if ( headerCell.colgroup && headerCell.colgroup.type === 3 ) {
				// We only process the first column data group
				break;
			}

			if ( headerCell.colpos >= dataColgroupStart && ( headerCell.type === 1 || headerCell.type === 7 ) ) {
				if ( headerCell.child.length > 0 ) {
					calcStep = calcStep * headerCell.child.length;
					calcStep = calcStep * groupHeaderCalculateStepsRecursive( headerCell, 1 );
					
				}
			}
		}
		
		return calcStep;
	}

	/**
	 * @method groupHeaderCalculateStepsRecursive
	 * @param {object} headerCell - Header cell object from the table parser
	 * @param {number} refValue - Reference Value (Dénominateur) of headerCell
	 */
	function groupHeaderCalculateStepsRecursive( headerCell, refValue ) {
		var childLength = headerCell.child.length,
			kIndex,
			subRefValue,
			calcStep = 1;

		if ( childLength === 0 ) {
			return calcStep;
		}
				
		subRefValue = childLength * refValue;
		
		calcStep = calcStep * subRefValue;

		for ( kIndex = 0; kIndex < childLength; kIndex += 1 ) {
			if ( headerCell.child[ kIndex ].child.length > 0 ) {
				calcStep = calcStep * groupHeaderCalculateStepsRecursive( headerCell.child[ kIndex ], subRefValue );
			}
		}
		return calcStep;
	}

	/**
	 * Set the inner step value (divisor) of an header cell and for his child
	 * 
	 * @method setInnerStepValues
	 * @param {object} vectorHead - Group Header Object from the table parser
	 * @param {number} headerLevel - Hiearchical Level of heading
	 * @param {number} stepsValue - Step Value for the reference value vector
	 * @param {number} referenceValue - Reference Value Vector ID
	 * @param {number} dataColgroupStart - Column position where the column data group start 
	 * 
	 */
	function setInnerStepValues( vectorHead, headerLevel, stepsValue, referenceValue, dataColgroupStart ) {
		var i,
			headerCell,
			cumulativeValue = 0;

		for ( i = 0; i < vectorHead.cell.length; i += 1 ) {
			headerCell = vectorHead.cell[ i ];
			if ( i > 0 && headerCell.uid === vectorHead.cell[ i - 1 ].uid || ( dataColgroupStart && headerCell.colpos < dataColgroupStart ) ) {
				continue;
			}
			// Only process the first data group
			if ( !reverseTblParsing ) {
				if ( headerCell.colgroup && headerCell.colgroup.type === 3 ) {
					break;
				}
			} else {
				if ( headerCell.rowgroup && headerCell.rowgroup.type === 3 ) {
					break;
				}
			}
			if ( headerCell.child > 0 && headerLevel < referenceValue ) {
				headerCell.flotDelta = stepsValue * headerCell.child.length;
			} else {
				headerCell.flotDelta = stepsValue;
			}
			if ( headerCell.type === 1 || headerCell.type === 7  ) {

				if ( !lowestFlotDelta || headerCell.flotDelta < lowestFlotDelta ) {
					lowestFlotDelta = headerCell.flotDelta;
				}
				headerCell.flotValue = cumulativeValue;
				
				cumulativeValue = cumulativeValue + stepsValue;
				
				if ( headerCell.child.length > 0 ) {
					setInnerStepValuesChildRecursive( headerCell, headerLevel, stepsValue, referenceValue );
				}
			}
		}
	}
	
	/**
	 * Recursize - Set the inner step value (divisor) of an sub header cell  
	 * 
	 * @method setInnerStepValuesChildRecursive
	 * @param {object} headerCell - Header cell object from the table parser
	 * @param {number} headerLevel - Hiearchical Level of heading
	 * @param {number} stepsValue - Specific Step Value applied for current headerCell
	 * @param {number} referenceValue - Reference Value Vector ID
	 */
	function setInnerStepValuesChildRecursive( headerCell, headerLevel, stepsValue, referenceValue ) {
		var i,
			flotDelta, // Step Values for childs header in headerCell
			cumulativeValue = 0,
			currentHeaderCellChild;

		headerLevel += 1;
		cumulativeValue = headerCell.flotValue;
		flotDelta = stepsValue / headerCell.child.length;

		// Use to calculate the largest width for a bar in a bar chart
		if ( !lowestFlotDelta || flotDelta < lowestFlotDelta ) {
			lowestFlotDelta = flotDelta;
		}

		for ( i = 0; i < headerCell.child.length; i += 1 ) {
			currentHeaderCellChild = headerCell.child[ i ];
			if ( headerLevel < referenceValue ) {
				currentHeaderCellChild.flotDelta = flotDelta * currentHeaderCellChild.child.length;
			} else {
				currentHeaderCellChild.flotDelta = flotDelta;
			}
			currentHeaderCellChild.flotValue = cumulativeValue;
			if ( currentHeaderCellChild.child.length > 0 ) {
				setInnerStepValuesChildRecursive( currentHeaderCellChild, headerLevel, flotDelta, referenceValue );
			}
			cumulativeValue = cumulativeValue + flotDelta;
		}
	}

	/**
	 * Set the header cell step value (flotDelta) for vector that regroup more than one reference 
	 * 
	 * @method setUpperStepValues
	 * @param {object} vectorHead - Group Header Object from the table parser
	 * @param {number} referenceValue - Reference Value Vector ID
	 */
	function setUpperStepValues( vectorHead, referenceValue ) {
		var i, k, m, _klen, _mlen,
			cumulativeValue,
			currentCell,
			currentCellChild;
		
		// Calculate upper-step for cells that are less preceise than the reference value vector
		for ( i = referenceValue - 1; i >= 0; i -= 1 ){
			
			for ( k = 0, _klen = vectorHead[ i ].cell.length; k < _klen; k += 1 ) {
				currentCell = vectorHead[ i ].cell[ k ];
				
				if ( currentCell.flotDelta || k > 0 && currentCell.uid === vectorHead[ i ].cell[ k - 1 ].uid ){
					continue;
				}

				if ( !( currentCell.type === 1 || currentCell.type === 7 ) ) {
					continue;
				}

				cumulativeValue = 0;
				for ( m = 0, _mlen = currentCell.child.length; m < _mlen; m += 1 ) {
					currentCellChild = currentCell.child[ m ];
					
					cumulativeValue = currentCellChild.flotDelta;
					if ( currentCell.flotValue === undefined ) {
						currentCell.flotValue = currentCellChild.flotValue;
					}
				}
				currentCell.flotDelta = cumulativeValue;
				
			}
		}
	}

	/**
	 * Get lebels for a specific vector
	 * 
	 * @method getLabels
	 * @param {object} labelVector - Vector Header Object from the table parser
	 * @param {number} dataColgroupStart - Column position where the column data group start 
	 */
	function getLabels( labelVector, dataColgroupStart ) {
		var i, _ilen,
			labels = [],
			currentCell;

		for ( i = 0, _ilen = labelVector.cell.length; i < _ilen; i += 1 ) {
			currentCell = labelVector.cell[ i ];
			
			if ( ( i > 0 && currentCell.uid === labelVector.cell[ i - 1 ].uid ) ||
					( !( currentCell.type === 1 || currentCell.type === 7 ) ) ||
					( dataColgroupStart && currentCell.colpos < dataColgroupStart ) ) {
				continue;
			}

			labels.push( [ currentCell.flotValue, $( currentCell.elem ).text() ] );
		}
		return labels;
	}

	/**
	 * Get the vector that would be used for labeling x-axis
	 * 
	 * @method getlabelsVectorPosition
	 * @param {object[]} arrVectorHeaders - Collection of vector headers
	 */
	function getlabelsVectorPosition( arrVectorHeaders ) {
		return ( !options.labelposition || ( options.labelposition && options.labelposition > arrVectorHeaders.length ) ? parsedData.theadRowStack.length : options.labelposition ) - 1;
	}

	/**
	 * Get the vertical label and set the appropriate header cell x-axis Value
	 * 
	 * @method verticalLabels
	 * @param {object} parsedData - Generic object generated by the table parser
	 */
	function verticalLabels( parsedData ) {

		// Get the appropriate ticks
		var headerlevel = 0,
			labelsVectorPosition,
			stepsValue,
			columnReferenceValue;

		if ( !reverseTblParsing || ( reverseTblParsing && options.referencevalue === undefined ) ) {
			columnReferenceValue = parsedData.colgrouphead.col.length;
		} else {
			columnReferenceValue = options.referencevalue;
		}
		
		columnReferenceValue = columnReferenceValue - 1;
		
		stepsValue = getColumnGroupHeaderCalculateSteps( parsedData.colgrouphead, columnReferenceValue );

		if ( !reverseTblParsing ) {
			labelsVectorPosition = parsedData.colgrouphead.col.length - 1;
		} else {
			labelsVectorPosition = getlabelsVectorPosition( parsedData.colgrouphead.col );
		}

		headerlevel = columnReferenceValue;
		
		// Calculate inner-step for cells that are more precise than the reference value vector 
		setInnerStepValues( parsedData.colgrouphead.col[ columnReferenceValue ], headerlevel, stepsValue, columnReferenceValue );
		
		// Calculate upper-step for cells that are less preceise than the reference value vector
		setUpperStepValues( parsedData.colgrouphead.col, columnReferenceValue );

		// Get the labeling
		return getLabels( parsedData.colgrouphead.col[ labelsVectorPosition ] );
	}

	/**
	 * Get the horizontal label and set the appropriate header cell x-axis Value
	 * 
	 * @method horizontalLabels
	 * @param {object} parsedData - Generic object generated by the table parser
	 */
	function horizontalLabels( parsedData ) {
		// Find the range of the first data colgroup
		var dataColgroupStart = -1,
			headerlevel = 0,
			i,
			labelsVectorPosition,
			stepsValue,
			rowReferenceValue;

		if ( !parsedData.theadRowStack ) {
			return;
		}

		for ( i = 0; i < parsedData.colgroup.length; i += 1 ) {
			if ( parsedData.colgroup[ i ].type === 2 ) {
				dataColgroupStart = parsedData.colgroup[ i ].start;
				break;
			}
		}

		if ( ( !reverseTblParsing && options.referencevalue === undefined ) || reverseTblParsing ) {
			rowReferenceValue = parsedData.theadRowStack.length;
		} else {
			rowReferenceValue = options.referencevalue;
		}

		rowReferenceValue = rowReferenceValue - 1;

		stepsValue = getRowGroupHeaderCalculateSteps( parsedData.theadRowStack, rowReferenceValue, dataColgroupStart );

		if ( !reverseTblParsing ) {
			labelsVectorPosition = getlabelsVectorPosition( parsedData.theadRowStack );
			
		} else {
			labelsVectorPosition = parsedData.theadRowStack.length - 1;
		}

		headerlevel = rowReferenceValue;

		// Calculate inner-step for cells that are more precise than the reference value vector 
		setInnerStepValues( parsedData.theadRowStack[ rowReferenceValue ], headerlevel, stepsValue, rowReferenceValue, dataColgroupStart );

		// Calculate upper-step for cells that are less preceise than the reference value vector
		setUpperStepValues( parsedData.theadRowStack, rowReferenceValue );

		// Get the labeling
		return getLabels( parsedData.theadRowStack[ labelsVectorPosition ], dataColgroupStart );
		
	}