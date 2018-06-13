import update from "react-addons-update";
import constants from "./actionConstants";
import { Dimensions, PermissionsAndroid } from "react-native";
// import Geolocation from 'react-native-geolocation-service';

//Constants
const {GET_CURRENT_LOCATION} = constants;
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

async function requestGPSPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the GPS");
      return true;
    } else {
      console.log("GPS permission denied");
      return false;
    }
  } catch (err) {
    console.warn(err)
  }
}

//Actions
export function getCurrentLocation () {
  return(dispatch)=>{
    // if (requestGPSPermission()) {
    //   Geolocation.getCurrentPosition(
    //     (position) => {
    //       dispatch({
    //         type:GET_CURRENT_LOCATION,
    //         payload:position
    //       });
    //       console.log(position);
    //     },
    //     (error) => {
    //       // See error code charts below.
    //       console.log(error.code, error.message);
    //     },
    //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //   );
    // }


    if (requestGPSPermission()) {
      navigator.geolocation.getCurrentPosition(
        (position)=>{
          dispatch({
            type:GET_CURRENT_LOCATION,
            payload:position
          });
        },
        (error) => console.log(error.message), { enableHighAccuracy: false, timeout: 2000, maximumAge: 3600000 }
      );
    }
  }
}

// ActionHandlers
function handleGetCurrentLocation(state, action) {
  console.log (action.payload);
  return update(state, {
    region: {
      latitude: {
        $set: action.payload.coords.latitude - 2.690783
      },
      longitude: {
        $set: action.payload.coords.longitude - 9.797931
      },
      LATITUDE_DELTA: {
        $set: LATITUDE_DELTA
      },
      LONGITUDE_DELTA: {
        $set: LONGITUDE_DELTA
      }
    }
  });
}

const ACTION_HANDLERS = {
  GET_CURRENT_LOCATION: handleGetCurrentLocation  //tell redux setname action will be handled by function handlesetname
}

const initialState = {
  region:{
    latitude: 19.218331,
    longitude: 72.978090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  }
};

export function HomeReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}