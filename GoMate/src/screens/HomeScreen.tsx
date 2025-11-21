import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Search, MapPin, Star, Heart } from "react-native-feather";
import {
  fetchDestinations,
  searchDestinations,
} from "../redux/slices/destinationsSlice";
import {
  addToFavourites,
  removeFromFavourites,
} from "../redux/slices/favouritesSlice";
import { logout } from "../redux/slices/authSlice";
import { COLORS } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { destinations, loading, error } = useSelector(
    (state) => state.destinations
  );
  const { favourites } = useSelector((state) => state.favourites);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      await dispatch(searchDestinations(searchQuery));
      setIsSearching(false);
    } else {
      dispatch(fetchDestinations());
    }
  };

  const handleFavouriteToggle = (destination) => {
    const isFavourite = favourites.some((fav) => fav.id === destination.id);
    if (isFavourite) {
      dispatch(removeFromFavourites(destination.id));
    } else {
      dispatch(addToFavourites(destination));
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => dispatch(logout()) },
    ]);
  };

  const renderDestination = ({ item }) => {
    const isFavourite = favourites.some((fav) => fav.id === item.id);

    return (
      <TouchableOpacity
        style={styles.destinationCard}
        onPress={() => navigation.navigate("Details", { destination: item })}
      >
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/300x200" }}
          style={styles.destinationImage}
        />
        <View style={styles.destinationInfo}>
          <View style={styles.destinationHeader}>
            <Text style={styles.destinationTitle}>{item.title}</Text>
            <TouchableOpacity
              style={styles.favouriteButton}
              onPress={() => handleFavouriteToggle(item)}
            >
              <Heart
                width={20}
                height={20}
                stroke={isFavourite ? COLORS.primary : COLORS.textSecondary}
                fill={isFavourite ? COLORS.primary : "transparent"}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.destinationDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.destinationFooter}>
            <View style={styles.locationContainer}>
              <MapPin width={14} height={14} stroke={COLORS.textSecondary} />
              <Text style={styles.locationText}>
                {item.location || "Unknown"}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star
                width={14}
                height={14}
                stroke={COLORS.warning}
                fill={COLORS.warning}
              />
              <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && destinations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading destinations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.firstName || "Traveler"}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search width={20} height={20} stroke={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isSearching}
        >
          <Text style={styles.searchButtonText}>
            {isSearching ? "..." : "Search"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Destinations List */}
      <FlatList
        data={destinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No destinations found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: COLORS.primary,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.surface,
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.surface,
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: "center",
  },
  searchButtonText: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  errorText: {
    color: COLORS.surface,
    textAlign: "center",
  },
  listContainer: {
    padding: 20,
  },
  destinationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  destinationInfo: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  destinationTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 12,
  },
  favouriteButton: {
    padding: 4,
  },
  destinationDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  destinationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
