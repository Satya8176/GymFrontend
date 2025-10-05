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


//From here we need to create rotuine function
