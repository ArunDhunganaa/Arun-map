export default async function initRadiusMap(): Promise<void> {
  const [{}, { AdvancedMarkerElement, PinElement }] = await Promise.all([
    google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
    google.maps.importLibrary(
      "geometry",
    ) as Promise<google.maps.GeometryLibrary>,
  ]);

  const mapElement = document.querySelector(
    ".radius-map",
  ) as google.maps.MapElement;
  const innerMap = mapElement.innerMap;

  const branches: Array<{
    position: google.maps.LatLngLiteral;
    name: string;
    address: string;
  }> = [
    {
      position: { lat: 27.7172, lng: 85.324 },
      name: "New Road Branch",
      address: "New Road, Kathmandu",
    },
    {
      position: { lat: 27.715, lng: 85.318 },
      name: "Thamel Branch",
      address: "Thamel, Kathmandu",
    },
    {
      position: { lat: 27.721, lng: 85.328 },
      name: "Maharajgunj Branch",
      address: "Maharajgunj, Kathmandu",
    },
    {
      position: { lat: 27.719, lng: 85.315 },
      name: "Lazimpat Branch",
      address: "Lazimpat, Kathmandu",
    },
    {
      position: { lat: 27.713, lng: 85.332 },
      name: "Baneshwor Branch",
      address: "Baneshwor, Kathmandu",
    },
    {
      position: { lat: 27.708, lng: 85.321 },
      name: "Patan Branch",
      address: "Patan, Lalitpur",
    },
    {
      position: { lat: 27.725, lng: 85.362 },
      name: "Boudha Branch",
      address: "Boudha, Kathmandu",
    },
    {
      position: { lat: 27.693, lng: 85.342 },
      name: "Bhaktapur Branch",
      address: "Bhaktapur",
    },
  ];

  let radiusMeters = 2000;
  let userLocation: google.maps.LatLngLiteral | null = null;
  let userMarker: google.maps.marker.AdvancedMarkerElement | null = null;
  let radiusCircle: google.maps.Circle | null = null;
  let branchMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
  let openInfoWindow: google.maps.InfoWindow | null = null;

  function getDistance(
    a: google.maps.LatLngLiteral,
    b: google.maps.LatLngLiteral,
  ): number {
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(a),
      new google.maps.LatLng(b),
    );
  }

  function formatDistance(meters: number): string {
    return meters >= 1000
      ? `${(meters / 1000).toFixed(1)} km`
      : `${Math.round(meters)} m`;
  }

  function createBranchInfoWindow(
    branch: (typeof branches)[number],
    distance: number,
  ): google.maps.InfoWindow {
    return new google.maps.InfoWindow({
      content: `
        <div style="font-family:system-ui,sans-serif; width:210px; padding:8px; line-height:1.6;">
          <div style="font-size:20px; margin-bottom:4px;">🏦</div>
          <div style="font-weight:700; font-size:14px; color:#111;">${branch.name}</div>
          <div style="font-size:12px; color:#6B7280; margin-bottom:6px;">${branch.address}</div>
          <div style="
            padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600;
            background:#EEF2FF; color:#4F46E5; display:inline-block;
          ">📍 ${formatDistance(distance)} away</div>
        </div>`,
    });
  }

  function renderBranches() {
    branchMarkers.forEach((m) => (m.map = null));
    branchMarkers = [];
    openInfoWindow?.close();

    if (!userLocation) return;

    if (radiusCircle) {
      radiusCircle.setCenter(userLocation);
      radiusCircle.setRadius(radiusMeters);
    }

    let nearbyCount = 0;

    branches.forEach((branch) => {
      const distance = getDistance(userLocation!, branch.position);
      const isNearby = distance <= radiusMeters;
      if (isNearby) nearbyCount++;

      const pin = new PinElement({
        background: isNearby ? "#4F46E5" : "#9CA3AF",
        borderColor: isNearby ? "#3730A3" : "#6B7280",
        glyphColor: "#ffffff",
        glyph: isNearby ? "🏦" : "🏦",
        scale: isNearby ? 1.1 : 0.9,
      });

      const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: branch.position,
        title: branch.name,
        content: pin.element,
      });

      const infoWindow = createBranchInfoWindow(branch, distance);
      marker.addListener("click", () => {
        openInfoWindow?.close();
        infoWindow.open({ map: innerMap, anchor: marker });
        openInfoWindow = infoWindow;
      });

      branchMarkers.push(marker);
    });
  }

  function placeUserMarker(location: google.maps.LatLngLiteral) {
    userLocation = location;

    if (userMarker) userMarker.map = null;

    const userEl = document.createElement("div");
    userEl.innerHTML = `
      <div style="
        width:44px; height:44px;
        background:#10B981; border:3px solid #fff;
        border-radius:50%; box-shadow:0 2px 12px rgba(16,185,129,0.5);
        display:flex; align-items:center; justify-content:center;
        font-size:20px;
      ">📍</div>`;

    userMarker = new AdvancedMarkerElement({
      map: innerMap,
      position: userLocation,
      title: "Your Location",
      content: userEl,
    });

    if (!radiusCircle) {
      radiusCircle = new google.maps.Circle({
        map: innerMap,
        center: userLocation,
        radius: radiusMeters,
        fillColor: "#4F46E5",
        fillOpacity: 0.08,
        strokeColor: "#4F46E5",
        strokeWeight: 2,
        strokeOpacity: 0.6,
      });
    }

    innerMap.panTo(userLocation);
    renderBranches();
  }

  const gpsBtn = document.querySelector(".radius-gps-btn") as HTMLButtonElement;
  if (gpsBtn) {
    gpsBtn.addEventListener("click", () => {
      gpsBtn.textContent = "Locating...";
      gpsBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          placeUserMarker({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          gpsBtn.textContent = "📍 Update Location";
          gpsBtn.disabled = false;
        },
        () => {
          placeUserMarker({ lat: 27.7172, lng: 85.324 });
          gpsBtn.textContent = "📍 Use My Location";
          gpsBtn.disabled = false;
        },
      );
    });
  }

  const slider = document.querySelector(".radius-slider") as HTMLInputElement;
  const sliderLabel = document.querySelector(".radius-label") as HTMLElement;
  if (slider) {
    slider.addEventListener("input", () => {
      radiusMeters = parseInt(slider.value);
      if (sliderLabel) sliderLabel.textContent = formatDistance(radiusMeters);
      if (userLocation) renderBranches();
    });
  }

  innerMap.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (e.latLng) placeUserMarker(e.latLng.toJSON());
  });

  innerMap.addListener("click", () => openInfoWindow?.close());
}
