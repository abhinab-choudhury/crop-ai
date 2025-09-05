module.exports = (api) => {
	api.cache(true);
	const plugins = [
		[
			"module-resolver",
			{
				root: ["./"],
				alias: {
					"@": "./",
				},
			},
		],
	];
	plugins.push("react-native-reanimated/plugin");

	return {
		presets: [
			["babel-preset-expo", { jsxImportSource: "nativewind" }],
			"nativewind/babel",
		],
		plugins,
	};
};
