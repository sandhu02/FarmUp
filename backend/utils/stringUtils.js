// backend/utils/stringUtils.js

/**
 * Normalize a city name by removing accents
 * e.g. "Bahāwalnagar" -> "Bahawalnagar"
 */
function normalizeCity(city) {
  if (!city) return "";
  return city
    .normalize("NFD")                   // Decompose accents
    .replace(/[\u0300-\u036f]/g, "")    // Remove diacritical marks
    .trim();
}

module.exports = {
  normalizeCity
};
