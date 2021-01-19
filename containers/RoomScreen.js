import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useRoute } from "@react-navigation/core";
import Constants from "expo-constants";
import {
  ActivityIndicator,
  View,
  Dimensions,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Map from "../components/Share/Map";
import RoomCard from "../components/Room/RoomCard";

const handleLoadRoom = async (id, setIsLoading, setRoom) => {
  try {
    const response = await axios.get(
      "https://express-airbnb-api.herokuapp.com/rooms/" + id
    );
    // setTimeout(() => {}, 10000);
    setRoom(response.data);
    setIsLoading(false);
  } catch (error) {
    console.log(error.response);
  }
};

export default function RoomScreen({ route }) {
  const { params } = route;
  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState(null);
  const [allDescription, setAllDescription] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    handleLoadRoom(params.id, setIsLoading, setRoom);
  }, [params.id]);

  return (
    <>
      {isLoading ? (
        <SafeAreaView style={[styles.window, styles.winCenter]}>
          <ActivityIndicator size="large" color="red" />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.window}>
          <ScrollView style={styles.page}>
            <RoomCard
              room={room}
              addInfoHorizPadding={10}
              imageHeight={300}
              withAllImages={true}
            />

            <Text
              style={styles.description}
              numberOfLines={allDescription ? 10 : 3}
            >
              {room.description}
            </Text>
            <TouchableHighlight
              onPress={() => {
                setAllDescription(!allDescription);
              }}
            >
              {allDescription ? (
                <View style={styles.row}>
                  <Text style={styles.more}>Show less</Text>
                  <Ionicons name="md-arrow-dropup" size={24} color="grey" />
                </View>
              ) : (
                <View style={styles.row}>
                  <Text style={styles.more}>Show more</Text>
                  <Ionicons name="md-arrow-dropdown" size={24} color="grey" />
                </View>
              )}
            </TouchableHighlight>
            <Map
              height={200}
              width={"100%"}
              initialRegion={{
                latitude: room.location[1],
                longitude: room.location[0],
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              markers={[
                {
                  id: 1,
                  latitude: room.location[1],
                  longitude: room.location[0],
                  title: room.title,
                  description: room.description,
                },
              ]}
            />
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  window: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  winCenter: {
    justifyContent: "space-around",
  },
  page: {
    // marginTop: 0,
    width: windowWidth,
  },
  description: {
    paddingHorizontal: 10,
    fontSize: 15,
  },
  more: {
    marginTop: 5,
    paddingHorizontal: 10,
    color: "grey",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
