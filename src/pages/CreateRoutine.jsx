import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Save, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { membersApi, exercisesApi, routinesApi } from '../mocks/mockApi.js';
import AddWorkout from '../components/AddWorkout.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTests, flattenExerciseList, getAllExercise, getMembers, UserAvailableExercises } from '../serviceFunctions/userRelatedFunc.js';
import { setAllExercises, setUsers } from '../redux/slices/dataSlice.js';
import ViewTest from '../components/ViewTest.jsx';

const CreateRoutine = () => {
  const dispatch = useDispatch();
  const {totalMembers}=useSelector((state)=>state.dataSlice)
  const {totalExercies}=useSelector((state)=>state.dataSlice)
  const [members, setMembers] = useState(totalMembers);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [exercises, setExercises] = useState(totalExercies);
  const [selectedMember, setSelectedMember] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [selectedDays, setSelectedDays] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const memberInputRef = useRef(null);
  const [availableExercise,setAvailableExercise]=useState();

  const [showTestTable,setShowTestTable]=useState();
  
//  console.log(selectedMember)
  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (memberInputRef.current && !memberInputRef.current.contains(e.target)) {
        setShowMemberDropdown(false);
      }
    }

    function handleKey(e) {
      if (e.key === 'Escape') setShowMemberDropdown(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(()=>{
    const run=async()=>{
      const data=await fetchUserTests(selectedMember);
      const newData=flattenExerciseList(data);
      const exer=UserAvailableExercises(data);
      setShowTestTable(newData);
      setAvailableExercise(exer);
    }
    if(selectedMember){
      console.log("seleted mem",selectedMember)
      run();
    }
  },[selectedMember])

  // Keep the input text in sync when selectedMember is set programmatically
  useEffect(() => {
    if (selectedMember) {
      const m = (members || []).find(x => x.enrollmentId === selectedMember);
      if (m) setMemberSearch(m.name);
    }
  }, [selectedMember, members]);
  

  const daysOfWeek = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];

  useEffect(() => {
    if (!totalMembers || totalMembers.length === 0) {
      const run=async()=>{
        const data=await getMembers();
        dispatch(setUsers(data))
        setMembers(data)
      }
      run();
    }
  }, [totalMembers, dispatch]);




  const [weekRoutine,setWeekRoutine]=useState([]);

  function addSingleDayRoutine(obj){
    // obj -> { day: 'Monday', workouts: [...] }
    console.log("SIngle day workout in createRoutine",obj)
    // keep the existing array (for any other usage)
    setWeekRoutine((prev) => {
      // replace existing entry for same day if present
      const others = prev.filter(p => p.day !== obj.day);
      return [...others, obj];
    });

    // also store in selectedDays (used on submit)
    setSelectedDays((prev) => {
      const next = { ...prev };
      next[obj.day] = obj.workouts || [];

      // duplicate mapping: Monday->Thursday, Tuesday->Friday, Wednesday->Saturday
      const idx = daysOfWeek.indexOf(obj.day);
      if (idx >= 0 && idx < 3) {
        const mappedDay = daysOfWeek[idx + 3];
        // clone the workouts array so further edits don't mutate both references
        next[mappedDay] = obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : [];
      }

      return next;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMember || !routineName) return;
    const obj={
      "Member":selectedMember,
      "Name":routineName,
      "WeekRoutine":weekRoutine
    }
    console.log("Week Routine is",obj)
    // Filter out empty days
    const filteredDays = Object.entries(selectedDays).reduce((acc, [day, exercises]) => {
      const validExercises = exercises.filter(ex => ex.id);
      if (validExercises.length > 0) {
        acc[day] = validExercises;
      }
      return acc;
    }, {});

    if (Object.keys(filteredDays).length === 0) {
      alert('Please add at least one exercise to one day.');
      return;
    }

    setSaving(true);
    try {
      await routinesApi.create({
        memberId: selectedMember,
        name: routineName,
        days: filteredDays
      });
      
      // Reset form
      setSelectedMember('');
      setRoutineName('');
      setSelectedDays({});
    } catch (error) {
      console.error('Failed to create routine:', error);
    } finally {
      setSaving(false);
    }
  };

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Routine</h1>
          <p className="mt-2 text-muted-foreground">Design workout routines for your members</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Select Member
                  </label>
                  <div className="relative" ref={memberInputRef}>
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => {
                        const v = e.target.value;
                        setMemberSearch(v);
                        setShowMemberDropdown(true);
                        if (v === '') {
                          // clear selected when user empties the input
                          setSelectedMember('');
                        }
                      }}
                      onFocus={() => setShowMemberDropdown(true)}
                      placeholder="Search or choose a member..."
                      className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      aria-label="Search members"
                      required
                    />

                    {showMemberDropdown && (
                      <ul className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-card border border-border shadow-lg">
                        {(members || []).filter(m => {
                          const q = (memberSearch || '').toLowerCase();
                          return (
                            !q ||
                            m.name.toLowerCase().includes(q) ||
                            (m.enrollmentId && String(m.enrollmentId).toLowerCase().includes(q))
                          );
                        }).map(member => (
                          <li
                            key={member.id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSelectedMember(member.enrollmentId);
                              setMemberSearch(member.name);
                              setShowMemberDropdown(false);
                            }}
                            className="cursor-pointer px-3 py-2 hover:bg-muted-foreground/10"
                          >
                            <div className="flex justify-between">
                              <span>{member.name}</span>
                            </div>
                          </li>
                        ))}
                        {(members || []).length === 0 && (
                          <li className="px-3 py-2 text-sm text-muted-foreground">No members</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Routine Name
                  </label>
                  <input
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Strength Training - Week 1"
                    required
                  />
                </div>
              </div>
              <div className='text-xl py-3'>
                {
                  selectedMember && showTestTable ? (<ViewTest exercisesTested={showTestTable} reTest={false}/>):(<div className='text-slate-300 font-bold text-xl'></div>)
                }
              </div>
            </div>
              

            {/* Days and Exercises */}
            <div>
              <h3 className="text-lg font-medium text-card-foreground mb-6">Weekly Schedule</h3>
              
              { 
                <div className="space-y-6">
                {daysOfWeek.map((day,index) => (
                  <AddWorkout
                    key={day}
                    day={day}
                    index={index}
                    addSingleDayRoutine={addSingleDayRoutine}
                    initialWorkouts={selectedDays[day] || []}
                    selectedMember={selectedMember}
                    exercises={availableExercise}
                  />
                ))}
              </div>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !selectedMember || !routineName}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium py-3 px-6 rounded-lg hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Creating...' : 'Create Routine'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;











  // useEffect(() => {
  //   loadData();
  // }, []);

  // const loadData = async () => {
  //   try {
  //     const [membersData, exercisesData] = await Promise.all([
  //       membersApi.getAll(),
  //       exercisesApi.getAll()
  //     ]);
  //     setMembers(membersData);
  //     setExercises(exercisesData);
  //   } catch (error) {
  //     console.error('Failed to load data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const addExerciseToDay = (day) => {
  //   setSelectedDays(prev => ({
  //     ...prev,
  //     [day]: [
  //       ...(prev[day] || []),
  //       { exerciseId: '', sets: 3, reps: 10 }
  //     ]
  //   }));
  // };

  // const removeExerciseFromDay = (day, index) => {
  //   setSelectedDays(prev => ({
  //     ...prev,
  //     [day]: prev[day].filter((_, i) => i !== index)
  //   }));
  //    };

  // const updateExercise = (day, index, field, value) => {
  //   setSelectedDays(prev => ({
  //     ...prev,
  //     [day]: prev[day].map((exercise, i) => 
  //       i === index ? { ...exercise, [field]: value } : exercise
  //     )
  //   }));
  // };
  // console.log(totalExercies)