import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Save, Calendar, Cross, ArrowDown, ChevronDown } from "lucide-react";
import Navbar from "./Navbar.jsx";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createTestFun, getAllExercise } from "../serviceFunctions/userRelatedFunc.js";
import { setAllExercises } from "../redux/slices/dataSlice.js";
import ViewTest from "./ViewTest.jsx";

function TakeTest({enrollmentId}) {
  const dispatch = useDispatch();
  const { totalExercies } = useSelector((state) => state.dataSlice);
  const [exercises, setExercises] = useState(totalExercies);
  // const [loading, setLoading] = useState(true);
  // const [workouts, setWorkout] = useState([]);
  const [selectedExerDetial, setSelecExerDetial] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [exercisesTested,setExerciseTested]=useState([]);
  const [addCapability,setAddCapability]=useState(false);

  const formRef = useRef({
        maxWeight: "0",
        maxReps: "0",
      });


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

  // console.log("selected exercises is",selectedExerDetial)

  function saveForCurrExercise(){
    // console.log(formRef)
    setExerciseTested((prev) => [...prev,
                                    {exerciseId:parseInt(selectedExerDetial.id),
                                      name:selectedExerDetial.name,
                                      maxWeight: formRef.current.maxWeight,
                                      maxReps: formRef.current.maxReps,},
                                    ]);
    setAddCapability(false);
  }
  async function createTestHandle() {
    const obj={
      userId:enrollmentId,
      testEntries:exercisesTested
    }
    // console.log(obj)
    await createTestFun(obj)
  }

  return (
    <div>
      <div className="border border-border rounded-lg p-6">
        
          <div className="flex flex-col gap-y-2">
            <div className={`flex items-center space-x-4 p-4 bg-muted/50 rounded-lg`}>
              <div className="flex-1">
                <select
                  value={selectedExerciseId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const name = e.target.options[e.target.selectedIndex].text;
                    // add the selected exercise to the day's list
                    if (id) {
                      setSelecExerDetial({ id, name });
                      setAddCapability(true);
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
            </div>
          </div>

          {/* INorder to show the exercises tested */}
          {exercisesTested.length>0?(<div>
            <ViewTest exercisesTested={exercisesTested} reTest={false}/>
          </div>):(
            <div className="p-2 dark:text-slate-400 text-slate-700">
              No Exercises has been tested
            </div>
          )}
          
          { addCapability && 
            <div className="flex gap-x-3 my-3 px-4 py-2 items-center rounded-lg justify-between bg-muted/50 bg-slate-900 ">
              <div className="flex flex-row gap-2 items-center">
                <label className="block text-sm font-medium text-card-foreground dark:text-slate-200">
                  {selectedExerDetial.name}
                </label>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <label className="block text-sm font-medium text-card-foreground dark:text-slate-200 ">
                  Max Weight
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    formRef.current.maxWeight = e.target.value;
                  }}
                  className="w-[35%] px-1 py-1 bg-input text-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="10 kG"
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <label className="block text-sm font-medium text-card-foreground dark:text-slate-200 ">
                  Max Reps
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    formRef.current.maxReps = e.target.value;
                  }}
                  className="w-[35%] px-1 py-1 bg-input text-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="12"
                />
              </div>
              <button
                type="button"
                className="w-[10%] h-fit text-blue-700 hover:font-bold hover:text-blue-900 py-1 px-2 bg-blue-400 rounded-sm hover:scale-95 "
                onClick={() => {
                  saveForCurrExercise();
                }}
              >
                Save
              </button>
              {/* <button
                type="button"
                className="text-2xl text-red-500 font-bold px-2 hover:cursor-pointer "
                onClick={() => {
                  // setAddSetHandler();
                }}
              >
                Cancel
              </button> */}
            </div>
          }

          <button className={`w-fit h-fit text-black font-bold hover:text-green-900 py-1 px-2 bg-green-400 rounded-sm hover:scale-95 mt-3 ${exercisesTested.length===0?("hidden"):("")}`}
          type="button"
          onClick={()=>{
            console.log("testENteried",exercisesTested)
            createTestHandle();
          }}
          >
            Save Test
          </button>

      </div>
    </div>
  );
}

export default TakeTest;

