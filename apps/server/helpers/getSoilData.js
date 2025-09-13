export const getSoilData = async (latitude, longitude) => {
  try {
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url);
    const data = await response.json();
    const layers = data?.properties?.layers || [];

    const getLayerValues = (name) => {
      const layer = layers.find((l) => l.name === name);
      if (!layer) return null;
      return layer.depths[0]?.values?.mean;
    };

    const phValue = getLayerValues('phh2o');
    const nitrogenValue = getLayerValues('nitrogen');
    const clayContent = getLayerValues('clay');
    const organicCarbon = getLayerValues('soc');

    return {
      ph: phValue ? (phValue / 10).toFixed(2) : null,
      nitrogen: nitrogenValue,
      clayContent,
      organicCarbon,
    };
  } catch (error) {
    console.error('Error in getSoilData:', error);
    return {};
  }
};
