import React from "react";
import MapView from "react-native-maps";
import { View } from "react-native";

const Map = ({
  height,
  width,
  initialRegion,
  showsUserLocation,
  markers,
  onPressMarker,
}) => {
  return (
    <View>
      <MapView
        style={{
          height: height,
          width: width,
        }}
        initialRegion={initialRegion}
        showsUserLocation={showsUserLocation}
      >
        {markers &&
          markers.map((marker) => {
            return (
              <MapView.Marker
                onPress={(e) => {
                  e.stopPropagation();
                  onPressMarker && onPressMarker(marker.id);
                }}
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title}
              />
            );
          })}
      </MapView>
    </View>
  );
};

export default Map;
