import API from '../../environment/Api';

// Get All Students by teacherId from API
//monthly
export const getModuleAPI = async data =>
  await API.get(
    // `tch_training_getmodulewisestatus/${data.usertype}/${data.userid}/${data.language}`,
    //----------------New api----------------------//
    `getAllModulesWithMarks/${data.userid}/${data.usertype}/training/${data.language}`,
    //----------------New api----------------------//
  );

export const getContentdetailsAPI = data =>
  //API.get(`getcontentdetails/${data.usertype}/${data.moduleid}/od`);
  //----------------new Api--------------------------------//
  API.get(
    // `getAllSubmodulesAndTopics/monalisamoharana99@gmail.com/fellow/training/od/1682768555649`,
    `getAllSubmodulesAndTopics/${data.userid}/${data.usertype}/training/${data.language}/${data.moduleid}`,
  );
//----------------new Api--------------------------------//
export const getUserTrainingDetailsApi = async data =>
  await API.get(
    `getmoduledetails/${data.userid}/${data.usertype}/${data.moduleid}/${data.language}`,
  );

//ppt
export const getpptModuleAPI = async data =>
  await API.get(
    // `ppt_trans_getmodulewisestatus/${data.userid}/${data.language}`,

    //-------------new Api-------------------------------//
    `getAllModulesWithMarks/${data.userid}/${data.usertype}/ppt/${data.language}`,
    //-------------new Api-------------------------------//
  );

export const getpptContentdetailsAPI = async data =>
  // API.get(`ppt_getcontentdetails/${data.moduleid}/od`);
  //-----------------new api--------------------//

  await API.get(
    `getAllSubmodulesAndTopics/${data.userid}/${data.usertype}/ppt/${data.language}/${data.moduleid}`,
  );
//-----------------new api--------------------//

export const getpptUserTrainingDetailsApi = async data =>
  await API.get(
    `ppt_trans_getmoduledetails/${data.userid}/${data.moduleid}/${data.language}`,
  );
