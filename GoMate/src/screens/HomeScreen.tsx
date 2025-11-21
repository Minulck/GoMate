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
  RefreshControl,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Star,
  Heart,
  LogOut,
  User,
} from "react-native-feather";
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
import { SkeletonList } from "../components/LoadingSkeleton";
import { Toast } from "../components/Toast";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const { destinations, loading, error } = useSelector(
    (state) => state.destinations
  );
  const { favourites } = useSelector((state) => state.favourites);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    setSearchQuery("");
    await dispatch(fetchDestinations());
    setRefreshing(false);
    showToast("Refreshed successfully!", "success");
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

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
      showToast("Removed from favourites", "info");
    } else {
      dispatch(addToFavourites(destination));
      showToast("Added to favourites! ❤️", "success");
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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>
              {user?.firstName || "Traveler"}!
            </Text>
          </View>
        </View>
        <SkeletonList count={4} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      {/* Header with Gradient Effect */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <User width={24} height={24} stroke={COLORS.surface} />
            </View>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>
                {user?.firstName || "Traveler"}!
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut width={20} height={20} stroke={COLORS.surface} />
          </TouchableOpacity>
        </View>
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

      {/* Destinations List with Pull-to-Refresh */}
      <FlatList
        data={destinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No destinations found</Text>
            <Text style={styles.emptySubtext}>
              Try a different search term or pull to refresh
            </Text>
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
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.surface,
    opacity: 0.9,
    fontWeight: "500",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.surface,
    marginTop: 2,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  destinationImage: {
    width: "100%",
    height: 220,
    backgroundColor: COLORS.border,
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
