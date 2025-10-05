import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Save, Calendar, Cross } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { membersApi, exercisesApi, routinesApi } from '../mocks/mockApi.js';
import { motion } from 'framer-motion';

function AddWorkout({day,index}) {

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workouts,setWorkout]=useState([]);
  const [currExercise,setCurrentExercise]=useState();
  const [addExercise,setAddExercise]=useState(false);
  const [addSet,setAddSet]=useState(false);
  const formRef=useRef({
    exercise:'',
    setNo:'',
    weight:'',
    reps:''
  })
  useEffect(() => {
      loadData();
    }, []);

  const loadData = async () => {
      try {
        const [ exercisesData] = await Promise.all([
          exercisesApi.getAll()
        ]);
        setExercises(exercisesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    const addExerciseToDay = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: [
        ...(prev[day] || []),
        { exerciseId: '', sets: 3, reps: 10 }
      ]
    }));
  };
   const updateExercise = (day, index, field, value) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: prev[day].map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

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
          <div className='flex flex-col gap-y-2'>
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <select
                    value={exercises.exerciseId}
                    onChange={(e) => {
                      setCurrentExercise(e.target.value)
                      formRef.current.exercise=e.target.options[e.target.selectedIndex].text;
                    }}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Exercise...</option>
                    {exercises.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} ({ex.muscleGroup})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* From here there is sets and reps which needs to update */}
               
                <button className='hover:text-black hover:font-bold py-1 px-2 bg-blue-500 rounded-sm text-base hover:scale-90'
                type='button'
                onClick={()=>{setAddSet(true)}}
                >
                  Add Sets
                </button>
                <button
                  type="button"
                  onClick={() => setAddExercise(false)}
                  className="text-destructive hover:font-bold hover:text-red-600 py-1 px-2 bg-red-300 rounded-sm hover:scale-90"
                >
                  Cancel
                </button>
                

              </div>
              {addSet&&(
                <div className='flex gap-x-3 my-3'>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      SetNo.
                    </label>
                    <input
                      type="text"
                      onChange={(e)=>{formRef.current.setNo=e.target.value}}
                      className="w-full px-3 py-1 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g. 1 ,2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Weight
                    </label>
                    <input
                      type="text"
                      onChange={(e)=>{formRef.current.weight=e.target.value}}
                      className="w-full px-3 py-1 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g. 10kG"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Reps
                    </label>
                    <input
                      type="text"
                      onChange={(e)=>{formRef.current.reps=e.target.value}}
                      className="w-full px-3 py-1 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g. 10, 15"
                    />
                  </div>
                  <button
                  type="button"
                  className="w-[20%] h-fit text-green-500 hover:font-bold hover:text-green-800 py-1 px-2 bg-green-300 rounded-sm hover:scale-95 mt-7"
                  onClick={()=>{
                    console.log("obj is",formRef.current)
                    //Here we need to call for the workout 
                    // setWorkout(formRef.current);
                    setWorkout(prev => [...prev, formRef.current]);
                    setAddSet(false);
                  }}
                >
                  Save
                </button>
                </div>
              )}
          </div>
           )} 
        {workouts.length > 0 ? (
          <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${addExercise?(""):("rounded-lg")}`}>
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 w-[25%] text-left text-base text-gray-500 dark:text-gray-200 tracking-wider">
                    Exercise
                  </th>
                  <th className="px-6 py-3 w-[25%] text-left text-base text-gray-500 dark:text-gray-200 tracking-wider">
                    Set No.
                  </th>
                  <th className="px-6 py-3 w-[25%] text-left text-base text-gray-500 dark:text-gray-200 tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 w-[25%] text-left text-base text-gray-500 dark:text-gray-200 tracking-wider">
                    Reps
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {workouts.map((workout,index) => (
                  <motion.tr 
                    key={index} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 "
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 w-[25%] whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {workout.exercise}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[25%] whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {workout.setNo}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[25%] whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {workout.weight}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[25%] whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {workout.reps}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
        ) : (
          !addExercise && (<div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No Workout added for {day}</p>
          </div>)
        )}
        {

        }
      </div>
    </div>
  )
}

export default AddWorkout




 {/* <div className="w-20">
                  <label className="block text-xs text-muted-foreground mb-1">Sets</label>
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(day, index, 'sets', parseInt(e.target.value))}
                    className="w-full px-2 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                    max="10"
                  />
                </div> */}
                
                {/* <div className="w-20">
                  <label className="block text-xs text-muted-foreground mb-1">Reps</label>
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(day, index, 'reps', parseInt(e.target.value))}
                    className="w-full px-2 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                    max="50"
                  />
                </div>      */}