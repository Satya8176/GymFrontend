import axios from "axios";
import toast from "react-hot-toast";


export const uploadCsv=async(selectedFile)=>{
  try{
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await axios.post(
          "http://localhost:4000/api/user/create",
          formData,
          { headers: {
            "Content-Type": "multipart/form-data",
            },
          }
        );
    // const result = res.data;
    // console.log("Server response:", result);
    // Optionally check for error in result, depending on your API
    if (res.status !== 200) throw new Error(result.message || "Upload failed");
    toast.success("Upload Sucessfull")
    }
  catch(err){
    console.log(err);
    toast.error("Error in Uploading");
  }
}

export const getMembers=async()=>{
  try{
    const res=await axios.get(
      "http://localhost:4000/api/user/getUsers"
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Fetching members fails");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error in getting Members",err)
  }
}

export const getSingleUser=async(enrollmentId)=>{
  try{
    const body=new FormData();
    body.append("enrollmentId",enrollmentId)
    const res=await axios.post(
      "http://localhost:4000/api/user/get-single-user",
      body
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Fetching members fails");
    const data = res.data;
    return data.data || data.users
  }
  catch(err){
    console.log("Error in getting Member",err)
  }
}

export const createExercise=async(body)=>{
  try{
    const res=await axios.post(
      "http://localhost:4000/api/workout/create-exercise",
      body
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Create exercise failed");
    toast.success("Exercises Created");
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Exercise Creation Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const getAllExercise=async()=>{
  try{
    const res=await axios.get(
      "http://localhost:4000/api/workout/get-all-exercise"
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Get all exercise failed");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error is getting Exercises",err);
  }
}

export const getAllRoutine=async(body)=>{
  try{
    const res=await axios.post(
      "http://localhost:4000/api/getWorkout/get-all-routines",
      body
    )

    if (res.status !== 200) throw new Error(res.data?.message || "Get all routines failed");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error in getting routine",err)
  }
}

export const getLatestRoutine=async(body)=>{
  try{
    const res=await axios.post(
      "http://localhost:4000/api/getWorkout/get-latest-routine",
      body
    )

    if (res.status !== 200) throw new Error(res.data?.message || "Get latest routine failed");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error in getting routine",err)
  }
}


//From here test realted data is there

export const createTestFun=async(body)=>{
  try{
    const res=await axios.post(
      "http://localhost:4000/api/test/create-test",
      body
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Test upload failed");
    toast.success("Test Submitted Successfully");
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Test Creation Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const reTest=async(body)=>{
  try{
    const res=await axios.post(
      "http://localhost:4000/api/test/retest",
      body
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Retest upload failed");
    toast.success("Test Submitted Successfully");
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Retest Creation Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const fetchUserTests=async(enrollmentId)=>{
  try{
    const fd=new FormData();
    fd.append("userId",enrollmentId)
    const res=await axios.post(
      "http://localhost:4000/api/test/get-test",
      fd
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Test fetching Error");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Test fetching Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const flattenExerciseList=(dataArray)=>{
  return dataArray.map(item => ({
    userId: item.userId,
    exerciseId: item.exerciseId,
    name: item.exercise?.name || null,
    maxReps: item.maxReps,
    maxWeight: item.maxWeight
  }));
}

export const UserAvailableExercises=(dataArray)=>{
  return dataArray.map(item=>({
    id:item.exerciseId,
    name:item.exercise?.name,
    maxReps: item.maxReps,
    maxWeight: item.maxWeight
  }))
}



//From here we need to create rotuine function
