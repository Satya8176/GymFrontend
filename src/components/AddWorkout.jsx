import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Save, Calendar, Cross, ArrowDown, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { membersApi, exercisesApi, routinesApi } from "../mocks/mockApi.js";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAllExercise } from "../serviceFunctions/userRelatedFunc.js";
import { setAllExercises } from "../redux/slices/dataSlice.js";
import AddSets from "./AddSets.jsx";

function AddWorkout({ day, addSingleDayRoutine,index }) {
  const dispatch = useDispatch();
  const { totalExercies } = useSelector((state) => state.dataSlice);
  const [exercises, setExercises] = useState(totalExercies);
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkout] = useState([]);
  const [currDayExercise, setCurrentDayExercise] = useState([]);
  const [addExercise, setAddExercise] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [isSaved,setIsSaved]=useState(false);
  const [deleteBtn,setDeleteBtn]=useState(true);
  // const formRef = useRef({
  //   exercise: "",
  //   setNo: "",
  //   weight: "",
  //   reps: "",
  // });
  // useEffect(() => {
  //     loadData();
  //   }, []);

  // const loadData = async () => {
  //     try {
  //       const [ exercisesData] = await Promise.all([
  //         exercisesApi.getAll()
  //       ]);
  //       setExercises(exercisesData);
  //     } catch (error) {
  //       console.error('Failed to load data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  // console.log("Workout array is",workouts);

  useEffect(() => {
    if (!totalExercies || totalExercies.length === 0) {
      const run = async () => {
        const data = await getAllExercise();
        dispatch(setAllExercises(data));
        setExercises(data);
      };
      run();
    }
  }, [totalExercies, dispatch]);

  function deleteWorkOut(value){
    console.log(value)
    setCurrentDayExercise(prev => prev.filter((item, i) => item.id !== value));
    setWorkout(prev=>prev.filter((item,i)=>item.Exercise !==value))
  }

  function addWorkOutHandler(sglWorlOut){
    setWorkout((prev)=>[...prev,sglWorlOut]);
  }
  function handleSaveForDay(){
    setIsSaved(true);
    setDeleteBtn(false);
    const forSingleDay={
      "day":day,
      "workouts":workouts
    }
    addSingleDayRoutine(forSingleDay)
  }
  
  // function setAddSetHandler(){
  //   setAddSets(!addSets);
  // }
  return (
    <div>
      <div key={day} className="border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h4 className="text-lg font-medium text-card-foreground">{day}</h4>
          </div>
          <button
            type="button"
            onClick={() => setAddExercise(true)}
            className="flex items-center space-x-2 px-3 py-2 text-primary hover:text-primary-foreground hover:bg-primary/90 rounded-md transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Workout</span>
          </button>
        </div>
        {addExercise && (
          <div className="flex flex-col gap-y-2">
            <div className={`flex items-center space-x-4 p-4 bg-muted/50 rounded-lg ${isSaved ?("hidden"):("")}`}>
              <div className="flex-1">
                <select
                  value={selectedExerciseId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const name = e.target.options[e.target.selectedIndex].text;
                    // add the selected exercise to the day's list
                    if (id) {
                      setCurrentDayExercise((prev) => [...prev, { id, name }]);
                      // reset the select so it shows the placeholder instead of the previous selection
                      setSelectedExerciseId('');
                    } else {
                      setSelectedExerciseId('');
                    }
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Exercise...</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.muscleGroup})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setAddExercise(false)}
                className="text-destructive hover:font-bold hover:text-red-600 py-1 px-2 bg-red-300 rounded-sm hover:scale-90"
              >
                ❌
              </button>
            </div>
          </div>
        )}
        {currDayExercise.length > 0 ? (
          <div className="">
            {currDayExercise.map((ex,index)=>{
              return (
                <div key={index}>
                   <AddSets key={index} ex={ex} deleteWorkOut={deleteWorkOut} addWorkOutHandler={addWorkOutHandler} deleteBtn={deleteBtn}/>
                </div>
                )
            })}
          </div>

        ) : (
          !addExercise && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No Workout added for {day}</p>
            </div>
          )
        )}
      <button className={`w-fit h-fit text-black font-bold hover:text-green-900 py-1 px-2 bg-green-400 rounded-sm 
      hover:scale-95 mt-1 ${workouts.length===0 || isSaved?("hidden"):("")}`}
      onClick={()=>{handleSaveForDay()}}
      type="button"
      >Save for the {day}</button>
      </div>
    </div>
  );
}

export default AddWorkout;

{
  /* <div className="w-20">
                  <label className="block text-xs text-muted-foreground mb-1">Sets</label>
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(day, index, 'sets', parseInt(e.target.value))}
                    className="w-full px-2 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                    max="10"
                  />
                </div> */
}

{
  /* <div className="w-20">
                  <label className="block text-xs text-muted-foreground mb-1">Reps</label>
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(day, index, 'reps', parseInt(e.target.value))}
                    className="w-full px-2 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                    max="50"
                  />
                </div>      */
}
