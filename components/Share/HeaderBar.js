import React from "react";
import Constants from "expo-constants";
import { View, StyleSheet, Image, StatusBar, SafeAreaView } from "react-native";

const HeaderBar = () => {
  return (
    <SafeAreaView>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor={"white"}
      />
      <View style={styles.bar}>
        <Image
          source={require("../../assets/airbnb_logo.png")}
          resizeMode="contain"
          style={styles.logo}
        ></Image>
      </View>
    </SafeAreaView>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  bar: {
    height: Platform.OS === "android" ? 80 : 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  logo: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    height: 40,
    width: 40,
  },
});
