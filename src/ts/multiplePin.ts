/// <reference types="google-maps" />
export default async function initProjectMap(): Promise<void> {
  const [{}, { AdvancedMarkerElement, PinElement }] = await Promise.all([
    google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
  ]);

  const mapElement = document.querySelector(
    ".gmp-map-2",
  ) as google.maps.MapElement;
  const innerMap = mapElement.innerMap;

  // --- 1. Custom theme ---
  innerMap.setOptions({
    mapTypeControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#1a1a2e" }],
      },
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#8892b0" }],
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#1a1a2e" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#0f3460" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#16213e" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#e94560" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c73652" }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#16213e" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#1b4332" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#16213e" }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#16213e" }],
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#e94560" }],
      },
    ],
  });

  const locations: Array<{
    position: google.maps.LatLngLiteral;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    pin: { background: string; borderColor: string; glyph: string };
  }> = [
    {
      position: { lat: 27.9881, lng: 86.925 },
      title: "Mount Everest",
      description:
        "The world's highest peak at 8,849 m, in the Khumbu region of the Himalayas.",
      tags: ["Trekking", "Heritage"],
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1688645554172-d3aef5f837ce?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      pin: { background: "#e94560", borderColor: "#c73652", glyph: "①" },
    },
    {
      position: { lat: 28.2096, lng: 83.9856 },
      title: "Pokhara & Phewa Lake",
      description:
        "A lakeside city with stunning Annapurna views, famous for paragliding and boating.",
      tags: ["Scenic", "Adventure"],
      imageUrl:
        "https://images.unsplash.com/photo-1610997686651-98492fd08108?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9raGFyYXxlbnwwfHwwfHx8MA%3D%3D",
      pin: { background: "#4cc9f0", borderColor: "#3a9fc0", glyph: "②" },
    },
    {
      position: { lat: 27.7172, lng: 85.324 },
      title: "Kathmandu Valley",
      description:
        "Nepal's capital, home to seven UNESCO World Heritage Sites including Pashupatinath and Boudhanath.",
      tags: ["Culture", "Heritage"],
      imageUrl:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1633&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      pin: { background: "#f8961e", borderColor: "#d4791a", glyph: "③" },
    },
    {
      position: { lat: 27.5291, lng: 84.3542 },
      title: "Chitwan National Park",
      description:
        "UNESCO-listed jungle reserve in the Terai, home to one-horned rhinos and Bengal tigers.",
      tags: ["Wildlife", "Nature"],
      imageUrl:
        "https://images.unsplash.com/photo-1549888668-19281758dfbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpdHdhbiUyMG5hdGlvbmFsJTIwcGFya3xlbnwwfHwwfHx8MA%3D%3D",
      pin: { background: "#4caf50", borderColor: "#388e3c", glyph: "④" },
    },
    {
      position: { lat: 29.5972, lng: 82.7785 },
      title: "Rara Lake",
      description:
        "Nepal's largest lake, nestled in the remote far-western Himalayas at 2,990 m elevation.",
      tags: ["Scenic", "Trekking"],
      imageUrl:
        "https://images.unsplash.com/photo-1582652053486-68904bf868f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFyYXxlbnwwfHwwfHx8MA%3D%3D",
      pin: { background: "#7209b7", borderColor: "#560a87", glyph: "⑤" },
    },
  ];

  function createInfoWindow(
    loc: (typeof locations)[number],
  ): google.maps.InfoWindow {
    const tagsHtml = loc.tags
      .map(
        (t) => `<span style="
          display:inline-block; padding:2px 10px;
          background:rgba(233,69,96,0.15); color:#e94560;
          border:1px solid rgba(233,69,96,0.4);
          border-radius:999px; font-size:11px; margin-right:4px;
        ">${t}</span>`,
      )
      .join("");

    const imageHtml = loc.imageUrl
      ? `<img src="${loc.imageUrl}" style="
          width:100%; height:110px; object-fit:cover;
          border-radius:6px; margin-bottom:10px;
          border:1px solid rgba(255,255,255,0.08);
        "/>`
      : "";

    return new google.maps.InfoWindow({
      content: `
        <div style="
          font-family:system-ui,sans-serif;
          background:#1a1a2e; color:#ccd6f6;
          width:230px; padding:14px;
          border-radius:8px; line-height:1.5;
        ">
          ${imageHtml}
          <div style="font-weight:700; font-size:15px; margin-bottom:4px; color:#e6f1ff;">
            ${loc.title}
          </div>
          <div style="font-size:12px; color:#8892b0; margin-bottom:10px;">
            ${loc.description}
          </div>
          <div>${tagsHtml}</div>
        </div>`,
      disableAutoPan: false,
    });
  }

  let openInfoWindow: google.maps.InfoWindow | null = null;

  locations.forEach((loc) => {
    const pin = new PinElement({
      background: loc.pin.background,
      borderColor: loc.pin.borderColor,
      glyphColor: "#ffffff",
      glyph: loc.pin.glyph,
      scale: 1.1,
    });

    const marker = new AdvancedMarkerElement({
      map: innerMap,
      position: loc.position,
      title: loc.title,
      content: pin.element,
    });

    const infoWindow = createInfoWindow(loc);

    marker.addListener("click", () => {
      openInfoWindow?.close();
      infoWindow.open({ map: innerMap, anchor: marker });
      openInfoWindow = infoWindow;
    });
  });

  innerMap.addListener("click", () => openInfoWindow?.close());
}
