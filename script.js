
(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('theme');
  const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(saved==='dark'||(!saved&&prefersDark)) root.classList.add('dark');
  document.querySelector('.theme-toggle').addEventListener('click',()=>{
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark')?'dark':'light');
  });
  fetch('resume.json').then(r=>r.json()).then(render).catch(()=>{});
  function render(data){
    const sum=document.querySelector('[data-bind="summary"]');
    if(sum && data.basics?.summary) sum.textContent=data.basics.summary;
    listCards('experience', data.work, w=>({
      title: w.position+' — '+w.name,
      meta: [w.startDate, w.endDate||'Present'].filter(Boolean).join(' – '),
      bullets: w.highlights||[]
    }));
    const skillsUl=document.querySelector('[data-list="skills"]');
    if(skillsUl && Array.isArray(data.skills)){
      data.skills.forEach(s=>{const li=document.createElement('li'); li.textContent=s.name||s; skillsUl.appendChild(li);});
    }
    listCards('education', data.education, e=>({
      title: e.studyType+' — '+e.institution,
      meta: [e.area, e.startDate, e.endDate].filter(Boolean).join(' • '),
      bullets: e.courses||[]
    }));
    const nav=document.querySelector('.links');
    if(nav && data.basics?.profiles){
      data.basics.profiles.forEach(p=>{const a=document.createElement('a'); a.href=p.url; a.textContent=p.network; a.target='_blank'; a.rel='noopener'; nav.appendChild(a);});
    }
    document.getElementById('year').textContent=new Date().getFullYear();
  }
  function listCards(section, items, map){
    const host=document.querySelector(`[data-list="${section}"]`);
    if(!host||!Array.isArray(items)) return;
    items.forEach(it=>{const {title, meta, bullets}=map(it); const card=document.createElement('article'); card.className='card'; const h3=document.createElement('h3'); h3.textContent=title; card.appendChild(h3); if(meta){const m=document.createElement('div'); m.className='meta'; m.textContent=meta; card.appendChild(m);} if(bullets?.length){const ul=document.createElement('ul'); bullets.forEach(b=>{const li=document.createElement('li'); li.textContent=b; ul.appendChild(li);}); card.appendChild(ul);} host.appendChild(card);});
  }
})();
