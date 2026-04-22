import React, { useState, useEffect } from 'react';
import API from '../api/index';
import NavBar from '../components/NavBar';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  // --- STATE MANAGEMENT ---
  const [tasks, setTasks] = useState([]);
  const [activeDay, setActiveDay] = useState('2026-04-08');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' });
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- DATABASE OPERATIONS ---

  // 1. Fetch tasks when date changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/tasks?date=${activeDay}`);
        setTasks(data?.data || []);
      } catch (err) {
        console.error("Error fetching tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [activeDay]);

  // 2. Add a new task to MongoDB
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/tasks', { 
        ...newTask, 
        date: activeDay 
      });
      setTasks([...tasks, data.data]); // Instant UI update
      setShowModal(false); // Close modal
      setNewTask({ title: '', priority: 'medium' }); // Reset form
    } catch (err) {
      alert("Failed to save task. Check your backend connection.");
    }
  };

  // 3. Complete (Delete) a task
    const completeTask = async (id) => {
  try {
    const { data } = await API.put(`/tasks/${id}`, {
      status: "completed"
    });

    setTasks(tasks.map(t => 
      t._id === id ? data.data : t
    ));

  } catch (err) {
    console.error("Error completing task", err);
  }
};
    const [note, setNote] = useState("Extra points: Capture your groceries, links, or quick reminders here.");
    const [isEditingNote, setIsEditingNote] = useState(false);

  return (
    <div className="min-h-screen bg-gelato/20 pb-20 selection:bg-citrus selection:text-white">
      <NavBar />
      
      <main className="max-w-6xl mx-auto p-6 md:p-12">
        {/* --- HEADER SECTION --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-black text-amalfi tracking-tighter"
            >
              Your Space.
            </motion.h2>
            <p className="text-amalfi/60 font-medium text-lg">Focusing on what matters most today.</p>
          </div>

          {/* Cinematic Day Switcher */}
          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-full flex gap-2 shadow-inner border border-white max-w-fit">
            {['Day 1', 'Day 2'].map((day, index) => {
              const targetDate = index === 0 ? '2026-04-08' : '2026-04-09';
              const isActive = activeDay === targetDate;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(targetDate)}
                  className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive ? 'bg-amalfi text-white shadow-lg' : 'text-amalfi/50 hover:text-amalfi'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
  {/* 🔔 Notification Bell */}
  <button 
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative text-2xl"
  >
    🔔

    {/* Badge */}
    {tasks.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
        {tasks.length}
      </span>
    )}
  </button>
</div>
<div className="flex items-center gap-4">
  {/* 🔔 Reminder Button */}
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="bg-amalfi text-white px-5 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-all"
  >
    Reminders ({tasks.length})
  </button>
</div>
        </header>
        {showNotifications && (
  <div className="absolute right-10 top-24 bg-white shadow-2xl rounded-3xl p-6 w-80 z-50 border border-white">
    
    <h4 className="text-xl font-black text-amalfi mb-4">
      Today's Reminders
    </h4>

    {tasks.length === 0 ? (
      <p className="text-amalfi/40 font-bold">
        No tasks for today 🎉
      </p>
    ) : (
      tasks
        .filter(t => t.status !== "completed")
        .map(task => (
          <div key={task._id} className="mb-3 p-3 bg-gelato/20 rounded-xl">
            <p className="font-bold text-amalfi">{task.title}</p>
            <p className="text-xs text-amalfi/50 uppercase">
              {task.priority} priority
            </p>
          </div>
        ))
    )}
  </div>
)}

        {/* --- BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Task List */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-amalfi/40 uppercase tracking-widest ml-2">Active Tasks</h3>
            
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="text-center p-10 text-amalfi/20 font-black italic">Loading...</div>
              ) : tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-4xl shadow-xl shadow-amalfi/5 border border-white flex justify-between items-center group cursor-default"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-4 h-12 rounded-full transition-all group-hover:h-16 ${
                        task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-citrus' : 'bg-seabreeze'
                      }`} />
                      <div>
                        <h3 className="text-amalfi font-extrabold text-2xl leading-none">{task.title}</h3>
                        <p className="text-amalfi/40 font-bold mt-2 uppercase text-[10px] tracking-widest">{task.priority} Priority</p>
                      </div>
                    </div>
                    <motion.button 
  onClick={() => completeTask(task._id)}
  whileTap={{ scale: 0.9 }}
  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
    task.completed ? 'bg-green-400 border-green-400' : 'border-seabreeze hover:bg-seabreeze/10'
  }`}
