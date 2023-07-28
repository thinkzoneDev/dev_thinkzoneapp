import {combineReducers} from 'redux';
import {reducer as network} from 'react-native-offline';
import UserSlice from '../slices/UserSlice';
import StudentSlice from '../slices/StudentSlice';
import UserCallSlice from '../slices/UserCallSlice';
import TrainingSlice from '../slices/TrainingSlice';
import TrainingSliceNew from '../slices/TrainingSliceNew';
import FcmSlice from '../slices/FcmSlice';

const RootReducer = combineReducers({
  userdata: UserSlice,
  userscalllist: UserCallSlice,
  studentdata: StudentSlice,
  trainingdata: TrainingSlice,
  trainingdataNew: TrainingSliceNew,
  fcmMessage: FcmSlice,
  network,
});

export default RootReducer;
