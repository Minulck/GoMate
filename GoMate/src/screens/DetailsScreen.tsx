import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, Heart, MapPin } from "react-native-feather";
import { lightTheme, useTheme } from "../contexts/ThemeContext";
import {
  addToFavourites,
  removeFromFavourites,
} from "../redux/slices/favouritesSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { Departure } from "../types";
import { RootStackParamList } from "../types/navigation";

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Details"
>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;

const DetailsScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const route = useRoute<DetailsScreenRouteProp>();
  const { colors } = useTheme();
  const { stop } = route.params;

  const styles = createStyles(colors);

  const { favourites } = useAppSelector((state) => state.favourites);
  const { timetable, loading } = useAppSelector((state) => state.bus);
  const isFavourite = favourites.some((fav) => fav.atcocode === stop?.atcocode);

  const handleFavouriteToggle = () => {
    if (!stop) return;

    if (isFavourite) {
      dispatch(removeFromFavourites(stop.atcocode));
    } else {
      dispatch(addToFavourites(stop));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderDeparture = ({ item }: { item: Departure }) => (
    <View style={styles.departureItem}>
      <View style={styles.departureHeader}>
        <View style={styles.busIcon}>
          <MaterialIcons
            name="directions-bus"
            size={20}
            color={colors.primary}
          />
        </View>
        <View style={styles.departureInfo}>
          <Text style={styles.lineText}>{item.line}</Text>
          <Text style={styles.directionText}>{item.direction}</Text>
        </View>
        <Text style={styles.timeText}>
          {item.best_departure_estimate ||
            item.expected_departure_time ||
            item.aimed_departure_time}
        </Text>
      </View>
      <Text style={styles.operatorText}>{item.operator_name}</Text>
    </View>
  );

  if (!stop) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bus stop not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn9IJ8TIlyOtFdSo4hbnZWklNU0bRMIQCeZw&s",
          }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backIcon} onPress={handleBack}>
          <ArrowLeft width={24} height={24} stroke={colors.surface} />
        </TouchableOpacity>

        {/* Favourite Button */}
        <TouchableOpacity
          style={styles.favouriteIcon}
          onPress={handleFavouriteToggle}
        >
          <Heart
            width={24}
            height={24}
            stroke={isFavourite ? colors.primary : colors.surface}
            fill={isFavourite ? colors.primary : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Location */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{stop.name}</Text>
          <View style={styles.locationContainer}>
            <MapPin width={16} height={16} stroke={colors.textSecondary} />
            <Text style={styles.location}>{stop.locality}</Text>
          </View>
        </View>

        {/* Timetable */}
        <View style={styles.timetableSection}>
          <Text style={styles.sectionTitle}>Departures</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading timetable...</Text>
          ) : timetable && timetable.departures.length > 0 ? (
            <FlatList
              data={timetable.departures}
              renderItem={renderDeparture}
              keyExtractor={(item, index) => `${item.line}-${index}`}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noDeparturesText}>No departures available</Text>
          )}
        </View>

        {/* Stop Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Stop Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ATCO Code:</Text>
            <Text style={styles.detailValue}>{stop.atcocode}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Timing Point:</Text>
            <Text style={styles.detailValue}>
              {stop.timing_point ? "Yes" : "No"}
            </Text>
          </View>

          {stop.latitude && stop.longitude && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Coordinates:</Text>
              <Text style={styles.detailValue}>
                {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
              </Text>
            </View>
          )}
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
              stroke={isFavourite ? colors.surface : colors.primary}
              fill={isFavourite ? colors.surface : "transparent"}
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
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    errorText: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 20,
      textAlign: "center",
    },
    backButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
    },
    backButtonText: {
      color: colors.surface,
      fontWeight: "600",
    },
    header: {
      height: 200,
      backgroundColor: colors.primary,
      position: "relative",
    },
    headerImage: {
      width: "100%",
      height: "100%",
      position: "absolute",
      resizeMode: "cover",
    },
    headerOverlay: {
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
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    location: {
      marginLeft: 8,
      fontSize: 16,
      color: colors.textSecondary,
    },
    timetableSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      paddingVertical: 20,
    },
    noDeparturesText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      paddingVertical: 20,
    },
    departureItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    departureHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    busIcon: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 8,
      marginRight: 12,
    },
    departureInfo: {
      flex: 1,
    },
    lineText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    directionText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    timeText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    operatorText: {
      fontSize: 14,
      color: colors.textSecondary,
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
      borderBottomColor: colors.border,
    },
    detailLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
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
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    favouriteButtonText: {
      color: colors.surface,
    },
  });

export default DetailsScreen;
