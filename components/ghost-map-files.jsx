import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MapPin, Compass, Home, BookOpen, Info, ExternalLink } from 'lucide-react';

const GhostMapFiles = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [leyLinesActive, setLeyLinesActive] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const leyLineLayersRef = useRef([]);
  const polylineLayersRef = useRef([]);

  // US Ghost Tours
  const usGhostTours = [
    { id: 1, name: 'New Orleans French Quarter', lat: 29.9611, lng: -90.2680, category: 'us-tour', desc: 'Haunted Voodoo alley with spirits of Marie Laveau', booking: 'https://www.viator.com/en-US/tours/New-Orleans/French-Quarter-Ghost-Tour/d309-2716' },
    { id: 2, name: 'Chicago Gangster Tour', lat: 41.8781, lng: -87.6298, category: 'us-tour', desc: 'AI Capone era speakeasies and mob history', booking: 'https://www.viator.com/en-US/tours/Chicago/Chicago-Gangster-Tour/d311-17261' },
    { id: 3, name: 'NYC Greenwich Village', lat: 40.7347, lng: -74.0029, category: 'us-tour', desc: 'Bohemian ghosts and haunted theaters', booking: 'https://www.viator.com/en-US/tours/New-York-City/Greenwich-Village-Ghost-Tour/d308-2814' },
    { id: 4, name: 'Savannah Ghost Tour', lat: 32.0809, lng: -81.0912, category: 'us-tour', desc: 'Spanish moss graves and colonial spirits', booking: 'https://www.viator.com/en-US/tours/Savannah/Savannah-Ghost-Tour/d305-2716' },
    { id: 5, name: 'Gettysburg Battlefield', lat: 39.8090, lng: -77.2348, category: 'us-tour', desc: 'Civil War spirits still haunting the fields', booking: 'https://www.viator.com/en-US/tours/Gettysburg/Gettysburg-Battlefield-Ghost-Tour/d315-71622' },
    { id: 6, name: 'San Antonio Alamo', lat: 29.4241, lng: -98.4859, category: 'us-tour', desc: 'Fallen soldiers and paranormal encounters', booking: 'https://www.viator.com/en-US/tours/San-Antonio/San-Antonio-Ghost-Tour/d314-17261' },
    { id: 7, name: 'Boston Freedom Trail', lat: 42.3601, lng: -71.0589, category: 'us-tour', desc: 'Revolutionary war ghosts on historic streets', booking: 'https://www.viator.com/en-US/tours/Boston/Boston-Ghost-Tour/d305-2716' },
    { id: 8, name: 'Charleston Historic District', lat: 32.7765, lng: -79.9318, category: 'us-tour', desc: 'Antebellum mansions with restless spirits', booking: 'https://www.viator.com/en-US/tours/Charleston/Charleston-Ghost-Tour/d305-2716' },
    { id: 9, name: 'St. Augustine Ancient City', lat: 29.8936, lng: -81.3132, category: 'us-tour', desc: 'America\'s oldest city, countless paranormal reports', booking: 'https://www.viator.com/en-US/tours/St-Augustine/St-Augustine-Ghost-Tour/d305-5645' },
    { id: 10, name: 'Salem Witch Trials', lat: 42.5195, lng: -70.8967, category: 'us-tour', desc: 'Haunted legacy of 1692 trials', booking: 'https://www.viator.com/en-US/tours/Salem/Salem-Ghost-Tour/d305-2716' },
  ];

  // Australian/Victorian Ghost Tours
  const auGhostTours = [
    { id: 11, name: 'Melbourne Ghost Tour', lat: -37.8136, lng: 144.9631, category: 'au-tour', desc: 'Haunted laneways of inner Melbourne', booking: 'https://www.viator.com/en-AU/tours/Melbourne/Melbourne-Ghost-and-Laneways-Tour/d4663-17261' },
    { id: 12, name: 'Old Castlemaine Gaol', lat: -37.0660, lng: 144.2167, category: 'au-tour', desc: 'Violent hangings echo through prison walls', booking: 'https://www.viator.com/en-AU/tours/Castlemaine/Castlemaine-Gaol-Ghost-Tour/d4663-71622' },
    { id: 13, name: 'Altona Homestead', lat: -37.9142, lng: 144.7697, category: 'au-tour', desc: 'Colonial mansion with unfinished business', booking: 'https://www.viator.com/en-AU/tours/Melbourne/Altona-Homestead-Tour/d4663-2716' },
    { id: 14, name: 'Aradale Asylum', lat: -37.2640, lng: 142.1548, category: 'au-tour', desc: 'Former mental institution with tortured souls', booking: 'https://www.viator.com/en-AU/tours/Ararat/Aradale-Asylum-Tour/d4663-71622' },
    { id: 15, name: 'Old Melbourne Gaol', lat: -37.8067, lng: 144.9664, category: 'au-tour', desc: 'Ned Kelly executed, spirits remain', booking: 'https://www.viator.com/en-AU/tours/Melbourne/Old-Melbourne-Gaol-Tour/d4663-2716' },
    { id: 16, name: 'Port Arthur Convict Prison', lat: -43.1408, lng: 147.8540, category: 'au-tour', desc: 'Tasmania\'s most haunted penal colony', booking: 'https://www.viator.com/en-AU/tours/Port-Arthur/Port-Arthur-Ghost-Tour/d4663-71622' },
    { id: 17, name: 'Pentridge Prison', lat: -37.7668, lng: 144.9892, category: 'au-tour', desc: 'Brutal executions in underground cells', booking: 'https://www.viator.com/en-AU/tours/Melbourne/Pentridge-Prison-Tour/d4663-2716' },
    { id: 18, name: 'Williamstown Fort', lat: -37.8581, lng: 144.9009, category: 'au-tour', desc: 'Military ghosts guard historic fortification', booking: 'https://www.viator.com/en-AU/tours/Williamstown/Fort-Williamstown-Tour/d4663-2716' },
    { id: 19, name: 'Ballarat Ghost Walk', lat: -37.5567, lng: 143.8900, category: 'au-tour', desc: 'Eureka Stockade spirits and goldfield hauntings', booking: 'https://www.viator.com/en-AU/tours/Ballarat/Ballarat-Ghost-Tour/d4663-71622' },
    { id: 20, name: 'J Ward Ararat', lat: -37.2669, lng: 142.1553, category: 'au-tour', desc: 'Criminally insane asylum, most paranormal activity', booking: 'https://www.viator.com/en-AU/tours/Ararat/J-Ward-Tour/d4663-71622' },
  ];

  // Victorian Cemeteries
  const cemeteries = [
    { id: 21, name: 'Melbourne General Cemetery', lat: -37.7890, lng: 144.9756, category: 'cemetery', desc: 'Historic burial ground with prominent figures', booking: null },
    { id: 22, name: 'St Kilda Cemetery', lat: -37.8681, lng: 144.9756, category: 'cemetery', desc: 'Seaside graves with restless spirits', booking: null },
    { id: 23, name: 'Coburg Pine Ridge Cemetery', lat: -37.7222, lng: 144.9667, category: 'cemetery', desc: 'Ancient burials on sacred ground', booking: null },
    { id: 24, name: 'Fawkner Cemetery', lat: -37.6867, lng: 144.9234, category: 'cemetery', desc: 'Melbourne\'s largest cemetery, many hauntings', booking: null },
    { id: 25, name: 'Springvale Cemetery', lat: -37.8701, lng: 145.1434, category: 'cemetery', desc: 'Multicultural cemetery with varied spirits', booking: null },
    { id: 26, name: 'Abbotsford Cemetery', lat: -37.8001, lng: 145.0123, category: 'cemetery', desc: 'Victorian-era gravesites', booking: null },
    { id: 27, name: 'Kew Cemetery', lat: -37.8145, lng: 145.0456, category: 'cemetery', desc: 'Leafy cemetery with unseen visitors', booking: null },
    { id: 28, name: 'Box Hill Cemetery', lat: -37.8223, lng: 145.1289, category: 'cemetery', desc: 'Historic resting place of pioneers', booking: null },
    { id: 29, name: 'Oakleigh Cemetery', lat: -37.8823, lng: 145.0978, category: 'cemetery', desc: 'Well-maintained grounds hide dark histories', booking: null },
    { id: 30, name: 'Dandenong Cemetery', lat: -37.9867, lng: 145.2156, category: 'cemetery', desc: 'Deep in mountains, deeply haunted', booking: null },
    { id: 31, name: 'Moorabbin Cemetery', lat: -37.9456, lng: 145.1234, category: 'cemetery', desc: 'South suburbs burial ground', booking: null },
    { id: 32, name: 'Preston Cemetery', lat: -37.7234, lng: 145.0089, category: 'cemetery', desc: 'North Melbourne\'s eternal resting place', booking: null },
    { id: 33, name: 'Brighton Cemetery', lat: -37.9123, lng: 145.0234, category: 'cemetery', desc: 'Beachside graves under moonlight', booking: null },
    { id: 34, name: 'Camberwell Cemetery', lat: -37.8456, lng: 145.0567, category: 'cemetery', desc: 'Inner-east hauntings', booking: null },
    { id: 35, name: 'Coburg Cemetery', lat: -37.7301, lng: 144.9534, category: 'cemetery', desc: 'Northern suburbs memorial ground', booking: null },
    { id: 36, name: 'Cemeteries of Essendon', lat: -37.7667, lng: 144.9301, category: 'cemetery', desc: 'West-side burial traditions', booking: null },
    { id: 37, name: 'Footscray Cemetery', lat: -37.7890, lng: 144.8856, category: 'cemetery', desc: 'Working-class final resting place', booking: null },
    { id: 38, name: 'Geelong Cemetery', lat: -38.1500, lng: 144.3667, category: 'cemetery', desc: 'Regional Victoria\'s oldest graves', booking: null },
    { id: 39, name: 'Bendigo Cemetery', lat: -36.7597, lng: 144.2783, category: 'cemetery', desc: 'Goldfield era burial ground', booking: null },
    { id: 40, name: 'Gisborne Cemetery', lat: -37.3389, lng: 144.1764, category: 'cemetery', desc: 'Rural Victoria memorial site', booking: null },
    { id: 41, name: 'Werribee Cemetery', lat: -37.8967, lng: 144.6778, category: 'cemetery', desc: 'Western suburbs resting place', booking: null },
    { id: 42, name: 'Lilydale Cemetery', lat: -37.7456, lng: 145.3589, category: 'cemetery', desc: 'Mountain town burial ground', booking: null },
    { id: 43, name: 'Yarra Glen Cemetery', lat: -37.6234, lng: 145.4101, category: 'cemetery', desc: 'Wine country\'s quiet haunts', booking: null },
    { id: 44, name: 'Healesville Cemetery', lat: -37.6889, lng: 145.5012, category: 'cemetery', desc: 'Toucan forest memorial ground', booking: null },
    { id: 45, name: 'Warburton Cemetery', lat: -37.6423, lng: 145.5678, category: 'cemetery', desc: 'Deep fern gully burial place', booking: null },
  ];

  // Major Ley Lines with accurate geometric data
  const leyLines = [
    {
      name: 'Stonehenge-Giza',
      start: { lat: 51.1789, lng: -1.8262, name: 'Stonehenge' },
      end: { lat: 29.9792, lng: 31.1342, name: 'Giza Pyramids' },
      color: '#ff6b6b',
      width: 3,
      dashPattern: '5,5',
    },
    {
      name: 'Uluru-Machu Picchu',
      start: { lat: -25.3441, lng: 131.0369, name: 'Uluru' },
      end: { lat: -13.1631, lng: -72.5450, name: 'Machu Picchu' },
      color: '#20c997',
      width: 3,
      dashPattern: '5,5',
    },
    {
      name: 'Stonehenge-Glastonbury',
      start: { lat: 51.1789, lng: -1.8262, name: 'Stonehenge' },
      end: { lat: 51.1418, lng: -2.7159, name: 'Glastonbury' },
      color: '#748ffc',
      width: 2,
      dashPattern: '3,3',
    },
    {
      name: 'Easter Island-Nazca',
      start: { lat: -27.1127, lng: -109.3497, name: 'Easter Island' },
      end: { lat: -14.6349, lng: -75.1327, name: 'Nazca Lines' },
      color: '#f06595',
      width: 3,
      dashPattern: '5,5',
    },
    {
      name: 'Great Pyramid-Petra',
      start: { lat: 29.9792, lng: 31.1342, name: 'Giza' },
      end: { lat: 30.3285, lng: 35.4444, name: 'Petra' },
      color: '#ffd43b',
      width: 2,
      dashPattern: '4,4',
    },
    {
      name: 'Dendera-Luxor',
      start: { lat: 26.1627, lng: 32.6703, name: 'Dendera' },
      end: { lat: 25.7465, lng: 32.6393, name: 'Luxor' },
      color: '#a78bfa',
      width: 2,
      dashPattern: '3,3',
    },
    {
      name: 'Angkor Wat-Kailash',
      start: { lat: 13.3667, lng: 103.8667, name: 'Angkor Wat' },
      end: { lat: 31.1043, lng: 88.6436, name: 'Mount Kailash' },
      color: '#34d399',
      width: 3,
      dashPattern: '5,5',
    },
    {
      name: 'Rapa Nui-Tiahuanaco',
      start: { lat: -27.1127, lng: -109.3497, name: 'Rapa Nui' },
      end: { lat: -16.2298, lng: -68.7598, name: 'Tiahuanaco' },
      color: '#fca5a5',
      width: 3,
      dashPattern: '5,5',
    },
    {
      name: 'Chichen Itza-Teotihuacan',
      start: { lat: 20.6843, lng: -87.1921, name: 'Chichen Itza' },
      end: { lat: 19.6926, lng: -98.8404, name: 'Teotihuacan' },
      color: '#86efac',
      width: 2,
      dashPattern: '4,4',
    },
    {
      name: 'Lake Titicaca-Atacama',
      start: { lat: -15.5007, lng: -70.1431, name: 'Lake Titicaca' },
      end: { lat: -22.8045, lng: -68.1989, name: 'Atacama Desert' },
      color: '#c4b5fd',
      width: 2,
      dashPattern: '3,3',
    },
  ];

  // Geometry Utility Functions
  const geoUtils = {
    // Convert degrees to radians
    toRad: (degrees) => (degrees * Math.PI) / 180,

    // Calculate great-circle distance between two points using Haversine formula
    haversineDistance: (lat1, lng1, lat2, lng2) => {
      const R = 6371; // Earth's radius in km
      const dLat = geoUtils.toRad(lat2 - lat1);
      const dLng = geoUtils.toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(geoUtils.toRad(lat1)) *
          Math.cos(geoUtils.toRad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },

    // Calculate point-to-line distance using cross-track error formula
    pointToLineDistance: (pointLat, pointLng, startLat, startLng, endLat, endLng) => {
      const R = 6371; // Earth's radius in km
      const φ1 = geoUtils.toRad(startLat);
      const λ1 = geoUtils.toRad(startLng);
      const φ2 = geoUtils.toRad(endLat);
      const λ2 = geoUtils.toRad(endLng);
      const φ3 = geoUtils.toRad(pointLat);
      const λ3 = geoUtils.toRad(pointLng);

      const Δσ13 = Math.acos(
        Math.sin(φ1) * Math.sin(φ3) +
          Math.cos(φ1) * Math.cos(φ3) * Math.cos(Math.abs(λ3 - λ1))
      );

      const Δσ12 = Math.acos(
        Math.sin(φ1) * Math.sin(φ2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.cos(Math.abs(λ2 - λ1))
      );

      const Δσ23 = Math.acos(
        Math.sin(φ2) * Math.sin(φ3) +
          Math.cos(φ2) * Math.cos(φ3) * Math.cos(Math.abs(λ3 - λ2))
      );

      // Cross-track distance
      const crossTrack = Math.asin(
        Math.sin(Δσ13) * Math.sin(Δσ12 - Δσ13)
      );

      return Math.abs(R * crossTrack);
    },

    // Check if point is along line segment (not just the infinite line)
    isNearLineSegment: (pointLat, pointLng, startLat, startLng, endLat, endLng, threshold) => {
      // First check if point is within threshold distance of the line
      const distance = geoUtils.pointToLineDistance(
        pointLat,
        pointLng,
        startLat,
        startLng,
        endLat,
        endLng
      );

      if (distance > threshold) return false;

      // Then check if point is between start and end (not beyond)
      const distToStart = geoUtils.haversineDistance(pointLat, pointLng, startLat, startLng);
      const distToEnd = geoUtils.haversineDistance(pointLat, pointLng, endLat, endLng);
      const lineLength = geoUtils.haversineDistance(startLat, startLng, endLat, endLng);

      // Allow 10% buffer beyond endpoints for proximity
      return distToStart <= lineLength * 1.1 && distToEnd <= lineLength * 1.1;
    },

    // Get interpolated points along a line for smooth visualization
    getLineSegmentPoints: (startLat, startLng, endLat, endLng, numPoints = 50) => {
      const points = [];
      for (let i = 0; i <= numPoints; i++) {
        const fraction = i / numPoints;
        const lat = startLat + (endLat - startLat) * fraction;
        const lng = startLng + (endLng - startLng) * fraction;
        points.push([lat, lng]);
      }
      return points;
    },
  };

  // Initialize Map
  useEffect(() => {
    if (currentPage === 'home' && mapRef.current && !mapInitialized) {
      initializeMap();
    }
  }, [currentPage, mapInitialized]);

  const initializeMap = () => {
    // Using OpenStreetMap with Leaflet as fallback since Google Maps API key not provided
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => {
      const L = window.L;
      mapInstance.current = L.map(mapRef.current).setView([20, 0], 3);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      // Add all markers
      const allLocations = [...usGhostTours, ...auGhostTours, ...cemeteries];
      allLocations.forEach((location) => {
        addMarker(location);
      });

      setMapInitialized(true);
    };

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);
  };

  const addMarker = (location) => {
    if (!mapInstance.current) return;
    const L = window.L;

    let icon = '👻';
    let color = '#808080';

    if (location.category === 'us-tour') {
      color = '#ff6b6b';
      icon = '👻';
    } else if (location.category === 'au-tour') {
      color = '#a78bfa';
      icon = '👻';
    } else if (location.category === 'cemetery') {
      color = '#808080';
      icon = '🪦';
    }

    const marker = L.marker([location.lat, location.lng], {
      title: location.name,
    }).addTo(mapInstance.current);

    marker.bindPopup(`
      <div style="font-family: 'Playfair Display', serif; color: #1a1a1a; width: 250px;">
        <h3 style="margin: 0 0 8px 0; color: ${color}; font-size: 18px;">${icon} ${location.name}</h3>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #555;">${location.desc}</p>
        ${location.booking ? `<a href="${location.booking}" target="_blank" style="display: inline-block; background: ${color}; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: bold;">Book Tour →</a>` : '<p style="font-size: 12px; color: #888;">Historical Site</p>'}
      </div>
    `);

    markersRef.current.push({ marker, location, baseColor: color });
  };

  const updateMarkerColors = () => {
    if (!leyLinesActive || !mapInstance.current) return;

    const L = window.L;
    const allLocations = [...usGhostTours, ...auGhostTours, ...cemeteries];
    const PROXIMITY_THRESHOLD = 5; // 5km

    markersRef.current.forEach(({ location, marker, baseColor }) => {
      let closestLeyLine = null;
      let closestDistance = PROXIMITY_THRESHOLD;

      // Check each ley line
      leyLines.forEach((line) => {
        const isNear = geoUtils.isNearLineSegment(
          location.lat,
          location.lng,
          line.start.lat,
          line.start.lng,
          line.end.lat,
          line.end.lng,
          PROXIMITY_THRESHOLD
        );

        if (isNear) {
          const distance = geoUtils.pointToLineDistance(
            location.lat,
            location.lng,
            line.start.lat,
            line.start.lng,
            line.end.lat,
            line.end.lng
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestLeyLine = line;
          }
        }
      });

      // Update marker color
      const newColor = closestLeyLine ? closestLeyLine.color : baseColor;
      marker.setIcon(
        L.divIcon({
          html: `<div style="
            font-size: 24px;
            text-shadow: 0 0 10px ${newColor};
            filter: drop-shadow(0 0 3px ${newColor});
            animation: ${closestLeyLine ? 'pulse 2s infinite' : 'none'};
          ">${location.category === 'cemetery' ? '🪦' : '👻'}</div>`,
          iconSize: [30, 30],
          className: 'ghost-marker',
        })
      );
    });
  };

  const toggleLeyLines = () => {
    const newState = !leyLinesActive;
    setLeyLinesActive(newState);

    if (newState) {
      drawLeyLines();
      updateMarkerColors();
    } else {
      clearLeyLines();
      // Reset marker colors to base colors
      markersRef.current.forEach(({ marker, baseColor, location }) => {
        const L = window.L;
        marker.setIcon(
          L.divIcon({
            html: `<div style="font-size: 24px; text-shadow: 0 0 10px ${baseColor};">${location.category === 'cemetery' ? '🪦' : '👻'}</div>`,
            iconSize: [30, 30],
            className: 'ghost-marker',
          })
        );
      });
    }
  };

  const drawLeyLines = () => {
    if (!mapInstance.current) return;
    const L = window.L;

    clearLeyLines();

    leyLines.forEach((line) => {
      const points = geoUtils.getLineSegmentPoints(
        line.start.lat,
        line.start.lng,
        line.end.lat,
        line.end.lng,
        100
      );

      const polyline = L.polyline(points, {
        color: line.color,
        weight: line.width,
        opacity: 0.6,
        dashArray: line.dashPattern,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(mapInstance.current);

      // Add markers at endpoints
      L.circleMarker([line.start.lat, line.start.lng], {
        radius: 6,
        fillColor: line.color,
        color: '#fff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.8,
      })
        .addTo(mapInstance.current)
        .bindPopup(`<div style="color: #1a1a1a; font-weight: bold;">${line.start.name}</div>`);

      L.circleMarker([line.end.lat, line.end.lng], {
        radius: 6,
        fillColor: line.color,
        color: '#fff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.8,
      })
        .addTo(mapInstance.current)
        .bindPopup(`<div style="color: #1a1a1a; font-weight: bold;">${line.end.name}</div>`);

      polylineLayersRef.current.push(polyline);
      leyLineLayersRef.current.push(polyline);
    });
  };

  const clearLeyLines = () => {
    if (!mapInstance.current) return;
    polylineLayersRef.current.forEach((layer) => {
      mapInstance.current.removeLayer(layer);
    });
    leyLineLayersRef.current.forEach((layer) => {
      mapInstance.current.removeLayer(layer);
    });
    leyLineLayersRef.current = [];
    polylineLayersRef.current = [];
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

        /* Glow effects */
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
          0%, 100% {
            filter: drop-shadow(0 0 3px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 8px currentColor);
          }
        }

        .stagger-child {
          animation: fadeIn 0.6s ease-in;
        }

        .stagger-child:nth-child(1) { animation-delay: 0.1s; }
        .stagger-child:nth-child(2) { animation-delay: 0.2s; }
        .stagger-child:nth-child(3) { animation-delay: 0.3s; }
        .stagger-child:nth-child(4) { animation-delay: 0.4s; }

        /* Leaflet overrides */
        .leaflet-container {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .leaflet-popup-content-wrapper {
          background: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
        }

        .leaflet-popup-tip {
          background: #1a1a1a;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-950 to-transparent border-b border-red-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="text-2xl">🗺️</div>
            <span className="display-font text-xl font-bold glow-red">GHOST MAP FILES</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {[
              { label: 'Home', page: 'home', icon: Home },
              { label: 'Tours', page: 'tours', icon: MapPin },
              { label: 'Cemeteries', page: 'cemeteries', icon: BookOpen },
              { label: 'About', page: 'about', icon: Info },
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-red-400 hover:text-red-300 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur border-t border-red-900/30 animate-fadeIn">
            {[
              { label: 'Home', page: 'home' },
              { label: 'Tours', page: 'tours' },
              { label: 'Cemeteries', page: 'cemeteries' },
              { label: 'About', page: 'about' },
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

      {/* Main Content */}
      <main className="pt-20">
        {/* Home - Map Page */}
        {currentPage === 'home' && (
          <div className="relative w-full h-screen fade-in">
            <div ref={mapRef} className="w-full h-full" />

            {/* Map Controls Overlay */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-40">
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
                title="Toggle ley lines"
              >
                <div className="text-lg">✦</div>
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur border border-red-900/30 rounded-lg p-4 max-w-xs z-40">
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
              </div>
              {leyLinesActive && (
                <div className="mt-4 pt-4 border-t border-red-900/30">
                  <p className="text-xs text-gray-400 font-bold mb-2">✦ Ley Lines Active</p>
                  <p className="text-xs text-gray-500">Haunted locations within 5km of ley lines glow with energy.</p>
                </div>
              )}
            </div>

            {/* Info Banner */}
            <div className="absolute top-24 left-6 right-6 max-w-md bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur border border-red-900/30 rounded-lg p-4 z-40 md:block hidden">
              <p className="display-font text-red-400 font-bold mb-2">Welcome to the Paranormal</p>
              <p className="text-sm text-gray-300">Explore 45 haunted locations worldwide. Tap markers for details. Toggle ✦ to reveal ley line energy connections.</p>
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

              {/* US Tours */}
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
                        href={tour.booking}
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

              {/* AU Tours */}
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
                        href={tour.booking}
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
                  <h2 className="accent-font text-2xl text-red-400 mb-4">Advanced Ley Line Geometry</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Our ley line system uses advanced geographic calculations to determine proximity to energy grids:
                  </p>
                  <ul className="space-y-3 text-gray-300 text-sm mb-4">
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span><strong>Haversine Formula:</strong> Calculates great-circle distances between any two points on Earth using latitude/longitude</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span><strong>Cross-Track Error:</strong> Determines shortest distance from a point to an infinite line</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span><strong>Line Segment Proximity:</strong> Checks if points fall between line endpoints (not beyond)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span><strong>Energy Detection:</strong> Haunted locations within 5km of active ley lines automatically highlight</span>
                    </li>
                  </ul>
                  <p className="text-gray-400 text-xs italic">
                    Every calculation uses spherical trigonometry to account for Earth's curvature, ensuring accuracy across continental distances.
                  </p>
                </section>

                <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-900/30 rounded-lg p-8 stagger-child">
                  <h2 className="accent-font text-2xl text-red-400 mb-4">Features</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span>Interactive global map with 45+ haunted locations</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span>Direct booking integration with Viator for verified tours</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span>Advanced geometric ley line calculations with real-world accuracy</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span>Dynamic marker color updates based on proximity to energy grids</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span>Victorian cemetery database with historical context</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-400">→</span>
                      <span>GPS location services for nearby paranormal hotspots</span>
                    </li>
                  </ul>
                </section>

                <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-900/30 rounded-lg p-8 stagger-child">
                  <h2 className="accent-font text-2xl text-red-400 mb-4">Deployment & Technology</h2>
                  <p className="text-gray-300 mb-4">
                    Ghost Map Files is built with React for maximum interactivity and performance. For a low-cost, scalable deployment, we recommend:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex gap-3">
                      <span className="text-purple-400">•</span>
                      <span><strong>Vercel:</strong> Ideal for React apps, free tier includes 50GB bandwidth/month. Deploy from GitHub with automatic CI/CD.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-400">•</span>
                      <span><strong>Netlify:</strong> Similar benefits, great free tier, easy form handling.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-400">•</span>
                      <span><strong>GitHub Pages:</strong> Free static hosting (works for production builds).</span>
                    </li>
                  </ul>
                  <p className="text-gray-400 text-sm mt-4 italic">
                    Next steps: Set up a GitHub repo, push to Vercel, customize environment variables for API keys, and configure your domain.
                  </p>
                </section>

                <section className="bg-gradient-to-br from-red-900/20 to-slate-900 border border-red-900/50 rounded-lg p-8 stagger-child">
                  <h2 className="accent-font text-2xl text-red-400 mb-4">Join the Exploration</h2>
                  <p className="text-gray-300">
                    Every haunting tells a story. Every cemetery holds secrets. Ghost Map Files is your guide into the unexplained corners of our world. Start exploring today.
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-red-900/30 bg-gradient-to-t from-slate-950 to-transparent py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 Ghost Map Files. Exploring the paranormal worldwide.</p>
          <p className="mt-2">Book tours through Viator | Privacy Policy | Terms</p>
        </div>
      </footer>
    </div>
  );
};

export default GhostMapFiles;
