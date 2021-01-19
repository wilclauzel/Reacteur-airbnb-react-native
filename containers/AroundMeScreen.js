import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import Map from "../components/Share/Map";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const askUserLocation = async () => {
  try {
    const status = await Location.requestPermissionsAsync();
    if (status.granted) {
      const location = await Location.getCurrentPositionAsync();
      return location.coords;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const handleLoadData = async (setIsLoading, setInitialRegion, setMarkers) => {
  try {
    const userLocation = await askUserLocation();
    let params = "";
    let initialRegion = null;

    if (userLocation) {
      params = `?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`;
      initialRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };
    }
    let response = await axios.get(
      "https://express-airbnb-api.herokuapp.com/rooms/around" + params
    );
    if (params && response.data?.length === 0) {
      //   initialRegion = null; Keep the location even if far away
      response = await axios.get(
        "https://express-airbnb-api.herokuapp.com/rooms/around"
      );
    }

    const tab = [];
    for (let i = 0; i < response.data.length; i++) {
      tab.push({
        id: response.data[i]._id,
        latitude: response.data[i].location[1],
        longitude: response.data[i].location[0],
        title: response.data[i].title,
        description: response.data[i].description,
      });
    }
    setInitialRegion(initialRegion);
    setMarkers(tab);
    setIsLoading(false);
  } catch (error) {
    console.log(error.response);
  }
};

export default function AroundMeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRegion, setInitialRegion] = useState(null);
  const [markers, setMarkers] = useState(null);

  const handlePressMarker = (id) => {
    navigation.navigate("Room", { id });
  };

  useEffect(() => {
    handleLoadData(setIsLoading, setInitialRegion, setMarkers);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <View>
          <Map
            height={windowHeight}
            width={windowWidth}
            showsUserLocation={initialRegion !== null}
            initialRegion={initialRegion}
            markers={markers}
            onPressMarker={handlePressMarker}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
