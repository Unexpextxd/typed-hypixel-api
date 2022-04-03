const util = require('util')
const { promises: fs } = require('fs')
const { request } = require('../build/index.js')

const exec = util.promisify(require('child_process').exec)

if (!process.env.API_KEY)
	// if there's no hypixel keys in env, run dotenv
	require('dotenv').config()

if (!process.env.API_KEY)
	throw new Error('No API key found in env')

async function writeTestData(typeName, data) {
	const writingData = `import { ${typeName} } from '../src'

const typedData: ${typeName} = ${JSON.stringify(data, null, '\t')}`

	await fs.writeFile('test/_test_data.ts', writingData)
}

async function testData(typeName, data) {
	await writeTestData(typeName, data.data)
	try {
		await exec('npx tsc')
	} catch (err) {
		console.error(err.stdout)
		throw new Error(err)
	}
	console.log('\x1b[32m%s\x1b[0m', '✓', 'Passed', typeName)
}

console.log('Running tests. This will take a few moments, be patient!');

(async () => {
	await exec('cd test')

	await testData('SkyBlockProfilesResponse', await request('skyblock/profiles', {
		uuid: '26398ec782e5440cbcbb94c58b8b60a2',
		key: process.env.API_KEY
	}, true))
	await testData('SkyBlockProfilesResponse', await request('skyblock/profiles', {
		uuid: '16751f79c0b14e53a0b590d31fc1d80d',
		key: process.env.API_KEY
	}, true))
	await testData('SkyBlockProfilesResponse', await request('skyblock/profiles', {
		uuid: '974b2a9e0d6d41819dd18a05fb228965',
		key: process.env.API_KEY
	}, true))

	await testData('SkyBlockProfileResponse', await request('skyblock/profile', {
		profile: '64722047f9b34e69b67b76a62351eb05',
		key: process.env.API_KEY
	}, true))

	await testData('PlayerDataResponse', await request('player', {
		uuid: '16751f79c0b14e53a0b590d31fc1d80d',
		key: process.env.API_KEY
	}, true))

	await testData('GuildResponse', await request('guild', {
		key: process.env.API_KEY,
		name: 'SkyComm'
	}, true))

	await testData('RankedSkywarsResponse', await request('player/ranked/skywars', {
		key: process.env.API_KEY,
		uuid: 'a91bd7ca5d4b4846990bf4393727f279'
	}, true))

	await testData('GamesInformationResponse', await request('resources/games', {}, true))
	await testData('ChallengesResponse', await request('resources/challenges', {}, true))
	await testData('AchievementsResponse', await request('resources/achievements', {}, true))

	console.log('\x1b[32m%s\x1b[0m', '✓ Everything passed.', 'Good job! :)')
})()
