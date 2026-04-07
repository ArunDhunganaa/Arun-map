import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default async function initClusterMap(): Promise<void> {
  const [{ InfoWindow }, { AdvancedMarkerElement, PinElement }] =
    await Promise.all([
      google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
      google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
    ]);

  const mapElement = document.querySelector(
    ".cluster-map",
  ) as google.maps.MapElement;
  const innerMap = mapElement.innerMap;

  innerMap.setOptions({ mapTypeControl: false });

  const branches: Array<{
    position: google.maps.LatLngLiteral;
    name: string;
    city: string;
    phone: string;
  }> = [
    {
      position: { lat: 27.7172, lng: 85.324 },
      name: "Kathmandu HQ",
      city: "Kathmandu",
      phone: "01-4567890",
    },
    {
      position: { lat: 27.715, lng: 85.318 },
      name: "Thamel Branch",
      city: "Kathmandu",
      phone: "01-4567891",
    },
    {
      position: { lat: 27.721, lng: 85.328 },
      name: "Maharajgunj Branch",
      city: "Kathmandu",
      phone: "01-4567892",
    },
    {
      position: { lat: 27.719, lng: 85.315 },
      name: "Lazimpat Branch",
      city: "Kathmandu",
      phone: "01-4567893",
    },
    {
      position: { lat: 27.713, lng: 85.332 },
      name: "Baneshwor Branch",
      city: "Kathmandu",
      phone: "01-4567894",
    },
    {
      position: { lat: 27.708, lng: 85.321 },
      name: "Patan Branch",
      city: "Lalitpur",
      phone: "01-5567890",
    },
    {
      position: { lat: 27.703, lng: 85.315 },
      name: "Jawalakhel Branch",
      city: "Lalitpur",
      phone: "01-5567891",
    },
    {
      position: { lat: 27.693, lng: 85.342 },
      name: "Bhaktapur Branch",
      city: "Bhaktapur",
      phone: "01-6612345",
    },
    {
      position: { lat: 27.689, lng: 85.337 },
      name: "Suryabinayak Branch",
      city: "Bhaktapur",
      phone: "01-6612346",
    },
    {
      position: { lat: 27.725, lng: 85.362 },
      name: "Boudha Branch",
      city: "Kathmandu",
      phone: "01-4789012",
    },
    {
      position: { lat: 28.2096, lng: 83.9856 },
      name: "Pokhara Main",
      city: "Pokhara",
      phone: "061-123456",
    },
    {
      position: { lat: 28.215, lng: 83.979 },
      name: "Lakeside Branch",
      city: "Pokhara",
      phone: "061-123457",
    },
    {
      position: { lat: 28.205, lng: 83.991 },
      name: "Mahendrapul Branch",
      city: "Pokhara",
      phone: "061-123458",
    },
    {
      position: { lat: 27.5291, lng: 84.354 },
      name: "Bharatpur Branch",
      city: "Chitwan",
      phone: "056-123456",
    },
    {
      position: { lat: 27.522, lng: 84.361 },
      name: "Narayanghat Branch",
      city: "Chitwan",
      phone: "056-123457",
    },
    {
      position: { lat: 26.465, lng: 87.283 },
      name: "Biratnagar Main",
      city: "Biratnagar",
      phone: "021-123456",
    },
    {
      position: { lat: 26.471, lng: 87.279 },
      name: "Traffic Chowk Branch",
      city: "Biratnagar",
      phone: "021-123457",
    },
    {
      position: { lat: 26.657, lng: 88.064 },
      name: "Birtamod Branch",
      city: "Jhapa",
      phone: "023-123456",
    },
    {
      position: { lat: 27.683, lng: 85.431 },
      name: "Banepa Branch",
      city: "Kavrepalanchok",
      phone: "011-123456",
    },
    {
      position: { lat: 27.362, lng: 85.148 },
      name: "Hetauda Branch",
      city: "Hetauda",
      phone: "057-123456",
    },
    {
      position: { lat: 28.397, lng: 80.584 },
      name: "Nepalgunj Branch",
      city: "Nepalgunj",
      phone: "081-123456",
    },
    {
      position: { lat: 28.401, lng: 80.578 },
      name: "Surkhet Road Branch",
      city: "Nepalgunj",
      phone: "081-123457",
    },
    {
      position: { lat: 27.033, lng: 84.877 },
      name: "Birgunj Branch",
      city: "Birgunj",
      phone: "051-123456",
    },
    {
      position: { lat: 27.028, lng: 84.872 },
      name: "Adarsh Nagar Branch",
      city: "Birgunj",
      phone: "051-123457",
    },
    {
      position: { lat: 28.825, lng: 83.298 },
      name: "Jomsom Branch",
      city: "Mustang",
      phone: "069-123456",
    },
    {
      position: { lat: 27.981, lng: 86.925 },
      name: "Namche Branch",
      city: "Solukhumbu",
      phone: "038-123456",
    },
    {
      position: { lat: 29.597, lng: 82.778 },
      name: "Rara Branch",
      city: "Mugu",
      phone: "087-123456",
    },
    {
      position: { lat: 26.812, lng: 87.294 },
      name: "Dharan Branch",
      city: "Sunsari",
      phone: "025-123456",
    },
    {
      position: { lat: 27.192, lng: 84.003 },
      name: "Butwal Branch",
      city: "Rupandehi",
      phone: "071-123456",
    },
    {
      position: { lat: 28.661, lng: 81.619 },
      name: "Surkhet Branch",
      city: "Surkhet",
      phone: "083-123456",
    },
  ];

  let openInfoWindow: google.maps.InfoWindow | null = null;

  function createInfoWindow(
    branch: (typeof branches)[number],
  ): google.maps.InfoWindow {
    return new InfoWindow({
      content: `
        <div style=" width:200px; padding:8px; line-height:1.6;">
          <div style="font-size:20px; margin-bottom:4px;">🏦</div>
          <div style="font-weight:700; font-size:14px; color:#111;">${branch.name}</div>
          <div style="font-size:12px; color:#6B7280; margin-bottom:4px;">${branch.city}</div>
          <div style="font-size:12px; color:#4F46E5;">📞 ${branch.phone}</div>
        </div>`,
    });
  }

  const advancedMarkers = branches.map((branch) => {
    const pin = new PinElement({
      background: "#4F46E5",
      borderColor: "#3730A3",
      glyphColor: "#ffffff",
      glyph: "🏦",
      scale: 1.0,
    });

    const marker = new AdvancedMarkerElement({
      map: innerMap,
      position: branch.position,
      title: branch.name,
      content: pin.element,
    });

    const infowindow = createInfoWindow(branch);

    marker.addEventListener("click", () => {
      openInfoWindow?.close();
      infowindow.open({ map: innerMap, anchor: marker });
      openInfoWindow = infowindow;
    });

    return marker;
  });

  new MarkerClusterer({ map: innerMap, markers: advancedMarkers });

  innerMap.addListener("class", () => openInfoWindow?.close());
}
