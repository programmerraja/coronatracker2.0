# coronatracker2.0
It is new version of corona tracker
<br>
<p>A new corona tracker build with react used covid19 india API (https://data.covid19india.org/)</p>

# what are the featurs implemented on home page?
  <ul>
 <li> States Names are Alphabeticaly listed by default.</li>
 <li> Search will filter the states based on name.(If No Data match the filter Result not found UI will be shown)</li>
 <li> List has Date Filter. On selecting a Date, stats for that particular date will
be reflected in all State card. </li>
 <li> List has option to sort states by<li>
  <ol>
   <li> 1. Confirmed count Ascending/Descending.</li>
   <li> 2. Affected Percentage Ascending/Descending.</li>
    <li>3. Vaccinated percentage Ascending/Descending. </li>
  </ol>
 <li> On selecting a district, corrosponding district stats will
be displayed in the card.</li>
 <li>Can be navigated through left/right arrows. Total,
Delta, Delta7 stats will be displayed in those pages</li>
  <li>Data are cached on local storage for faster access</li>
 </ul>
 
 # what are the featurs implemented on state detail page?
   <ul>
 <li> Date and sort by and District filters are applicable.</li>
 <li> If No Data match the filter Result not found UI will be shown.</li>
 <li> Data are stored on cache state beacuse the data is more then 5MB.</li>
 </ul>
 
 # what are the featurs that i implement my own?
   <ul>
  <li>Avoided fetching multiple time same data by checking if the data avalible in cache.</li>
 <li> For some states,districts the data is not for that it will shown data not found in UI.</li>
 <li> Optimized state detail page by using pagination to avoid rendering a huge list in same window.</li>
 </ul>
 
take look the website here <a href="https://programmerraja.github.io/coronatracker/index">click here </a>

# what are problem need to fix ?
<ul>
 <li>Applied filters should be persisted in local storage for faster
access. but i am facing some issues on that</li>
 </ul>

# website preview

