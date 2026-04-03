/// <reference types="google-maps" />
export default async function initJSONMap(): Promise<void> {
  const customStyle = [
    {
      stylers: [
        {
          hue: "#dd0d0d",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          lightness: 100,
        },
        {
          visibility: "simplified",
        },
      ],
    },
  ];
  const { Map } = (await google.maps.importLibrary(
    "maps",
  )) as google.maps.MapsLibrary;
  new Map(document.querySelector(".map") as HTMLElement, {
    center: { lat: -25.344, lng: 131.031 },
    zoom: 12,
    styles: customStyle,
    mapTypeControl: false,
  });
}
