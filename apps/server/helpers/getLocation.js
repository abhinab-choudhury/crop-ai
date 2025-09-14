export const getLocation = async (country, state, city) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`,
    );
    const result = await response.json();

    const match = result.results.find(
      (place) =>
        place.country?.toLowerCase() === country.toLowerCase() &&
        place.admin1?.toLowerCase() === state.toLowerCase() &&
        place.name?.toLowerCase() === city.toLowerCase(),
    );

    if (!match) return {};
    return { latitude: match.latitude, longitude: match.longitude };
  } catch (error) {
    console.error('Error in getLocation:', error);
    return {};
  }
};
