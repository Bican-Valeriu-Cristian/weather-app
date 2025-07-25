export const getCoords = () =>
  new Promise((resolve, reject) => {
    const fallbackToIp = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        resolve({
          latitude: data.latitude,
          longitude: data.longitude,
          source: 'ip',
        });
      } catch {
        reject(new Error('Nu am putut determina locația.'));
      }
    };

    if (!navigator.geolocation) {
      return fallbackToIp();
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          source: 'gps',
        });
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        fallbackToIp();
      },
      {
        timeout: 5000,
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  });
