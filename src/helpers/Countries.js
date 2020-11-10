export const Countries = [
  {id: 2, title: 'Amerika', currency: '\u0024', key: 'usa'},
  {id: 1, title: 'Türkiyə', currency: '\u20ba', key: 'tr'},
  {id: 3, title: 'BƏƏ', currency: '\u0024', key: 'uae'},
  {id: 4, title: 'Rusiya', currency: '\u20bd', key: 'rus'},
];

export const getCountry = (id) =>
  Countries.find((country) => country.id === id);
