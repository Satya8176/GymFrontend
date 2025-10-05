import React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Minus, Save, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { membersApi, exercisesApi, routinesApi } from '../mocks/mockApi.js';
import AddWorkout from '../components/AddWorkout.jsx';

const CreateRoutine = () => {
  const [members, setMembers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [selectedDays, setSelectedDays] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersData, exercisesData] = await Promise.all([
        membersApi.getAll(),
        exercisesApi.getAll()
      ]);
      setMembers(membersData);
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

  const removeExerciseFromDay = (day, index) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMember || !routineName) return;

    // Filter out empty days
    const filteredDays = Object.entries(selectedDays).reduce((acc, [day, exercises]) => {
      const validExercises = exercises.filter(ex => ex.exerciseId);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Select Member
                </label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Choose a member...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>
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

            {/* Days and Exercises */}
            <div>
              <h3 className="text-lg font-medium text-card-foreground mb-6">Weekly Schedule</h3>
              
              <div className="space-y-6">
                {daysOfWeek.map((day,index) => (
                  <AddWorkout key={day} day={day} index={index}/>
                ))}
              </div>
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