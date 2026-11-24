// Turns things like "moderate rain" into "Moderate Rain" so it looks nicer in the card
function toTitleCase(value = "") {
  return value.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}

// Figures out which city to ask OpenWeather for based on profile.json
export function getWeatherLocationFromProfile(profile) {
  const customLocation = profile?.weather?.location?.trim();
  if (customLocation) {
    return customLocation;
  }

  // If there's no custom weather location, grab the city part from the timezone (e.g. "America/Edmonton")
  const timeZone = profile?.timeZone?.zone;
  if (timeZone && timeZone.includes("/")) {
    const cityFromTimeZone = timeZone.split("/").pop().replace(/_/g, " ");
    if (cityFromTimeZone) {
      return cityFromTimeZone;
    }
  }

  const contactLocation = profile?.contacts?.location?.trim();
  return contactLocation || "Edmonton";
}

// Calls OpenWeather on the server side and returns a clean object for WeatherCard
export async function getWeatherForProfile(profile, apiKey) {
  const location = getWeatherLocationFromProfile(profile);

  // Skip the API call if we don't have a key set up yet
  if (!apiKey) {
    return {
      location,
      error: "Add your weather API key in local environment settings to show live weather.",
    };
  }

  const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  weatherUrl.searchParams.set("q", location);
  weatherUrl.searchParams.set("units", "metric");
  weatherUrl.searchParams.set("appid", apiKey);

  try {
    const response = await fetch(weatherUrl.toString());
    if (!response.ok) {
      throw new Error(`OpenWeather request failed with ${response.status}`);
    }

    const data = await response.json();
    const current = data?.weather?.[0] || {};
    const locationLabel = [data?.name, data?.sys?.country]
      .filter(Boolean)
      .join(", ");

    return {
      location: locationLabel || location,
      temperatureC: data?.main?.temp ?? null,
      description: toTitleCase(current?.description || ""),
      iconUrl: current?.icon
        ? `https://openweathermap.org/img/wn/${current.icon}@2x.png`
        : null,
    };
  } catch {
    return {
      location,
      error: "Unable to load current weather right now.",
    };
  }
}
