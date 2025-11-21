import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Heart } from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { Destination } from "../types";
import { toggleFavourite } from "../redux/slices/favouritesSlice";
import { COLORS, SIZES } from "../constants/theme";
import { RootState } from "../redux/store";

interface DestinationCardProps {
  destination: Destination;
  onPress: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onPress,
}) => {
  const dispatch = useDispatch();
  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites
  );
  const isFavourite = favourites.some((fav) => fav.id === destination.id);

  const handleToggleFavourite = () => {
    dispatch(toggleFavourite(destination));
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: destination.image }} style={styles.image} />
      <TouchableOpacity
        style={styles.favouriteButton}
        onPress={handleToggleFavourite}
        activeOpacity={0.7}
      >
        <Heart
          width={20}
          height={20}
          stroke={isFavourite ? COLORS.danger : COLORS.textLight}
          fill={isFavourite ? COLORS.danger : "transparent"}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {destination.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {destination.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${destination.price}</Text>
            <Text style={styles.category}>{destination.category}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ⭐ {destination.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    resizeMode: "cover",
  },
  favouriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  content: {
    padding: SIZES.padding,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: SIZES.lg,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  category: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    textTransform: "capitalize",
  },
  ratingContainer: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: SIZES.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },
});

export default DestinationCard;
