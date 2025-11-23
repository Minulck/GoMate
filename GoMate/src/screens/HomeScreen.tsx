import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Heart, MapPin, Moon, Search, Sun } from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { SkeletonList } from "../components/LoadingSkeleton";
import { Toast } from "../components/Toast";
import { useTheme } from "../contexts/ThemeContext";
import {
  fetchBusStops,
  fetchStopTimetable,
  searchBusStops,
} from "../redux/slices/busSlice";
import {
  addToFavourites,
  loadFavourites,
  removeFromFavourites,
} from "../redux/slices/favouritesSlice";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors, toggleTheme, isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const { stops, loading, error } = useSelector((state) => state.bus);
  const { favourites } = useSelector((state) => state.favourites);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBusStops());
    dispatch(loadFavourites());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchBusStops());
    setRefreshing(false);
    showToast("Refreshed successfully!", "success");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showToast("Please enter a search term", "error");
      return;
    }

    setIsSearching(true);
    try {
      await dispatch(searchBusStops(searchQuery.trim()));
      showToast(`Found results for "${searchQuery}"`, "success");
    } catch (error) {
      showToast("Search failed. Please try again.", "error");
    } finally {
      setIsSearching(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleFavouriteToggle = (stop) => {
    const isFavourite = favourites.some(
      (fav) => fav.atcocode === stop.atcocode
    );
    if (isFavourite) {
      dispatch(removeFromFavourites(stop.atcocode));
      showToast("Removed from favourites", "info");
    } else {
      dispatch(addToFavourites(stop));
      showToast("Added to favourites! ❤️", "success");
    }
  };

  const renderBusStop = ({ item }) => {
    const isFavourite = favourites.some(
      (fav) => fav.atcocode === item.atcocode
    );

    return (
      <TouchableOpacity
        style={styles.destinationCard}
        onPress={() => {
          dispatch(fetchStopTimetable(item.atcocode));
          navigation.navigate("Details", { stop: item });
        }}
      >
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn9IJ8TIlyOtFdSo4hbnZWklNU0bRMIQCeZw&s",
          }}
          style={styles.destinationImage}
        />
        <View style={styles.destinationInfo}>
          <View style={styles.destinationHeader}>
            <Text style={styles.destinationTitle}>{item.name}</Text>
            <TouchableOpacity
              style={styles.favouriteButton}
              onPress={() => handleFavouriteToggle(item)}
            >
              <Heart
                width={20}
                height={20}
                stroke={isFavourite ? colors.primary : colors.textSecondary}
                fill={isFavourite ? colors.primary : "transparent"}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.destinationDescription} numberOfLines={2}>
            Bus stop in {item.locality}
          </Text>
          <View style={styles.destinationFooter}>
            <View style={styles.locationContainer}>
              <MapPin width={14} height={14} stroke={colors.textSecondary} />
              <Text style={styles.locationText}>{item.locality}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.atcocode}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = createStyles(colors);

  if (loading && stops.length === 0) {
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
            <View>
              <Image
                source={{
                  uri: "https://png.pngtree.com/png-vector/20250813/ourmid/pngtree-confident-boy-minimalistic-profile-picture-white-background-png-image_17118035.webp",
                }}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>
                {user?.firstName || "Traveler"}!
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isDarkMode ? (
              <Sun width={20} height={20} stroke={colors.primary} />
            ) : (
              <Moon width={20} height={20} stroke={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search width={20} height={20} stroke={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bus stops..."
            placeholderTextColor={colors.textSecondary}
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

      {/* Bus Stops List with Pull-to-Refresh */}
      <FlatList
        data={stops}
        renderItem={renderBusStop}
        keyExtractor={(item) => item.atcocode}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? "No bus stops found" : "No bus stops available"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? "Try a different search term or pull to refresh"
                : "Pull to refresh to load bus stops"}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    header: {
      backgroundColor: colors.primary,
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
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarImage: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    welcomeSection: {
      flex: 1,
    },
    welcomeText: {
      fontSize: 14,
      color: colors.surface,
      opacity: 0.9,
      fontWeight: "500",
    },
    userName: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.surface,
      marginTop: 2,
    },
    themeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    searchContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
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
      backgroundColor: colors.background,
      borderRadius: 25,
      paddingHorizontal: 16,
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
    },
    searchButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      justifyContent: "center",
    },
    searchButtonText: {
      color: colors.surface,
      fontWeight: "600",
    },
    errorContainer: {
      backgroundColor: colors.error,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    errorText: {
      color: colors.surface,
      textAlign: "center",
    },
    listContainer: {
      padding: 20,
    },
    destinationCard: {
      backgroundColor: colors.surface,
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
      resizeMode: "cover",
    },
    busStopIcon: {
      backgroundColor: colors.surface,
      borderRadius: 40,
      padding: 20,
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
      color: colors.text,
      marginRight: 12,
    },
    favouriteButton: {
      padding: 4,
    },
    destinationDescription: {
      fontSize: 14,
      color: colors.textSecondary,
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
      color: colors.textSecondary,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      marginLeft: 4,
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

export default HomeScreen;
