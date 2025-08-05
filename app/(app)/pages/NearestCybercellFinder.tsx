import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, StatusBar } from "react-native";
import MapContainer from "../../../components/MapContainer";
import SearchBox from "../../../components/SearchBox";
import CyberCellList from "../../../components/CyberCellList";
import GeolocationButton from "../../../components/GeolocationButton";
import { calculateDistance } from "../../../utils/distance";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    latitude: 28.6139,
    longitude: 77.209,
  });
  const [nearbyCells, setNearbyCells] = useState([]);
  const [currentAddress, setCurrentAddress] = useState("");

  // ✅ Fetch cyber cells from backend
  const fetchCyberCells = async (lat, lng) => {
    try {
      const res = await fetch(
        `http://192.168.1.12:5000/api/nearby-cybercells?lat=${lat}&lng=${lng}&radius=10000`
      );

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      const updatedCells = data.map((cell) => ({
        ...cell,
        distance: calculateDistance(lat, lng, cell.lat, cell.lng),
      }));

      setNearbyCells(updatedCells);
    } catch (error) {
      console.error("❌ Failed to fetch cyber cells:", error.message);
    }
  };

  const handleLocationSelect = (location) => {
    setUserLocation(location);
    setMapCenter(location);
    fetchCyberCells(location.latitude, location.longitude);
  };

  const handleSearchComplete = (address) => {
    setCurrentAddress(address);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <SearchBox
            onLocationSelect={handleLocationSelect}
            onSearchComplete={handleSearchComplete}
          />
          <GeolocationButton
            onLocationFound={handleLocationSelect}
            disabled={false}
          />
          {currentAddress ? (
            <Text style={styles.addressText}>📍 Current: {currentAddress}</Text>
          ) : null}
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapContainer
            userLocation={userLocation}
            nearbyCells={nearbyCells}
            center={mapCenter}
          />
        </View>

        {/* Cyber Cell List Section */}
        <ScrollView
          style={styles.sidebar}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <CyberCellList
            nearbyCells={nearbyCells}
            userLocation={userLocation}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  addressText: {
    marginTop: 8,
    color: "#0070BA",
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
  },
  sidebar: {
    maxHeight: 220,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
