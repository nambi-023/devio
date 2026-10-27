import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search, LayoutDashboard, Compass, Map, Bookmark, Settings, Bell, ChevronDown,
  ArrowUpRight, Clock3, CircleCheck, Circle, Play, Code2, Database, BrainCircuit,
  Globe2, Smartphone, ShieldCheck, Cloud, Menu, X, Sparkles, Flame, Plus, Filter,
  Check, ChevronRight, Zap, BookOpen, Github
} from 'lucide-react';
import './styles.css';

const roadmapData = [
  { id:'frontend', title:'Frontend Developer', category:'Web development', level:'Beginner', duration:'6–8 months', progress:68, color:'violet', icon:Code2, description:'Build beautiful, accessible, responsive web experiences.', tags:['HTML','CSS','JavaScript','React'], featured:true },
  { id:'backend', title:'Backend Developer', category:'Web development', level:'Intermediate', duration:'7–9 months', progress:32, color:'lime', icon:Database, description:'Design APIs, databases, authentication and scalable services.', tags:['Node.js','APIs','SQL','Security'] },
  { id:'ai', title:'AI & Machine Learning', category:'Artificial intelligence', level:'Intermediate', duration:'8–12 months', progress:14, color:'purple', icon:BrainCircuit, description:'Learn Python, core ML concepts and practical AI workflows.', tags:['Python','Math','ML','LLMs'] },
  { id:'fullstack', title:'Full Stack Developer', category:'Web development', level:'Intermediate', duration:'10–12 months', progress:0, color:'violet', icon:Globe2, description:'Connect polished frontend interfaces to reliable backends.', tags:['React','Node.js','Database','Deploy'] },
  { id:'devops', title:'DevOps Engineer', category:'Cloud & infrastructure', level:'Advanced', duration:'8–10 months', progress:0, color:'lime', icon:Cloud, description:'Automate delivery, infrastructure, observability and operations.', tags:['Linux','Docker','CI/CD','Cloud'] },
  { id:'cyber', title:'Cybersecurity', category:'Security', level:'Beginner', duration:'6–9 months', progress:0, color:'purple', icon:ShieldCheck, description:'Understand systems, threat models and defensive security.', tags:['Networking','Linux','Security','Labs'] },
  { id:'mobile', title:'Mobile Developer', category:'App development', level:'Beginner', duration:'5–7 months', progress:0, color:'lime', icon:Smartphone, description:'Create fast, intuitive apps for phones and tablets.', tags:['Kotlin','Swift','React Native'] },
  { id:'data', title:'Data Analyst', category:'Data', level:'Beginner', duration:'4–6 months', progress:0, color:'violet', icon:Database, description:'Turn raw data into useful insights and clear stories.', tags:['SQL','Python','Spreadsheets','BI'] },
];

const initialTopics = [
  { name:'Internet & how the web works', done:true, time:'35 min' },
  { name:'HTML fundamentals', done:true, time:'1 hr 20 min' },
  { name:'CSS foundations', done:true, time:'2 hr 10 min' },
  { name:'Responsive design', done:true, time:'1 hr 45 min' },
  { name:'JavaScript essentials', done:false, time:'3 hr 30 min' },
  { name:'DOM & browser APIs', done:false, time:'2 hr 15 min' },
  { name:'Git and version control', done:false, time:'1 hr 10 min' },
];

