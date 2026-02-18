/* eslint-disable import/no-extraneous-dependencies */
const withTM = require("next-transpile-modules")([
	"@mui/material",
	"@mui/system",
	"@mui/icons-material", // If @mui/icons-material is being used
]);

function getFormattedDate(date, format = "DD/MM/YYYY") {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return format
		.replace("DD", String(day).padStart(2, "0"))
		.replace("MM", String(month).padStart(2, "0"))
		.replace("YYYY", year)
		.replace("HH", String(hour).padStart(2, "0"))
		.replace("mm", String(minute).padStart(2, "0"))
		.replace("ss", String(second).padStart(2, "0"));
}

const withPlugins = require("next-compose-plugins");
const generateBuildId = () => getFormattedDate(new Date(), "YYYYMMDDHHmmss");

const plugins = [];

const buildID = generateBuildId();

const nextConfigs = {
	assetPrefix: undefined,
	poweredByHeader: false,
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		const customPlugins = [
			new webpack.DefinePlugin({
				"process.env.BUILD_ID": JSON.stringify(buildId),
			}),
		];
		config.plugins.push(...customPlugins);
		return config;
	},
	output: "standalone",
	outputFileTracingRoot: __dirname,

	compiler: {
		styledComponents: true,
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	// env: {
	// 	BUILD_ID: buildID,
	// },
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "nas-server.thuannc.com",
				port: "",
				pathname: "/fbdownload/**",
			},
			{
				protocol: "https",
				hostname: "drive.usercontent.google.com",
				port: "",
				pathname: "/download/**",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/debnyyphn/**",
			},
			{
				protocol: "http",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/debnyyphn/**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
		],
	},

	pageExtensions: ["js", "ts", "tsx"],
};

module.exports = withPlugins(plugins, nextConfigs);
