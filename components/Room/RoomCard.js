import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Evaluation from "../Share/Evaluation";
import SwiperFlatList from "react-native-swiper-flatlist";

const RoomCard = ({
  room,
  imageHeight,
  addInfoHorizPadding,
  withAllImages,
}) => {
  const uriImg = room.photos[0].url;
  const uriAvatar = room.user.account.photo.url;
  return (
    <View>
      <View style={[styles.posRelative]}>
        {withAllImages ? (
          <SwiperFlatList
            autoplay
            autoplayDelay={3}
            index={3}
            autoplayLoop
            data={room.photos}
            renderItem={(
              { item } // Standard Image
            ) => (
              <View style={[{ backgroundColor: "#000" }]}>
                <Image
                  source={{ uri: item.url }}
                  style={{
                    height: imageHeight,
                    width: windowWidth,
                  }}
                  resizeMode="cover"
                />
              </View>
            )}
            showPagination
          />
        ) : (
          <Image
            source={{ uri: uriImg }}
            style={{
              height: imageHeight,
            }}
            resizeMode="cover"
          />
        )}

        <View style={[styles.priceZone, styles.centerHV]}>
          <Text style={styles.price}>{`${room.price} €`}</Text>
        </View>
      </View>

      <View
        style={[
          styles.row,
          styles.spaceB,
          styles.marginV,
          { paddingHorizontal: addInfoHorizPadding },
        ]}
      >
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {room.title}
          </Text>
          <View style={[styles.row]}>
            <View style={styles.width50}>
              <Evaluation rating={room.ratingValue} />
            </View>
            <View style={[styles.row, styles.width50, styles.left]}>
              <Text style={styles.legend}>{room.reviews} reviews</Text>
            </View>
          </View>
        </View>
        <Image
          source={{ uri: uriAvatar }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default RoomCard;

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  image: {
    // height: 200,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  priceZone: {
    position: "absolute",
    bottom: 10,
    left: 0,
    backgroundColor: "black",
    height: 50,
    width: 100,
  },
  centerHV: {
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    color: "white",
    fontSize: 20,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "white",
  },
  info: {
    flex: 1,
  },
  width50: {
    flex: 0.5,
  },
  spaceB: {
    justifyContent: "space-between",
  },
  left: {
    justifyContent: "flex-start",
  },
  legend: {
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: "400",
    color: "#7f7b7b",
  },
  marginV: {
    marginVertical: 10,
  },
  posRelative: {
    position: "relative",
  },
});
