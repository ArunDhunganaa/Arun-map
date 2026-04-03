/// <reference types="google-maps" />
export default async function initMarkerMap(): Promise<void> {
  const [{}, { AdvancedMarkerElement, PinElement }] = await Promise.all([
    google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
  ]);

  const mapElement = document.querySelector(
    ".gmp-map-1",
  ) as google.maps.MapElement;
  const innerMap = mapElement.innerMap;

  innerMap.setOptions({ mapTypeControl: false });

  function createInfoPopup(opts: {
    title: string;
    description: string;
    imageUrl?: string;
    tags?: string[];
  }): google.maps.InfoWindow {
    const tagsHtml = (opts.tags ?? [])
      .map(
        (t) => `<span style="
          display:inline-block; padding:2px 8px;
          background:#EEF2FF; color:#4F46E5;
          border-radius:999px; font-size:11px; margin-right:4px;
        ">${t}</span>`,
      )
      .join("");

    const imageHtml = opts.imageUrl
      ? `<img src="${opts.imageUrl}" style="
          width:100%; height:120px; object-fit:cover;
          border-radius:8px; margin-bottom:10px;
        "/>`
      : "";

    return new google.maps.InfoWindow({
      content: `
        <div style="font-family:system-ui,sans-serif; width:220px; padding:4px; line-height:1.5;">
          ${imageHtml}
          <div style="font-weight:700; font-size:15px; margin-bottom:4px; color:#111;">${opts.title}</div>
          <div style="font-size:13px; color:#555; margin-bottom:8px;">${opts.description}</div>
          <div>${tagsHtml}</div>
        </div>`,
    });
  }

  let openInfoWindow: google.maps.InfoWindow | null = null;

  function attachPopup(
    marker: google.maps.marker.AdvancedMarkerElement,
    infoWindow: google.maps.InfoWindow,
  ) {
    marker.addListener("click", () => {
      openInfoWindow?.close();
      infoWindow.open({ map: innerMap, anchor: marker });
      openInfoWindow = infoWindow;
    });
  }

  const basicMarker = new AdvancedMarkerElement({
    map: innerMap,
    position: { lat: 27.7172, lng: 85.324 },
    title: "Kathmandu Durbar Square",
  });

  attachPopup(
    basicMarker,
    createInfoPopup({
      title: "Kathmandu Durbar Square",
      description:
        "Historic royal palace square with stunning Newari architecture.",
      tags: ["Heritage", "Culture"],
      imageUrl:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=320&q=80",
    }),
  );

  const pin = new PinElement({
    background: "#4F46E5",
    borderColor: "#3730A3",
    glyphColor: "#ffffff",
    glyph: "★",
    scale: 1.2,
  });

  const pinMarker = new AdvancedMarkerElement({
    map: innerMap,
    position: { lat: 27.7215, lng: 85.362 },
    title: "Boudhanath Stupa",
    content: pin.element,
  });

  attachPopup(
    pinMarker,
    createInfoPopup({
      title: "Boudhanath Stupa",
      description:
        "One of the largest stupas in the world, a major Buddhist pilgrimage site.",
      tags: ["Religion", "Heritage"],
      imageUrl:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=320&q=80",
    }),
  );

  const iconEl = document.createElement("div");
  iconEl.innerHTML = `
    <div style="
      width:40px; height:40px;
      background:#EF4444; border:3px solid #fff;
      border-radius:50%; box-shadow:0 2px 8px rgba(0,0,0,.3);
      display:flex; align-items:center; justify-content:center;
      font-size:18px; cursor:pointer;
    ">🛕</div>`;

  const htmlMarker = new AdvancedMarkerElement({
    map: innerMap,
    position: { lat: 27.7109, lng: 85.3488 },
    title: "Pashupatinath Temple",
    content: iconEl,
  });

  attachPopup(
    htmlMarker,
    createInfoPopup({
      title: "Pashupatinath Temple",
      description: "Sacred Hindu temple on the banks of the Bagmati River.",
      tags: ["Religion", "Culture"],
      imageUrl:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=320&q=80",
    }),
  );
}
