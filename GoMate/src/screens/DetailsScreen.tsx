import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, MapPin, Star, Heart } from "react-native-feather";
import {
  addToFavourites,
  removeFromFavourites,
} from "../redux/slices/favouritesSlice";
import { COLORS } from "../constants/theme";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const DetailsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { destination } = route.params || {};

  const { favourites } = useSelector((state) => state.favourites);
  const isFavourite = favourites.some((fav) => fav.id === destination?.id);

  const handleFavouriteToggle = () => {
    if (!destination) return;

    if (isFavourite) {
      dispatch(removeFromFavourites(destination.id));
    } else {
      dispatch(addToFavourites(destination));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!destination) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Destination not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: destination.image || "https://via.placeholder.com/400x300",
          }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backIcon} onPress={handleBack}>
          <ArrowLeft width={24} height={24} stroke={COLORS.surface} />
        </TouchableOpacity>

        {/* Favourite Button */}
        <TouchableOpacity
          style={styles.favouriteIcon}
          onPress={handleFavouriteToggle}
        >
          <Heart
            width={24}
            height={24}
            stroke={isFavourite ? COLORS.primary : COLORS.surface}
            fill={isFavourite ? COLORS.primary : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Rating */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{destination.title}</Text>
          <View style={styles.ratingContainer}>
            <Star
              width={16}
              height={16}
              stroke={COLORS.warning}
              fill={COLORS.warning}
            />
            <Text style={styles.rating}>{destination.rating || "4.5"}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <MapPin width={16} height={16} stroke={COLORS.textSecondary} />
          <Text style={styles.location}>
            {destination.location || "Unknown Location"}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {destination.description ||
              "No description available for this destination."}
          </Text>
        </View>

        {/* Additional Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>
              {destination.category || "Travel"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>${destination.price || "99"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>
              {destination.duration || "1-3 days"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.favouriteButton]}
            onPress={handleFavouriteToggle}
          >
            <Heart
              width={20}
              height={20}
              stroke={isFavourite ? COLORS.surface : COLORS.primary}
              fill={isFavourite ? COLORS.surface : "transparent"}
            />
            <Text
              style={[
                styles.actionButtonText,
                isFavourite && styles.favouriteButtonText,
              ]}
            >
              {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.bookButton]}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  favouriteIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  location: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  detailsSection: {
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  favouriteButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  favouriteButtonText: {
    color: COLORS.surface,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
});

export default DetailsScreen;