>
  {task.completed ? (
    <motion.span 
      initial={{ scale: 0 }} 
      animate={{ scale: 1 }} 
      className="text-white text-xl"
    >
      ✓
    </motion.span>
  ) : (
    <div className="w-4 h-4 rounded-sm border-2 border-seabreeze group-hover:border-white" />
  )}
</motion.button>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="bg-white/30 border-2 border-dashed border-amalfi/10 rounded-4xl p-20 text-center"
                >
                  <p className="text-amalfi/30 font-bold">Nothing here yet. Hit the + to start.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Stats & Notes */}
          <aside className="space-y-8">
            <motion.div 
  whileHover={{ scale: 1.01 }}
  className="bg-seabreeze rounded-4xl p-8 text-white shadow-2xl shadow-seabreeze/30 min-h-[22rem] flex flex-col relative overflow-hidden"
>
  {/* Decorator: Subtle tile pattern in background */}
  <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
  
  <h4 className="text-2xl font-black mb-6 flex items-center gap-2">
    <span>Notes</span>
    <div className="w-2 h-2 bg-gelato rounded-full animate-pulse" />
  </h4>
  
  {/* The "Paper" for the text */}
  <div className="flex-grow bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-inner border border-white/50 mb-6">
    {isEditingNote ? (
      <textarea 
        autoFocus
        className="w-full h-full bg-transparent border-none outline-none text-amalfi font-bold text-lg leading-relaxed resize-none placeholder:text-amalfi/30"
        value={note}
        placeholder="Type your thoughts..."
        onChange={(e) => setNote(e.target.value)}
        onBlur={() => setIsEditingNote(false)}
      />
    ) : (
      <p 
        onClick={() => setIsEditingNote(true)}
        className="text-amalfi font-bold text-lg leading-relaxed whitespace-pre-wrap cursor-text"
      >
        {note || "Click to add a note..."}
      </p>
    )}
  </div>

  <button 
    onClick={() => setIsEditingNote(!isEditingNote)}
    className="bg-amalfi text-gelato py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-amalfi/20 transition-all active:scale-95"
  >
    {isEditingNote ? "Save Changes" : "Edit Clipboard"}
  </button>
</motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-citrus rounded-4xl p-8 text-white shadow-2xl shadow-citrus/30"
            >
              <h4 className="text-2xl font-black mb-2">Focus Score</h4>
              <div className="text-5xl font-black tracking-tighter">84%</div>
              <p className="text-white/70 text-sm mt-2 font-medium italic">You're doing great today!</p>
            </motion.div>
          </aside>
        </div>
      </main>

      {/* --- ADD TASK MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-amalfi/40 backdrop-blur-sm"
            />
            
            <motion.form 
              onSubmit={addTask}
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative bg-white p-8 rounded-4xl shadow-2xl w-full max-w-md border border-white"
            >
              <h3 className="text-4xl font-black text-amalfi mb-6 tracking-tighter">New Task</h3>
              
              <input 
                autoFocus
                type="text" 
                placeholder="What's the plan?" 
                className="w-full p-5 rounded-2xl bg-gelato/20 border-none focus:ring-4 focus:ring-seabreeze/50 outline-none text-amalfi font-bold mb-4 text-xl"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />

              <div className="flex gap-2 mb-8">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewTask({...newTask, priority: p})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      newTask.priority === p 
                      ? 'bg-amalfi border-amalfi text-white' 
                      : 'border-gelato/50 text-amalfi/30 hover:border-amalfi/20'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button 
                type="submit"
                className="w-full bg-amalfi text-white p-5 rounded-2xl font-black text-xl shadow-xl shadow-amalfi/30 hover:shadow-amalfi/50 transition-all active:scale-95"
              >
                Schedule Task
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* --- FLOATING ACTION BUTTON --- */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-10 right-10 w-24 h-24 bg-amalfi text-gelato rounded-full shadow-2xl flex items-center justify-center text-5xl z-50 border-8 border-white shadow-amalfi/40"
      >
        +
      </motion.button>
    </div>
  );
};

export default Dashboard;