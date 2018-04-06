/*
* basic configurations for our app
*
*/


var environments = {}

environments.staging = {
	'httpPort': 3000,
	'httpsPort': 3001,
	'envName': 'staging'
}

environments.production = {
	'httpPort': 5000,
	'httpsPort': 5001,
	'envName': 'production'
}

//get environment name from cli, if empty, default to staging (figure out which environment to export)
var specifiedEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

/*process.env has to do with the os... remember. os handles processes, just like servering an app on port.
'process.env' signifies the environment where the process is runing which is the os(operating system)*/

//check to see if the specifiedEnvironmentName is defined
var exportEnvironment = typeof(environments[specifiedEnvironment]) === 'object' ? environments[specifiedEnvironment] : environments['staging'];

module.exports = exportEnvironment;