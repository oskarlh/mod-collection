function bigintMin(a: bigint, b: bigint): bigint {
	return a < b ? a : b;
}

function roundDownToNearest(num : bigint, denominator : bigint): bigint {
	if (num < 0n) {
		if (denominator < 0n) {
			denominator = -denominator;
		}
		num -= denominator - 1n;
	}
	return num - (num % denominator);
}

function roundUpToNearest(num: bigint, denominator: bigint): bigint {
	if (denominator < 0n) {
		denominator = -denominator;
	}
	return roundDownToNearest(num + denominator - 1n, denominator);
}

function timeOfNextRun(timeNow: bigint): bigint {
	const {
		minTimeBetweenEndAndFollowingStart,
		minTimeBetweenStarts,
		lastRunEnded,
		lastRunStarted,
		optimalAverageTimeBetweenStarts,
		runsSinceFirstRun,
		skipMissedPeriods = true,
		timeOfFirstRun,
	} = {};
	if (timeOfFirstRun === undefined) {
		return timeNow;
	}
	if (timeOfFirstRun >= timeNow) {
		return timeOfFirstRun;
	}
	let result = timeOfFirstRun + (runsSinceFirstRun + 1n) * optimalAverageTimeBetweenStarts;
	if(result < )
	min = bigintMin(min, //lastRunStarted - );
	//const next = timeOfFirstRun + runsSinceFirstRun * optimalAverageTimeBetweenStarts;
}
