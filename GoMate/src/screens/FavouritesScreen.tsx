import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Star, Trash2 } from "react-native-feather";
import {
  removeFromFavourites,
  setFavourites,
} from "../redux/slices/favouritesSlice";
import { COLORS } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";

const FavouritesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { favourites } = useSelector((state) => state.favourites);

  const styles = createStyles(colors);

  const handleRemoveFavourite = (id) => {
    Alert.alert(
      "Remove Favourite",
      "Are you sure you want to remove this destination from your favourites?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => dispatch(removeFromFavourites(id)) },
      ]
    );
  };

  const handleClearAll = () => {
    if (favourites.length === 0) return;

    Alert.alert(
      "Clear All Favourites",
      "Are you sure you want to remove all destinations from your favourites?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", onPress: () => dispatch(setFavourites([])) },
      ]
    );
  };

  const renderFavourite = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.favouriteCard}
        onPress={() => navigation.navigate("Details", { destination: item })}
      >
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/300x200" }}
          style={styles.favouriteImage}
        />
        <View style={styles.favouriteInfo}>
          <View style={styles.favouriteHeader}>
            <Text style={styles.favouriteTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFavourite(item.id)}
            >
              <Trash2 width={18} height={18} stroke={colors.error} />
            </TouchableOpacity>
          </View>
          <Text style={styles.favouriteDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.favouriteFooter}>
            <View style={styles.locationContainer}>
              <MapPin width={12} height={12} stroke={colors.textSecondary} />
              <Text style={styles.locationText}>
                {item.location || "Unknown"}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star
                width={12}
                height={12}
                stroke={colors.warning}
                fill={colors.warning}
              />
              <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Favourites Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start exploring destinations and add them to your favourites!
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.exploreButtonText}>Explore Destinations</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favourites</Text>
        {favourites.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Favourites Count */}
      {favourites.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {favourites.length}{" "}
            {favourites.length === 1 ? "destination" : "destinations"} saved
          </Text>
        </View>
      )}

      {/* Favourites List */}
      <FlatList
        data={favourites}
        renderItem={renderFavourite}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
      backgroundColor: colors.primary,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.surface,
    },
    clearButton: {
      backgroundColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    clearButtonText: {
      color: colors.surface,
      fontWeight: "600",
      fontSize: 14,
    },
    countContainer: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    countText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    listContainer: {
      padding: 20,
    },
    favouriteCard: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    favouriteImage: {
      width: 100,
      height: 100,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    favouriteInfo: {
      flex: 1,
      padding: 12,
      justifyContent: "space-between",
    },
    favouriteHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    favouriteTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginRight: 8,
    },
    removeButton: {
      padding: 4,
    },
    favouriteDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 8,
    },
    favouriteFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    locationText: {
      marginLeft: 4,
      fontSize: 11,
      color: colors.textSecondary,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      marginLeft: 4,
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 30,
    },
    exploreButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 25,
    },
    exploreButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default FavouritesScreen;
