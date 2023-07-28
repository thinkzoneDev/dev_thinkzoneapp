import API from '../../environment/Api';

export const getCallRecordsbyid = async data =>
  await API.get(
    `gettranspostcallactivitiesbyuserid/${data.userid}/${data.language}/${data.month}/${data.year}`,
  );

// export const getCallActivitiesApi = async () =>
//   await API.get(`getmasterpostcallactivities/od/pge`);

export const saveCallActivityApi = async data =>
  await API.post(`savetranspostcallactivity`, data);
