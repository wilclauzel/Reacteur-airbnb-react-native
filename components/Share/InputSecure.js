import React, { useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View, TouchableHighlight } from "react-native";

const InputSecure = ({ placeholder, value, setValue, styles }) => {
  const [secureMode, setSecureMode] = useState(true);
  return (
    <View style={localStyles.row}>
      <TextInput
        style={styles}
        placeholder={placeholder}
        autoCapitalize="none"
        secureTextEntry={secureMode}
        value={value}
        onChangeText={(txt) => {
          setValue(txt);
        }}
      />
      <TouchableHighlight
        onPress={() => {
          setSecureMode(!secureMode);
        }}
      >
        {secureMode ? (
          <Octicons name="eye" size={24} color="red" />
        ) : (
          <Octicons name="eye-closed" size={24} color="red" />
        )}
      </TouchableHighlight>
    </View>
  );
};

export default InputSecure;

const localStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
