export default async function initNearbyPlaces(): Promise<void> {
  const [{}, { AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
  ]);

  const mapElement = document.querySelector(
    ".nearby-map",
  ) as google.maps.MapElement;
  const innerMap = mapElement.innerMap;

  innerMap.setOptions({ mapTypeControl: false });

  const places: Array<{
    position: google.maps.LatLngLiteral;
    name: string;
    type: string;
    rating: number;
    address: string;
    open: boolean;
    icon: string;
    color: string;
    borderColor: string;
  }> = [
    {
      position: { lat: 27.7172, lng: 85.324 },
      name: "Nepal Investment Bank",
      type: "Bank",
      rating: 4.2,
      address: "New Road, Kathmandu",
      open: true,
      icon: "🏦",
      color: "#4F46E5",
      borderColor: "#3730A3",
    },
    {
      position: { lat: 27.715, lng: 85.321 },
      name: "Himalayan Coffee House",
      type: "Cafe",
      rating: 4.7,
      address: "Thamel, Kathmandu",
      open: true,
      icon: "☕",
      color: "#92400E",
      borderColor: "#78350F",
    },
    {
      position: { lat: 27.719, lng: 85.327 },
      name: "Kathmandu Medical Center",
      type: "Hospital",
      rating: 4.5,
      address: "Maharajgunj, Kathmandu",
      open: true,
      icon: "🏥",
      color: "#DC2626",
      borderColor: "#B91C1C",
    },
    {
      position: { lat: 27.713, lng: 85.319 },
      name: "Bhatbhateni Supermarket",
      type: "Supermarket",
      rating: 4.3,
      address: "Lazimpat, Kathmandu",
      open: false,
      icon: "🛒",
      color: "#059669",
      borderColor: "#047857",
    },
    {
      position: { lat: 27.721, lng: 85.322 },
      name: "Thamel Guesthouse",
      type: "Hotel",
      rating: 4.1,
      address: "Thamel, Kathmandu",
      open: true,
      icon: "🏨",
      color: "#D97706",
      borderColor: "#B45309",
    },
    {
      position: { lat: 27.716, lng: 85.329 },
      name: "Roadhouse Cafe",
      type: "Restaurant",
      rating: 4.6,
      address: "Thamel, Kathmandu",
      open: true,
      icon: "🍽️",
      color: "#E94560",
      borderColor: "#C73652",
    },
  ];

  const types = [
    "All",
    "Bank",
    "Cafe",
    "Hospital",
    "Supermarket",
    "Hotel",
    "Restaurant",
  ];
  let activeType = "All";
  let markers: google.maps.marker.AdvancedMarkerElement[] = [];
  let openInfoWindow: google.maps.InfoWindow | null = null;

  function createInfoWindow(
    place: (typeof places)[number],
  ): google.maps.InfoWindow {
    const stars =
      "★".repeat(Math.floor(place.rating)) +
      "☆".repeat(5 - Math.floor(place.rating));
    return new google.maps.InfoWindow({
      content: `
        <div style="padding:8px;">
          <div style="font-size:24px; margin-bottom:6px;">${place.icon}</div>
          <div style="font-weight:700; font-size:15px; color:#111;">${place.name}</div>
          <div style="font-size:12px; color:#6B7280; margin-bottom:6px;">${place.address}</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span style="color:#F59E0B; font-size:13px;">${stars}</span>
            <span style="font-size:12px; color:#374151;">${place.rating}/5</span>
          </div>
          <div style="display:flex; gap:8px;">
            <span style="
              padding:2px 10px; border-radius:999px; font-size:11px;
              background:#EEF2FF; color:#4F46E5;
            ">${place.type}</span>
            <span style="
              padding:2px 10px; border-radius:999px; font-size:11px;
              background:${place.open ? "#D1FAE5" : "#FEE2E2"};
              color:${place.open ? "#065F46" : "#991B1B"};
            ">${place.open ? "Open" : "Closed"}</span>
          </div>
        </div>`,
    });
  }

  function renderMarkers() {
    markers.forEach((m) => (m.map = null));
    markers = [];
    openInfoWindow?.close();

    const filtered =
      activeType === "All"
        ? places
        : places.filter((p) => p.type === activeType);

    filtered.forEach((place) => {
      const el = document.createElement("div");
      el.innerHTML = `<div style=" width:38px; height:38px;
          background:${place.color};
           border:2px solid ${place.borderColor};
          border-radius:50%; box-shadow:0 2px 8px rgba(0,0,0,0.3);
          display:flex; align-items:center; justify-content:center;
          font-size:18px; cursor:pointer;
          transition: transform 0.2s;">${place.icon}</div>`;

      const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: place.position,
        title: place.name,
        content: el,
      });

      const infoWindow = createInfoWindow(place);
      marker.addListener("click", () => {
        openInfoWindow?.close();
        infoWindow.open({ map: innerMap, anchor: marker });
        openInfoWindow = infoWindow;
      });

      markers.push(marker);
    });
  }

  const controls = document.querySelector(".nearby-controls") as HTMLElement;
  if (controls) {
    controls.innerHTML = types
      .map(
        (t) => `
        <button data-type="${t}" style="
          padding:6px 14px; border-radius:999px; border:none;
          background:${t === "All" ? "#4F46E5" : "#E5E7EB"};
          color:${t === "All" ? "#fff" : "#374151"};
          font-size:13px; cursor:pointer; font-weight:500;
          transition: all 0.2s;
        ">${t}</button>`,
      )
      .join("");
    controls.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      activeType = btn.dataset.type!;
      controls.querySelectorAll("button").forEach((b) => {
        const isActive = b.dataset.type === activeType;
        (b as HTMLElement).style.background = isActive ? "#4F46E5" : "#E5E7EB";
        (b as HTMLElement).style.color = isActive ? "#fff" : "#374151";
      });
      renderMarkers();
    });
  }
  innerMap.addListener("click", () => openInfoWindow?.close());
  renderMarkers();
}
