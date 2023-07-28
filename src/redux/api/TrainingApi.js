import API from '../../environment/Api';

// Get All Students by teacherId from API
//monthly
export const getModuleAPI = async data =>
  await API.get(
    `tch_training_getmodulewisestatus/${data.usertype}/${data.userid}/${data.language}`,
  );

export const getContentdetailsAPI = data =>
  API.get(`getcontentdetails/${data.usertype}/${data.moduleid}/od`);

export const getUserTrainingDetailsApi = async data =>
  await API.get(
    `getmoduledetails/${data.userid}/${data.usertype}/${data.moduleid}/${data.language}`,
  );

//ppt
export const getpptModuleAPI = async data =>
  await API.get(
    `ppt_trans_getmodulewisestatus/${data.userid}/${data.language}`,
  );

export const getpptContentdetailsAPI = data =>
  API.get(`ppt_getcontentdetails/${data.moduleid}/od`);

export const getpptUserTrainingDetailsApi = async data =>
  await API.get(
    `ppt_trans_getmoduledetails/${data.userid}/${data.moduleid}/${data.language}`,
  );
