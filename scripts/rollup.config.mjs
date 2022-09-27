import jetpack from 'fs-jetpack';
import path from 'path';
import { config } from 'dotenv';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import typescriptPlugin from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import jsonPlugin from '@rollup/plugin-json';
import { blueBright, greenBright, redBright } from 'colorette';

config({
	path: path.resolve('.env')
});

const buildOutput = 'dist';
const isProduction = process.env.NODE_ENV === 'production';
const sourcePath = path.resolve('src');
const pkgJson = jetpack.read('package.json', 'json');
const localInstalledPackages = [...Object.keys(pkgJson.dependencies)];

/**
 * Resolve given path by fs-jetpack
 */
function resolvePath(pathParts) {
	return jetpack.path(...pathParts);
}

/**
 * Generate success console message
 */
function successMessage(message, type = 'Success') {
	console.log(`[${greenBright(type)}] ${message}`);
}

/**
 * Generate error console message
 */
function errorMessage(message, type = 'Error') {
	console.log(`[${redBright(type)}] ${message}`);
}

/**
 * Copy given source to destination
 */
function copy(source, destination, options = { overwrite: true }) {
	return jetpack.copy(source, destination, options);
}

/**
 * CleanUp the build output
 */
function cleanUp() {
	if (!jetpack.exists(buildOutput)) {
		return;
	}

	const preserved = [
		'node_modules/**/*',
		'ragemp-server*',
		'.env',
		'BugTrap-x64.dll',
		'bin/**/*',
		'dotnet/**/*',
		'maps/**/*',
		'plugins/**/*',
		'pnpm-lock.yaml',
		'package-lock.json',
		'yarn.lock'
	];

	const removeablePaths = jetpack.find('dist', {
		matching: preserved.map((path) => `!${path}`),
		directories: false
	});

	removeablePaths.forEach((path) => {
		jetpack.remove(path);
		errorMessage(path, 'Removed');
	});
}

/**
 * Copy all static files they needed
 */
function copyFiles() {
	const prepareForCopy = [];

	prepareForCopy.push(
		{
			from: jetpack.path('package.json'),
			to: jetpack.path(buildOutput, 'package.json')
		},
		{
			from: jetpack.path('.env'),
			to: jetpack.path(buildOutput, '.env')
		},
		{
			from: jetpack.path('conf.json'),
			to: jetpack.path(buildOutput, 'conf.json')
		}
	);

	prepareForCopy.forEach((item) => {
		copy(item.from, item.to);
		successMessage(blueBright(`${item.from} -> ${item.to}`), 'Copied');
	});
}

copyFiles();

const productionMode = isProduction
	? terser({
			keep_classnames: true,
			keep_fnames: true,
			output: {
				comments: false
			}
	  })
	: [];

export default [
	{
		input: resolvePath([sourcePath, 'server', 'index.ts']),
		output: {
			file: resolvePath([buildOutput, 'packages', 'core', 'index.js']),
			format: 'cjs'
		},
		plugins: [
			nodeResolvePlugin(),
			jsonPlugin(),
			typescriptPlugin({
				check: true,
				tsconfig: resolvePath([sourcePath, 'server', 'tsconfig.json'])
			}),
			productionMode
		],
		external: [...localInstalledPackages],
		inlineDynamicImports: true
	},
	{
		input: resolvePath([sourcePath, 'client', 'index.ts']),
		output: {
			file: resolvePath([buildOutput, 'client_packages', 'index.js']),
			format: 'cjs'
		},
		plugins: [
			nodeResolvePlugin(),
			jsonPlugin(),
			typescriptPlugin({
				check: true,
				tsconfig: resolvePath([sourcePath, 'client', 'tsconfig.json'])
			}),
			productionMode
		],
		inlineDynamicImports: true
	}
];
