/*
* This library will be in charge of manipulating(CRUD) data in .data folder
*
*/

// dependencies
var fs = require('fs');
var path = require('path');

//container for the library methods
var lib = {};

//base path
lib.basePath = path.join(__dirname + '/../.data/');

//create file and write data to it
lib.create = function(dir, file, data, callback) {
	fs.open(lib.basePath+dir+'/'+file+'.json','wx',function(err, fileDescriptor) {
		if(!err && fileDescriptor) {
			//convert data to string so we can write it the file
			var stringData = JSON.stringify(data);

			//write to file and close it
			fs.writeFile(fileDescriptor, stringData, function(err) {
				if(!err) {
					fs.close(fileDescriptor, function(err) {
						if(!err) {
							callback(false); //we are calling back false because the callback expects an error
						} else {
							callback('Error closing new file');
						}
					})
				} else {
					callback('Error writing to new file');
				}
			});
		} else {
			callback('Error creating file, file might already exist');
		}
	});
};

//read data in file
lib.read = function(dir, file, callback) {
	fs.readFile(lib.basePath+dir+'/'+file+'.json', 'utf8', function(err, data) {
		callback(err, data);
	});
};

//update data in file
lib.update = function(dir, file, data, callback) {
	fs.open(lib.basePath+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor) {
		if(!err) {
			//convert data to string
			var stringData = JSON.stringify(data);

			//truncate file (its like cleaning the board before you write on it, ie to truncate)
			fs.truncate(fileDescriptor, function(err) {
				if(!err) {
					//write file and close
					fs.writeFile(fileDescriptor, stringData, function(err) {
						if(!err) {
							fs.close(fileDescriptor, function(err) {
								if(!err) {
									callback(false);
								}else {
									callback('Error closing existing file');
								}
							});
						} else {
							callback('Error writing to existing file');
						}
					});
				} else {
					callback('Error truncating file');
				}
			});
		} else {
			callback('Error opening file for update, file do not exist')
		}
	});
};

//deleting file
lib.delete = function(dir, file, callback) {
	fs.unlink(lib.basePath+dir+'/'+file+'.json', function(err) {
		if(!err) {
			callback(false);
		} else {
			callback('Error deleting file');
		}
	});
};

module.exports =lib;