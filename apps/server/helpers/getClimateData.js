export const getHistoricalClimateData = async (latitude, longitude) => {
  try {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);

    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${formatDate(
      startDate,
    )}&end_date=${formatDate(
      endDate,
    )}&daily=temperature_2m_mean,relative_humidity_2m_mean,precipitation_sum`;

    const response = await fetch(apiUrl);
    const result = await response.json();
    const daily = result.daily;

    if (!daily || !daily.time || daily.time.length === 0) {
      return {};
    }

    const days = daily.time.length;

    const totalHumidity = daily.relative_humidity_2m_mean.reduce((sum, val) => sum + (val || 0), 0);
    const avgHumidity = totalHumidity / days;

    const totalPrecipitation = daily.precipitation_sum.reduce((sum, val) => sum + (val || 0), 0);

    const totalTemp = daily.temperature_2m_mean.reduce((sum, val) => sum + (val || 0), 0);
    const avgTemperature = totalTemp / days;

    return { totalPrecipitation, avgTemperature, avgHumidity };
  } catch (error) {
    console.error('Error in getHistoricalClimateData:', error);
    return {};
  }
};
