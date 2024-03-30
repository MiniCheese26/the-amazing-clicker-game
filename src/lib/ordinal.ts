const enOrdinalRules = new Intl.PluralRules('en-GB', { type: 'ordinal' });

const suffixes = new Map([
	['one', 'st'],
	['two', 'nd'],
	['few', 'rd'],
	['other', 'th']
]);

const formatOrdinals = (n: number) => {
	const rule = enOrdinalRules.select(n);
	const suffix = suffixes.get(rule);
	return `${n}${suffix}`;
};

export default formatOrdinals;
