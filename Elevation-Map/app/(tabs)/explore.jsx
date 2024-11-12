import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

// Initialize Geocoder with your Google API Key
Geocoder.init('YOUR_GOOGLE_API_KEY');  // Replace with your actual API key

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 37.78880,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      // Geocode the address or place name entered by the user
      const response = await Geocoder.from(searchQuery);
      if (response.results.length > 0) {
        const { lat, lng } = response.results[0].geometry.location;
        setRegion({
          ...region,
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for a place"
      />
      <Button title="Search" onPress={handleSearch} />

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}  // Bind region state to the map
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}  // Update region when the user pans/zooms
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
