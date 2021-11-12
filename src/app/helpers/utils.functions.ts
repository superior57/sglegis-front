import * as moment from "moment";

export function dateFormat(date: any, format: string) {
    if (date) {
        const d = moment(date);
        return d.format(format);            
    } 
    return null;
}

export function getFields(input, field, defaultnull = undefined) {
    var output = [];
    for (var i = 0; i < input.length; ++i) {
        let val = input[i][field];
        output.push(!val ? defaultnull : val);
    }
    return output;
}

const getGroupCount = (groupDigits) => {
	let strRes = "";
	for (let i = 0; i < 3; i ++) 
		strRes += "h"
	return strRes
}

export const getDecimalGroupFormat = (number = 0, groupDigits = 3, fractionDigits = 2) => {
	return new Intl.NumberFormat(getGroupCount(groupDigits), {
		style: 'decimal',
		useGrouping: true,
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits
	}).format(number)
}