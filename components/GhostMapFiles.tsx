'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MapPin, Compass, Home, BookOpen, Info, ExternalLink, Zap } from 'lucide-react';

type LocationCategory = 'us-tour' | 'au-tour' | 'cemetery';

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: LocationCategory;
  desc: string;
  booking: string | null;
}

interface LeyLine {
  name: string;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  color: string;
  glyph: string;
}

interface LeyLineAssociation extends LeyLine {
  distance: string;
}

interface MarkerData {
  marker: any;
  location: Location;
  baseColor: string;
}

export default function GhostMapFiles() {
  const [currentPage, setCurrentPage] = useState<'home' | 'tours' | 'cemeteries' | 'about'>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [leyLinesActive, setLeyLinesActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationsNearLeyLines, setLocationsNearLeyLines] = useState<Map<number, LeyLineAssociation[]>>(new Map());
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<MarkerData[]>([]);
  const leyLineLayersRef = useRef<any[]>([]);

  // US Ghost Tours
  const usGhostTours: Location[] = [
    { id: 1, name: 'New Orleans French Quarter', lat: 29.9611, lng: -90.2680, category: 'us-tour', desc: 'Haunted Voodoo alley with spirits of Marie Laveau', booking: 'https://www.viator.com/en-US/tours/New-Orleans/French-Quarter-Ghost-Tour/d309-2716' },
    { id: 2, name: 'Chicago Gangster Tour', lat: 41.8781, lng: -87.6298, category: 'us-tour', desc: 'Al Capone era speakeasies and mob history', booking: 'https://www.viator.com/en-US/tours/Chicago/Chicago-Gangster-Tour/d311-17261' },
    { id: 3, name: 'NYC Greenwich Village', lat: 40.7347, lng: -74.0029, category: 'us-tour', desc: 'Bohemian ghosts and haunted theaters', booking: 'https://www.viator.com/en-US/tours/New-York-City/Greenwich-Village-Ghost-Tour/d308-2814' },
    { id: 4, name: 'Savannah Ghost Tour', lat: 32.0809, lng: -81.0912, category: 'us-tour', desc: 'Spanish moss graves and colonial spirits', booking: 'https://www.viator.com/en-US/tours/Savannah/Savannah-Ghost-Tour/d305-2716' },
    { id: 5, name: 'Gettysburg Battlefield', lat: 39.8090, lng: -77.2348, category: 'us-tour', desc: 'Civil War spirits still haunting the fields', booking: 'https://www.viator.com/en-US/tours/Gettysburg/Gettysburg-Battlefield-Ghost-Tour/d315-71622' },
    { id: 6, name: 'San Antonio Alamo', lat: 29.4241, lng: -98.4859, category: 'us-tour', desc: 'Fallen soldiers and paranormal encounters', booking: 'https://www.viator.com/en-US/tours/San-Antonio/San-Antonio-Ghost-Tour/d314-17261' },
    { id: 7, name: 'Boston Freedom Trail', lat: 42.3601, lng: -71.0589, category: 'us-tour', desc: 'Revolutionary war ghosts on historic streets', booking: 'https://www.viator.com/en-US/tours/Boston/Boston-Ghost-Tour/d305-2716' },
    { id: 8, name: 'Charleston Historic District', lat: 32.7765, lng: -79.9318, category: 'us-tour', desc: 'Antebellum mansions with restless spirits', booking: 'https://www.viator.com/en-US/tours/Charleston/Charleston-Ghost-Tour/d305-2716' },
    { id: 9, name: 'St. Augustine Ancient City', lat: 29.8936, lng: -81.3132, category: 'us-tour', desc: "America's oldest city, countless paranormal reports", booking: 'https://www.viator.com/en-US/tours/St-Augustine/St-Augustine-Ghost-Tour/d305-5645' },
    { id: 10, name: 'Salem Witch Trials', lat: 42.5195, lng: -70.8967, category: 'us-tour', desc: 'Haunted legacy of 1692 trials', booking: 'https://www.viator.com/en-US/tours/Salem/Salem-Ghost-Tour/d305-2716' },
  ];

  // Australian/Victorian Ghost Tours
  const auGhostTours: Location[] = [
    { id: 11, name: 'Melbourne Ghost Tour', lat: -37.8136, lng: 144.9631, category: 'au-tour', desc: 'Haunted laneways of inner Melbourne', booking: 'https://www.viator.com/en-AU/tours/Melbourne/Melbourne-Ghost-and-Laneways-Tour/d4663-17261' },
    { id: 12, name: 'Old Castlemaine Gaol', lat: -37.0660, lng: 144.2167, category: 'au-tour', desc: 'Violent hangings echo through prison walls', booking: 'https://www.viator.com/en-AU/tours/Castlemaine/Castlemaine-Gaol-Ghost-Tour/d4663-71622' },
    { id: 13, name: 'Altona Homestead', lat: -37.9142, lng: 144.7697, category: 'au-tour', desc: 'Colonial mansion with unfinished business', booking: 'https://www.viator.com/en-AU/tours/Melbourne/Altona-Homestead-Tour/d4663-2716' },
    { id: 14, name: 'Aradale Asylum', lat: -37.2640, lng: 142.1548, category: 'au-tour', desc: 'Former mental institution with tortured souls', booking: 'https://www.viator.com/en-AU/tours/Ararat/Aradale-Asylum-Tour/d4663-71622' },
    { id: 15, name: 'Old Melbourne Gaol', lat: -37.8067, lng: 144.9664, category: 'au-tour', desc: 'Ned Kelly executed, spirits remain', booking: 'https://www.viator.com/en-AU/tours/Melbourne/Old-Melbourne-Gaol-Tour/d4663-2716' },
    { id: 16, name: 'Port Arthur Convict Prison', lat: -43.1408, lng: 147.8540, category: 'au-tour', desc: "Tasmania's most haunted penal colony", booking: 'https://www.viator.com/en-AU/tours/Port-Arthur/Port-Arthur-Ghost-Tour/d4663-71622' },
    { id: 17, name: 'Pentridge Prison', lat: -37.7668, lng: 144.9892, category: 'au-tour', desc: 'Brutal executions in underground cells', booking: 'https://www.viator.com/en-AU/tours/Melbourne/Pentridge-Prison-Tour/d4663-2716' },
    { id: 18, name: 'Williamstown Fort', lat: -37.8581, lng: 144.9009, category: 'au-tour', desc: 'Military ghosts guard historic fortification', booking: 'https://www.viator.com/en-AU/tours/Williamstown/Fort-Williamstown-Tour/d4663-2716' },
    { id: 19, name: 'Ballarat Ghost Walk', lat: -37.5567, lng: 143.8900, category: 'au-tour', desc: 'Eureka Stockade spirits and goldfield hauntings', booking: 'https://www.viator.com/en-AU/tours/Ballarat/Ballarat-Ghost-Tour/d4663-71622' },
    { id: 20, name: 'J Ward Ararat', lat: -37.2669, lng: 142.1553, category: 'au-tour', desc: 'Criminally insane asylum, most paranormal activity', booking: 'https://www.viator.com/en-AU/tours/Ararat/J-Ward-Tour/d4663-71622' },
  ];

  // Victorian Cemeteries
  const cemeteries: Location[] = [
    { id: 21, name: 'Melbourne General Cemetery', lat: -37.7890, lng: 144.9756, category: 'cemetery', desc: 'Historic burial ground with prominent figures', booking: null },
    { id: 22, name: 'St Kilda Cemetery', lat: -37.8681, lng: 144.9756, category: 'cemetery', desc: 'Seaside graves with restless spirits', booking: null },
    { id: 23, name: 'Coburg Pine Ridge Cemetery', lat: -37.7222, lng: 144.9667, category: 'cemetery', desc: 'Ancient burials on sacred ground', booking: null },
    { id: 24, name: 'Fawkner Cemetery', lat: -37.6867, lng: 144.9234, category: 'cemetery', desc: "Melbourne's largest cemetery, many hauntings", booking: null },
    { id: 25, name: 'Springvale Cemetery', lat: -37.8701, lng: 145.1434, category: 'cemetery', desc: 'Multicultural cemetery with varied spirits', booking: null },
    { id: 26, name: 'Abbotsford Cemetery', lat: -37.8001, lng: 145.0123, category: 'cemetery', desc: 'Victorian-era gravesites', booking: null },
    { id: 27, name: 'Kew Cemetery', lat: -37.8145, lng: 145.0456, category: 'cemetery', desc: 'Leafy cemetery with unseen visitors', booking: null },
    { id: 28, name: 'Box Hill Cemetery', lat: -37.8223, lng: 145.1289, category: 'cemetery', desc: 'Historic resting place of pioneers', booking: null },
    { id: 29, name: 'Oakleigh Cemetery', lat: -37.8823, lng: 145.0978, category: 'cemetery', desc: 'Well-maintained grounds hide dark histories', booking: null },
    { id: 30, name: 'Dandenong Cemetery', lat: -37.9867, lng: 145.2156, category: 'cemetery', desc: 'Deep in mountains, deeply haunted', booking: null },
    { id: 31, name: 'Moorabbin Cemetery', lat: -37.9456, lng: 145.1234, category: 'cemetery', desc: 'South suburbs burial ground', booking: null },
    { id: 32, name: 'Preston Cemetery', lat: -37.7234, lng: 145.0089, category: 'cemetery', desc: "North Melbourne's eternal resting place", booking: null },
    { id: 33, name: 'Brighton Cemetery', lat: -37.9123, lng: 145.0234, category: 'cemetery', desc: 'Beachside graves under moonlight', booking: null },
    { id: 34, name: 'Camberwell Cemetery', lat: -37.8456, lng: 145.0567, category: 'cemetery', desc: 'Inner-east hauntings', booking: null },
    { id: 35, name: 'Coburg Cemetery', lat: -37.7301, lng: 144.9534, category: 'cemetery', desc: 'Northern suburbs memorial ground', booking: null },
    { id: 36, name: 'Cemeteries of Essendon', lat: -37.7667, lng: 144.9301, category: 'cemetery', desc: 'West-side burial traditions', booking: null },
    { id: 37, name: 'Footscray Cemetery', lat: -37.7890, lng: 144.8856, category: 'cemetery', desc: 'Working-class final resting place', booking: null },
    { id: 38, name: 'Geelong Cemetery', lat: -38.1500, lng: 144.3667, category: 'cemetery', desc: 'Regional Victoria oldest graves', booking: null },
    { id: 39, name: 'Bendigo Cemetery', lat: -36.7597, lng: 144.2783, category: 'cemetery', desc: 'Goldfield era burial ground', booking: null },
    { id: 40, name: 'Gisborne Cemetery', lat: -37.3389, lng: 144.1764, category: 'cemetery', desc: 'Rural Victoria memorial site', booking: null },
    { id: 41, name: 'Werribee Cemetery', lat: -37.8967, lng: 144.6778, category: 'cemetery', desc: 'Western suburbs resting place', booking: null },
    { id: 42, name: 'Lilydale Cemetery', lat: -37.7456, lng: 145.3589, category: 'cemetery', desc: 'Mountain town burial ground', booking: null },
    { id: 43, name: 'Yarra Glen Cemetery', lat: -37.6234, lng: 145.4101, category: 'cemetery', desc: "Wine country's quiet haunts", booking: null },
    { id: 44, name: 'Healesville Cemetery', lat: -37.6889, lng: 145.5012, category: 'cemetery', desc: 'Forest memorial ground', booking: null },
    { id: 45, name: 'Warburton Cemetery', lat: -37.6423, lng: 145.5678, category: 'cemetery', desc: 'Deep fern gully burial place', booking: null },
  ];

  // Ley Lines
  const leyLines: LeyLine[] = [
    { name: 'Stonehenge-Giza', start: { lat: 51.1789, lng: -1.8262 }, end: { lat: 29.9792, lng: 31.1342 }, color: '#ff6b6b', glyph: '✦' },
    { name: 'Uluru-Machu Picchu', start: { lat: -25.3441, lng: 131.0369 }, end: { lat: -13.1631, lng: -72.5450 }, color: '#20c997', glyph: '✧' },
    { name: 'Stonehenge-Glastonbury', start: { lat: 51.1789, lng: -1.8262 }, end: { lat: 51.1418, lng: -2.7159 }, color: '#748ffc', glyph: '✧' },
    { name: 'Easter Island-Nazca', start: { lat: -27.1127, lng: -109.3497 }, end: { lat: -14.6349, lng: -75.1327 }, color: '#f06595', glyph: '✦' },
    { name: 'Great Pyramid-Petra', start: { lat: 29.9792, lng: 31.1342 }, end: { lat: 30.3285, lng: 35.4444 }, color: '#ffd43b', glyph: '✧' },
    { name: 'Dendera-Luxor', start: { lat: 26.1627, lng: 32.6703 }, end: { lat: 25.7465, lng: 32.6393 }, color: '#a78bfa', glyph: '✦' },
    { name: 'Angkor Wat-Kailash', start: { lat: 13.3667, lng: 103.8667 }, end: { lat: 31.1043, lng: 88.6436 }, color: '#34d399', glyph: '✧' },
    { name: 'Rapa Nui-Tiahuanaco', start: { lat: -27.1127, lng: -109.3497 }, end: { lat: -16.2298, lng: -68.7598 }, color: '#fca5a5', glyph: '✦' },
    { name: 'Chichen Itza-Teotihuacan', start: { lat: 20.6843, lng: -87.1921 }, end: { lat: 19.6926, lng: -98.8404 }, color: '#86efac', glyph: '✧' },
    { name: 'Lake Titicaca-Atacama', start: { lat: -15.5007, lng: -70.1431 }, end: { lat: -22.8045, lng: -68.1989 }, color: '#c4b5fd', glyph: '✦' },
  ];

  // Geometry Calculations
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getPerpendicularDistance = (lat: number, lng: number, lineStart: { lat: number; lng: number }, lineEnd: { lat: number; lng: number }): number => {
    const lat1 = lineStart.lat;
    const lng1 = lineStart.lng;
    const lat2 = lineEnd.lat;
    const lng2 = lineEnd.lng;

    const A = lat - lat1;
    const B = lng - lng1;
    const C = lat2 - lat1;
    const D = lng2 - lng1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let closestLat: number, closestLng: number;

    if (param < 0) {
      closestLat = lat1;
      closestLng = lng1;
    } else if (param > 1) {
      closestLat = lat2;
      closestLng = lng2;
    } else {
      closestLat = lat1 + param * C;
      closestLng = lng1 + param * D;
    }

    return calculateDistance(lat, lng, closestLat, closestLng);
  };

  const getAssociatedLeyLines = (lat: number, lng: number): LeyLineAssociation[] => {
    const proximityThreshold = 5;
    const associated: LeyLineAssociation[] = [];

    leyLines.forEach((line) => {
      const distance = getPerpendicularDistance(lat, lng, line.start, line.end);
      if (distance <= proximityThreshold) {
        associated.push({
          ...line,
          distance: distance.toFixed(2),
        });
      }
    });

    return associated;
  };

  // Initialize Map
  useEffect(() => {
    if (currentPage === 'home' && mapRef.current && !mapInitialized) {
      initializeMap();
    }
  }, [currentPage, mapInitialized]);

  const initializeMap = () => {
    // Load CSS first
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    link.onload = () => {
      // Then load JS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => {
        const L = (window as any).L;
        if (!L) {
          console.error('Leaflet failed to load');
          return;
        }

        mapInstance.current = L.map(mapRef.current, {
          preferCanvas: true,
          worldCopyJump: true,
        }).setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstance.current);

        const allLocations = [...usGhostTours, ...auGhostTours, ...cemeteries];
        allLocations.forEach((location) => {
          addMarker(location);
        });

        calculateLeyLineAssociations();
        setMapInitialized(true);
      };
      document.head.appendChild(script);
    };
    document.head.appendChild(link);
  };

  const calculateLeyLineAssociations = () => {
    const associations = new Map<number, LeyLineAssociation[]>();
    const allLocations = [...usGhostTours, ...auGhostTours, ...cemeteries];

    allLocations.forEach((location) => {
      const leyLinesNear = getAssociatedLeyLines(location.lat, location.lng);
      if (leyLinesNear.length > 0) {
        associations.set(location.id, leyLinesNear);
      }
    });

    setLocationsNearLeyLines(associations);
  };

  const addMarker = (location: Location) => {
    if (!mapInstance.current) return;
    const L = (window as any).L;

    let baseColor = '#808080';

    if (location.category === 'us-tour') {
      baseColor = '#ff6b6b';
    } else if (location.category === 'au-tour') {
      baseColor = '#a78bfa';
    }

    const marker = L.marker([location.lat, location.lng], {
      title: location.name,
    }).addTo(mapInstance.current);

    const markerData: MarkerData = { marker, location, baseColor };
    markersRef.current.push(markerData);

    const icon = location.category === 'cemetery' ? '🪦' : '👻';

    marker.bindPopup(`
      <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; width: 280px;">
        <h3 style="margin: 0 0 8px 0; color: ${baseColor}; font-size: 18px;">${icon} ${location.name}</h3>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #555;">${location.desc}</p>
        ${
          locationsNearLeyLines.has(location.id)
            ? `<div style="background: #f0f0f0; padding: 8px; border-radius: 4px; margin-bottom: 12px; font-size: 11px;">
                 <strong style="color: #333;">🔮 Ley Line Energy:</strong>
                 ${locationsNearLeyLines
                   .get(location.id)
                   ?.map(
                     (ley) =>
                       `<div style="color: ${ley.color}; margin-top: 4px;"><strong>${ley.name}</strong><br/>${ley.distance}km away</div>`
                   )
                   .join('')}
               </div>`
            : '<div style="font-size: 11px; color: #999; margin-bottom: 12px;">No ley line energy detected</div>'
        }
        ${
          location.booking
            ? `<a href="${location.booking}" target="_blank" style="display: inline-block; background: ${baseColor}; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: bold;">Book Tour →</a>`
            : '<p style="font-size: 12px; color: #888;">Historical Site</p>'
        }
      </div>
    `);

    marker.location = location;
  };

  const toggleLeyLines = () => {
    if (!leyLinesActive) {
      drawLeyLines();
    } else {
      clearLeyLines();
    }
    setLeyLinesActive(!leyLinesActive);
  };

  const drawLeyLines = () => {
    if (!mapInstance.current) return;
    const L = (window as any).L;

    leyLines.forEach((line) => {
      const polyline = L.polyline(
        [
          [line.start.lat, line.start.lng],
          [line.end.lat, line.end.lng],
        ],
        {
          color: line.color,
          weight: 2,
          opacity: 0.6,
          dashArray: '5, 5',
          lineCap: 'round',
          lineJoin: 'round',
        }
      ).addTo(mapInstance.current);

      const glowLine = L.polyline(
        [
          [line.start.lat, line.start.lng],
          [line.end.lat, line.end.lng],
        ],
        {
          color: line.color,
          weight: 6,
          opacity: 0.1,
          dashArray: '5, 5',
          lineCap: 'round',
          lineJoin: 'round',
        }
      ).addTo(mapInstance.current);

      L.circleMarker([line.start.lat, line.start.lng], {
        radius: 6,
        fillColor: line.color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup(`<div style="text-align: center; color: #333;">
          <strong>${line.name} (Start)</strong><br/>
          <small style="color: ${line.color};">Energy Origin</small>
        </div>`)
        .addTo(mapInstance.current);

      L.circleMarker([line.end.lat, line.end.lng], {
        radius: 6,
        fillColor: line.color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup(`<div style="text-align: center; color: #333;">
          <strong>${line.name} (End)</strong><br/>
          <small style="color: ${line.color};">Energy Terminus</small>
        </div>`)
        .addTo(mapInstance.current);

      leyLineLayersRef.current.push(polyline, glowLine);
    });

    updateMarkerColorsForLeyLines();
  };

  const updateMarkerColorsForLeyLines = () => {
    const L = (window as any).L;

    markersRef.current.forEach((markerData) => {
      const { location, marker } = markerData;
      const leyLinesNear = locationsNearLeyLines.get(location.id);

      if (leyLinesNear && leyLinesNear.length > 0) {
        const closestLeyLine = leyLinesNear.reduce((closest, current) =>
          parseFloat(current.distance) < parseFloat(closest.distance) ? current : closest
        );

        const html = `<div style="
          background: ${closestLeyLine.color};
          border: 2px solid white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 0 15px ${closestLeyLine.color}80;
          animation: pulse 2s infinite;
        ">👻</div>`;

        const customIcon = L.divIcon({
          html,
          iconSize: [28, 28],
          className: 'custom-marker',
        });

        marker.setIcon(customIcon);
      }
    });
  };

  const clearLeyLines = () => {
    if (!mapInstance.current) return;
    const L = (window as any).L;

    leyLineLayersRef.current.forEach((layer) => {
      mapInstance.current.removeLayer(layer);
    });
    leyLineLayersRef.current = [];

    markersRef.current.forEach((markerData) => {
      const { marker, location, baseColor } = markerData;
      const icon = location.category === 'cemetery' ? '🪦' : '👻';

      const html = `<div style="
        background: ${baseColor};
        border: 2px solid white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">${icon}</div>`;

      const defaultIcon = L.divIcon({
        html,
        iconSize: [28, 28],
        className: 'custom-marker',
      });

      marker.setIcon(defaultIcon);
    });
  };

  const centerOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        if (mapInstance.current) {
          mapInstance.current.setView([latitude, longitude], 12);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #__next {
          height: 100%;
          width: 100%;
          overflow-x: hidden;
        }

        body {
          font-family: 'Lato', sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          color: #e2e8f0;
        }

        .display-font {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.05em;
        }

        .accent-font {
          font-family: 'Cinzel', serif;
          letter-spacing: 0.08em;
        }

        .glow-red {
          text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
          box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        }

        .glow-purple {
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.3);
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
        }

        .fade-in {
          animation: fadeIn 0.6s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 15px currentColor; }
          50% { box-shadow: 0 0 25px currentColor; }
        }

        .stagger-child {
          animation: fadeIn 0.6s ease-in;
        }

        .stagger-child:nth-child(1) { animation-delay: 0.1s; }
        .stagger-child:nth-child(2) { animation-delay: 0.2s; }
        .stagger-child:nth-child(3) { animation-delay: 0.3s; }
        .stagger-child:nth-child(4) { animation-delay: 0.4s; }

        .leaflet-container {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          height: 100% !important;
          width: 100% !important;
        }

        .leaflet-popup-content-wrapper {
          background: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
        }

        .leaflet-popup-tip {
          background: #1a1a1a;
        }

        .w-full.h-screen {
          width: 100%;
          height: 100%;
          min-height: 100vh;
        }

        .relative.w-full {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-950 to-transparent border-b border-red-900/30 backdrop-blur-sm" style={{ height: '80px' }}>
        <div className="w-full h-full px-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="text-2xl">🗺️</div>
            <span className="display-font text-xl font-bold glow-red">GHOST MAP FILES</span>
          </button>

          <div className="hidden md:flex gap-8 items-center">
            {[
              { label: 'Home', page: 'home' as const, icon: Home },
              { label: 'Tours', page: 'tours' as const, icon: MapPin },
              { label: 'Cemeteries', page: 'cemeteries' as const, icon: BookOpen },
              { label: 'About', page: 'about' as const, icon: Info },
            ].map(({ label, page, icon: Icon }) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center gap-1 text-sm accent-font transition ${
                  currentPage === page ? 'text-red-500 glow-red' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-red-400 hover:text-red-300 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur border-t border-red-900/30 animate-fadeIn">
            {[
              { label: 'Home', page: 'home' as const },
              { label: 'Tours', page: 'tours' as const },
              { label: 'Cemeteries', page: 'cemeteries' as const },
              { label: 'About', page: 'about' as const },
            ].map(({ label, page }) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 border-t border-slate-700 transition ${
                  currentPage === page ? 'bg-red-900/20 text-red-400' : 'hover:bg-slate-800/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-20">
        {/* HOME - MAP PAGE WITH FIXED HEIGHT */}
        {currentPage === 'home' && (
          <div 
            className="fade-in" 
            style={{ 
              width: '100%', 
              height: 'calc(100vh - 80px)',
              overflow: 'hidden',
              position: 'fixed',
              top: '80px',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10
            }}
          >
            <div 
              ref={mapRef} 
              style={{ 
                width: '100%', 
                height: '100%',
                background: '#1a1a2e',
                position: 'absolute',
                top: 0,
                left: 0
              }} 
            />

            {/* Map Controls Overlay */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-40" style={{ pointerEvents: 'auto' }}>
              <button
                onClick={centerOnUser}
                className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition hover-lift shadow-lg"
                title="Center on my location"
              >
                <Compass size={20} />
              </button>

              <button
                onClick={toggleLeyLines}
                className={`p-3 rounded-lg transition hover-lift shadow-lg ${
                  leyLinesActive
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title="Toggle ley line energy grid"
              >
                <Zap size={20} />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur border border-red-900/30 rounded-lg p-4 max-w-xs z-40" style={{ pointerEvents: 'auto' }}>
              <h3 className="display-font text-red-400 mb-3 font-bold">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">👻</span>
                  <span>US Ghost Tours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 text-lg">👻</span>
                  <span>Australian Tours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-lg">🪦</span>
                  <span>Cemeteries</span>
                </div>
                {leyLinesActive && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-purple-300 font-bold mb-2">🔮 Ley Lines Active</div>
                    <p className="text-xs text-gray-400">Markers glow with energy colors</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info Banner */}
            <div className="absolute top-24 left-6 right-6 max-w-md bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur border border-red-900/30 rounded-lg p-4 z-40 hidden md:block" style={{ pointerEvents: 'auto' }}>
              <p className="display-font text-red-400 font-bold mb-2">Welcome to the Paranormal</p>
              <p className="text-sm text-gray-300">
                {leyLinesActive
                  ? '🔮 Ley line energy is activated. Locations aligned with global energy grids now glow with their line colors.'
                  : 'Explore 45 haunted locations worldwide. Tap markers for details. Activate ley lines to reveal energy connections.'}
              </p>
            </div>
          </div>
        )}

        {/* Tours Page */}
        {currentPage === 'tours' && (
          <div className="min-h-screen pb-12">
            <div className="max-w-6xl mx-auto px-4 py-12">
              <div className="mb-12 fade-in">
                <h1 className="display-font text-5xl font-bold mb-4">
                  <span className="glow-red">Guided Ghost Tours</span>
                </h1>
                <p className="text-gray-400 max-w-2xl">Book authentic paranormal experiences at the world's most haunted locations.</p>
              </div>

              <div className="mb-16 stagger-child">
                <h2 className="accent-font text-2xl text-red-400 mb-6 flex items-center gap-2">
                  <span className="text-red-500">👻</span> United States
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {usGhostTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-900/30 rounded-lg p-6 hover-lift"
                    >
                      <h3 className="display-font text-lg font-bold text-red-400 mb-2">{tour.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{tour.desc}</p>
                      <a
                        href={tour.booking || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold transition"
                      >
                        Book Tour
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stagger-child">
                <h2 className="accent-font text-2xl text-purple-400 mb-6 flex items-center gap-2">
                  <span className="text-purple-500">👻</span> Australia & Victoria
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {auGhostTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-900/30 rounded-lg p-6 hover-lift"
                    >
                      <h3 className="display-font text-lg font-bold text-purple-400 mb-2">{tour.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{tour.desc}</p>
                      <a
                        href={tour.booking || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm font-bold transition"
                      >
                        Book Tour
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cemeteries Page */}
        {currentPage === 'cemeteries' && (
          <div className="min-h-screen pb-12">
            <div className="max-w-6xl mx-auto px-4 py-12">
              <div className="mb-12 fade-in">
                <h1 className="display-font text-5xl font-bold mb-4">
                  <span className="glow-red">Sacred Grounds</span>
                </h1>
                <p className="text-gray-400 max-w-2xl">Explore Victoria's most historic and spiritually significant cemeteries.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-child">
                {cemeteries.map((cemetery) => (
                  <div
                    key={cemetery.id}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-700/30 rounded-lg p-6 hover-lift"
                  >
                    <h3 className="display-font text-lg font-bold text-gray-300 mb-2 flex items-center gap-2">
                      <span>🪦</span> {cemetery.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{cemetery.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* About Page */}
        {currentPage === 'about' && (
          <div className="min-h-screen pb-12">
            <div className="max-w-3xl mx-auto px-4 py-12 fade-in">
              <h1 className="display-font text-5xl font-bold mb-8">
                <span className="glow-red">About Ghost Map Files</span>
              </h1>

              <div className="space-y-8">
                <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-900/30 rounded-lg p-8 stagger-child">
                  <h2 className="accent-font text-2xl text-red-400 mb-4">Our Mission</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Ghost Map Files connects paranormal enthusiasts, dark tourism travelers, and spiritual seekers with authentic haunted locations and guided experiences worldwide. We celebrate the intersection of history, mystery, and the unexplained.
                  </p>
                </section>

                <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-900/30 rounded-lg p-8 stagger-child">
                  <h2 className="accent-font text-2xl text-red-400 mb-4">Ley Lines Explained</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Ley lines are hypothetical alignments of ancient spiritual sites and natural landmarks that some believe form a global energy grid. Our advanced geometry engine maps 10 major ley lines connecting sacred locations like Stonehenge, the Giza Pyramids, Machu Picchu, and more.
                  </p>
                  <p className="text-gray-400 text-sm italic mb-4">
                    Our proximity calculation uses the Haversine formula and perpendicular distance algorithms to identify haunted locations within 5km of a ley line's path.
                  </p>
                </section>

                <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-900/30 rounded-lg p-8 stagger-child">
                  <h2 className="accent-font text-2xl text-red-400 mb-4">Tech Stack</h2>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• <strong>Frontend:</strong> React 18, Tailwind CSS, TypeScript</li>
                    <li>• <strong>Maps:</strong> Leaflet.js + OpenStreetMap (free)</li>
                    <li>• <strong>Geometry:</strong> Haversine formula, perpendicular distance</li>
                    <li>• <strong>Hosting:</strong> Vercel (free tier)</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-red-900/30 bg-gradient-to-t from-slate-950 to-transparent py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 Ghost Map Files. Exploring the paranormal worldwide.</p>
          <p className="mt-2">Book tours through Viator | Privacy Policy | Terms</p>
        </div>
      </footer>
    </div>
  );
}
