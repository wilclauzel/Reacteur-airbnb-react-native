import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from "expo-constants";
import {
  ActivityIndicator,
  Button,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import RoomCard from "../components/Room/RoomCard";

const handleLoadRooms = async (setRooms, setIsLoading) => {
  try {
    const response = await axios.get(
      "https://express-airbnb-api.herokuapp.com/rooms"
    );
    // setTimeout(() => {}, 5000);
    setRooms(response.data);
    setIsLoading(false);
  } catch (error) {
    console.log(error.response);
  }
};

export default function HomeScreen({ navigation }) {
  const [rooms, setRooms] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleLoadRooms(setRooms, setIsLoading);
  }, []);

  return (
    <SafeAreaView style={styles.window}>
      {isLoading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <View style={styles.page}>
          <FlatList
            ItemSeparatorComponent={
              Platform.OS !== "android" &&
              (({ highlighted }) => (
                <View
                  style={[styles.separator, highlighted && { marginLeft: 0 }]}
                />
              ))
            }
            data={rooms}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index, separators }) => (
              <TouchableHighlight
                key={item.key}
                onPress={() => {
                  navigation.navigate("Room", { id: item._id });
                }}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
              >
                <RoomCard
                  key={item._id}
                  room={item}
                  addInfoHorizPadding={0}
                  imageHeight={200}
                  withAllImages={false}
                />
              </TouchableHighlight>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  window: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
  },
  page: {
    marginTop: 10,
    width: windowWidth - 40,
    // Ces 2 attributs pour le scroll de la Flalist
    flex: 1,
    marginBottom: 5,
  },
  separator: {
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 10,
  },
});
