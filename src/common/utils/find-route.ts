import { routeData } from '../helpers/route-data.js';
import { getSimilarity } from './get-similarity.js';



export function findRoute(destination) {
  if (!destination) return null;

  const searchKey = destination.toLowerCase().trim();

  // --- 1-BOSQICH: Aniq moslikni qidirish (Exact Match) ---
  for (const country of routeData) {
    for (const region of country.regions || []) {
      const isExactMatch = region.alias?.some(
        (alias) => alias.toLowerCase() === searchKey
      );

      if (isExactMatch) {
        return {
          country: {
            indexedName: country.indexedName || null,
            name: country.countryNameLat || null,
          },
          region: {
            indexedName: region.indexedName || null,
            name: region.name || null,
          },
          matchType: 'exact',
        };
      }
    }
  }
  console.log('fuzzy ishladi');

  // --- 2-BOSQICH: Agar aniq topilmasa, o'xshashlikni qidirish (Fuzzy Match) ---
  const THRESHOLD = 0.75;
  let bestMatch = { route: null, region: null, score: 0 };

  routeData.forEach((country) => {
    country.regions?.forEach((region) => {
      region.alias?.forEach((alias) => {
        const score = getSimilarity(searchKey, alias);

        if (score > THRESHOLD && score > bestMatch.score) {
          bestMatch = { route: country, region: region, score: score };
        }
      });
    });
  });

  return {
    country: {
      indexedName: bestMatch.route?.indexedName || null,
      name: bestMatch.route?.countryNameLat || null,
    },
    region: {
      indexedName: bestMatch.region?.indexedName || null,
      name: bestMatch.region?.name || null,
    },
    matchScore: bestMatch.score,
    matchType: bestMatch.score > 0 ? 'fuzzy' : 'none',
  };
}
