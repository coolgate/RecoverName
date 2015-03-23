'use strict';

var app = (function () {
	var total = 0;
	var fs = require('fs');
	var program = require('commander');

	var getFilenamesFromFilter = function (filter) {
		var regexFilter = '^' + RegExp.quote(filter).replace('\\*', '.*').replace('\\?', '.') + '$';
		var regex = new RegExp(regexFilter);
		var list = fs.readdirSync('.');
		var filtered = list.filter(function (val) {
			var result = val.match(regex);
			return result === null ? false : true;
		});
		return filtered;
	};

	var getFilenames = function () {
		if (program.filter) {
			return getFilenamesFromFilter(program.filter);
		} else {
			return getFilenamesFromFilter('*');
		}
	};


	var recoverName = function (Filename) {
		var newFilename = decodeURI(Filename);
		newFilename = unescape(newFilename);
		if (Filename !== newFilename) {
			console.log(Filename + ' => ' + newFilename);
			fs.renameSync(Filename, newFilename);
			total++;
		}
	};

	var main = function () {
		program
			.version('0.0.1')
			.option('-f, --filter [filter]', 'A wildcard filter for the file names in current directory.')
			.parse(process.argv);

		RegExp.quote = function (str) {
			return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
		};
		var files = getFilenames();
		total = 0;
		files.forEach(recoverName);
		console.log('Total ' + total + ' files\' name have been recovered.');
	}

	return {
		main: main
	};
})();

app.main();