function App() {
  const [active, setActive] = useState('Overview');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All paths');
  const [saved, setSaved] = useState(['frontend','ai']);
  const [started, setStarted] = useState(['frontend','backend','ai']);
  const [topics, setTopics] = useState(initialTopics);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => roadmapData.filter(r => {
    const text = `${r.title} ${r.category} ${r.tags.join(' ')}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesFilter = filter === 'All paths' || (filter === 'In progress' && started.includes(r.id) && r.progress > 0) || (filter === 'Bookmarked' && saved.includes(r.id)) || (filter === 'Beginner' && r.level === 'Beginner');
    const matchesPage = active === 'Bookmarks' ? saved.includes(r.id) : active === 'My learning' ? started.includes(r.id) : true;
    return matchesSearch && matchesFilter && matchesPage;
  }), [search, filter, saved, started, active]);

  const completed = topics.filter(t => t.done).length;
  const progress = Math.round(completed / topics.length * 100);
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const toggleSaved = (id) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s,id]);
  const toggleTopic = (idx) => setTopics(t => t.map((topic,i) => i === idx ? {...topic, done:!topic.done} : topic));

  const navItems = [
    { label:'Overview', icon:LayoutDashboard },
    { label:'Explore paths', icon:Compass },
    { label:'My learning', icon:Map },
    { label:'Bookmarks', icon:Bookmark },
  ];
  const visibleCards = active === 'Overview' ? roadmapData.slice(0,4) : filtered;

  return <div className="app-shell">
    <aside className={`sidebar ${showMenu ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark">d<span>.</span></div><span className="brand-name">devio</span><button className="mobile-close icon-btn" onClick={()=>setShowMenu(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="nav-list">
        {navItems.map(item => <button key={item.label} className={`nav-item ${active===item.label?'active':''}`} onClick={()=>{setActive(item.label);setFilter('All paths');setShowMenu(false);}}>
          <item.icon size={18} strokeWidth={1.8}/><span>{item.label}</span>{item.label==='My learning' && <span className="nav-count">3</span>}
        </button>)}
      </nav>
      <div className="side-divider"></div>
      <div className="workspace-label">YOUR SPACE</div>
      <button className="nav-item" onClick={()=>notify('Your weekly activity is looking good!')}><Flame size={18}/><span>Activity streak</span><span className="streak">4d</span></button>
      <button className="nav-item" onClick={()=>notify('Your learning notes are coming soon.')}><BookOpen size={18}/><span>My notes</span></button>
      <div className="sidebar-spacer"></div>
      <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><div className="upgrade-title">Level up your skills</div><p>Build a learning habit, one step at a time.</p><button onClick={()=>{setActive('Explore paths');notify('Choose a roadmap to get started.')}}>Explore paths <ArrowUpRight size={14}/></button></div>
      <button className="nav-item settings-item" onClick={()=>notify('Settings are ready for your next update.')}><Settings size={18}/><span>Settings</span></button>
      <div className="profile"><div className="avatar">G</div><div className="profile-copy"><strong>Guest learner</strong><span>Free workspace</span></div><ChevronDown size={16} className="profile-chevron"/></div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="icon-btn mobile-menu" onClick={()=>setShowMenu(true)} aria-label="Open menu"><Menu size={20}/></button>
        <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><strong>{active}</strong></div>
        <div className="topbar-actions">
          <label className="search-box"><Search size={17}/><input value={search} onChange={e=>{setSearch(e.target.value);if(active==='Overview')setActive('Explore paths')}} placeholder="Search roadmaps..." /><kbd>⌘ K</kbd></label>
          <div className="notification-wrap"><button className="icon-btn notification-btn" onClick={()=>setShowNotifications(v=>!v)} aria-label="Notifications"><Bell size={18}/><i></i></button>
          {showNotifications && <div className="notification-pop"><strong>You're all caught up</strong><p>New roadmap updates will appear here.</p></div>}</div>
          <div className="top-avatar">G</div>
        </div>
      </header>

      <div className="content">
        {active==='Overview' ? <>
          <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot"></span> YOUR DEVELOPER JOURNEY</div><h1>Make progress.<br/><span>Build your future.</span></h1><p className="welcome-copy">Clear roadmaps. Real skills. Your next chapter starts here.</p></div><div className="welcome-art"><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-core"><Code2 size={42}/></div><span className="art-chip chip-one">01 / LEARN</span><span className="art-chip chip-two">02 / BUILD</span><span className="art-chip chip-three">03 / SHIP</span></div></section>
          <section className="stats-grid">
            <div className="stat-card"><div className="stat-top"><span>Active roadmaps</span><div className="stat-icon violet-bg"><Map size={17}/></div></div><div className="stat-number">03 <span className="stat-change">+1 this week</span></div><div className="stat-foot">Keep your momentum going</div></div>
            <div className="stat-card"><div className="stat-top"><span>Topics completed</span><div className="stat-icon lime-bg"><CircleCheck size={17}/></div></div><div className="stat-number">{completed+12} <span className="stat-muted">/ 48</span></div><div className="mini-progress"><span style={{width:'31%'}}></span></div><div className="stat-foot">You're building consistency</div></div>
            <div className="stat-card"><div className="stat-top"><span>Learning streak</span><div className="stat-icon orange-bg"><Flame size={17}/></div></div><div className="stat-number">4 <span className="stat-muted">days</span></div><div className="streak-dots">{['M','T','W','T','F','S','S'].map((d,i)=><span className={i<4?'streak-done':''} key={i}>{i<4?<Check size={11}/>:d}</span>)}</div></div>
          </section>
          <section className="section-heading"><div><div className="section-kicker">PICK UP WHERE YOU LEFT OFF</div><h2>Your learning paths</h2></div><button className="text-link" onClick={()=>setActive('My learning')}>View all <ArrowUpRight size={15}/></button></section>
          <section className="roadmap-grid">
            {roadmapData.filter(r=>started.includes(r.id)).slice(0,3).map(r=><RoadmapCard key={r.id} roadmap={r} saved={saved.includes(r.id)} onSave={()=>toggleSaved(r.id)} onOpen={()=>{setActive('My learning');notify(`${r.title} opened in your learning space.`)}}/> )}
          </section>
          <section className="bottom-grid">
            <div className="panel continue-panel"><div className="panel-heading"><div><div className="section-kicker">CONTINUE LEARNING</div><h3>Frontend fundamentals</h3></div><span className="pill pill-violet">In progress</span></div><p className="panel-sub">A strong foundation makes everything easier.</p><div className="topic-progress-head"><span>{completed} of {topics.length} topics complete</span><strong>{progress}%</strong></div><div className="wide-progress"><span style={{width:`${progress}%`}}></span></div><div className="topic-list">{topics.slice(0,4).map((t,i)=><button className={`topic-row ${t.done?'topic-done':''}`} key={t.name} onClick={()=>toggleTopic(i)}><span className="topic-check">{t.done?<Check size={13}/>:<Circle size={15}/>}</span><span className="topic-name">{t.name}</span><span className="topic-time"><Clock3 size={13}/>{t.time}</span></button>)}</div><button className="continue-btn" onClick={()=>notify('Lesson opened — keep going!')}><Play size={15} fill="currentColor"/> Continue learning <ArrowUpRight size={15}/></button></div>
            <div className="panel weekly-panel"><div className="panel-heading"><div><div className="section-kicker">YOUR MOMENTUM</div><h3>This week</h3></div><span className="week-tag">Last 7 days</span></div><div className="weekly-total"><strong>5.4<span>h</span></strong><span className="weekly-growth"><ArrowUpRight size={14}/> 18%</span></div><p className="panel-sub">Time invested in your future</p><div className="bar-chart">{[28,48,38,72,54,88,44].map((v,i)=><div className="bar-col" key={i}><div className={`bar ${i===5?'bar-active':''}`} style={{height:`${v}%`}}></div><span>{['M','T','W','T','F','S','S'][i]}</span></div>)}</div><div className="chart-foot"><span><i className="chart-dot"></i> Learning time</span><span>Goal: 7 hours</span></div></div>
          </section>
        </> : <>
          <section className="page-intro"><div className="eyebrow"><span className="eyebrow-dot"></span> DEVIO LEARNING HUB</div><h1>{active==='Explore paths'?'Explore your next path':active==='Bookmarks'?'Saved for later':'Your learning space'}<span className="heading-period">.</span></h1><p>{active==='Explore paths'?'Find a roadmap that meets you where you are, then grow from there.':active==='Bookmarks'?'All the roadmaps you want to come back to.':'Your active journeys, all in one place.'}</p></section>
          <div className="filter-row"><div className="filter-tabs">{['All paths','In progress','Bookmarked','Beginner'].map(f=><button key={f} className={filter===f?'filter-active':''} onClick={()=>setFilter(f)}>{f}</button>)}</div><button className="filter-button" onClick={()=>{setFilter('All paths');setSearch('')}}><Filter size={15}/> Reset filters</button></div>
          {visibleCards.length ? <section className="roadmap-grid explore-grid">{visibleCards.map(r=><RoadmapCard key={r.id} roadmap={r} saved={saved.includes(r.id)} onSave={()=>toggleSaved(r.id)} onOpen={()=>{setStarted(s=>s.includes(r.id)?s:[...s,r.id]);notify(`${r.title} added to your learning paths.`)}}/>)}</section> : <div className="empty-state"><div className="empty-icon"><Search size={24}/></div><h3>No roadmaps found</h3><p>Try another search or reset your filters.</p><button className="continue-btn" onClick={()=>{setSearch('');setFilter('All paths')}}>Clear filters</button></div>}
        </>}
        <footer className="footer"><div className="footer-brand"><span className="footer-mark">d.</span><span>Devio</span><span className="footer-copy">© 2025 Devio Learning</span></div><div className="footer-links"><button onClick={()=>notify('Help centre coming soon.')}>Help centre</button><button onClick={()=>notify('Feedback form coming soon.')}>Feedback</button><button onClick={()=>notify('Built for your next chapter.')}>About Devio</button></div></footer>
      </div>
    </main>
    {toast && <div className="toast"><span className="toast-check"><Check size={14}/></span>{toast}</div>}
  </div>;
}

function RoadmapCard({ roadmap:r, saved, onSave, onOpen }) {
  const Icon = r.icon;
  return <article className="roadmap-card">
    <div className="card-topline"><div className={`roadmap-icon ${r.color}`}><Icon size={21} strokeWidth={1.8}/></div><button className={`save-btn ${saved?'is-saved':''}`} onClick={onSave} aria-label={saved?'Remove bookmark':'Bookmark roadmap'}><Bookmark size={17} fill={saved?'currentColor':'none'}/></button></div>
    <div className="card-category">{r.category}</div><h3>{r.title}</h3><p className="card-description">{r.description}</p>
    <div className="tag-row">{r.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div>
    <div className="card-meta"><span><Clock3 size={14}/>{r.duration}</span><span className="level-dot"></span><span>{r.level}</span></div>
    {r.progress>0 ? <div className="card-progress"><div className="card-progress-head"><span>Your progress</span><strong>{r.progress}%</strong></div><div className="wide-progress"><span style={{width:`${r.progress}%`}}></span></div></div> : <div className="card-new">Ready when you are <Sparkles size={13}/></div>}
    <button className={`card-action ${r.color==='lime'?'action-lime':''}`} onClick={onOpen}>{r.progress>0?'Continue path':'Start roadmap'}<ArrowUpRight size={15}/></button>
  </article>;
}

createRoot(document.getElementById('root')).render(<App/>);