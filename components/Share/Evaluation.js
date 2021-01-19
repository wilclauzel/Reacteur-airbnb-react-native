import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const stars = (rating) => {
  const tab = [];
  for (let i = 1; i <= 5; i++) {
    tab.push(
      rating >= i ? (
        <FontAwesome key={i} name="star" size={24} color="orange" />
      ) : (
        <FontAwesome key={i} name="star" size={24} color="grey" />
      )
    );
  }
  return tab;
};

const Evaluation = ({ rating }) => {
  return <View style={styles.row}>{stars(rating)}</View>;
};

export default Evaluation;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
