import {React,useEffect} from "react";
import "./style.css";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";


function Home() {

    const[states,setStates]=useState({});
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
      API.getMyReviews()
      .then((res)=>{
          setLoading(false);
          if(res.data.status==="sucess"){
                setReviews(res.data.reviews);
           }
           else{
            setMsg(msg);
           }
      })
      .catch((res)=>{
        setLoading(false);
        if(res.data && res.data.msg){
            setMsg(msg);
        }else{
            setMsg("Something went wrong");
        }
      });
  },[])
    return ( <>
              <section className="search_container">
                    <input type="text" 
                           name="search_input" 
                           className="search_input" 
                           onkeyup="searchState()" 
                           placeholder="SEARCH HERE..."
                    />  
                    <input type="date" 
                           name="date" 
                           className="search_date" 
                           placeholder="Search by date" 
                           value="today"
                    />
                    <input type="button" 
                           name="Search" 
                           value="Search"  
                           className="search_button"
                    />

                    <div className="filter_option-wrapper">
                        <label className="filter_option-label">
                               <span>Sort By: </span></label>
                        <select
                            className="filter_option" 
                            onChange={(e)=>{
                              setSortBy(e.target.value);
                              sortedCompanyList(e.target.value);}
                        }>
                            <option value="">None</option>
                            <option value="hrating">Confirmed(asec)</option>
                            <option value="lrating">Confirmed(desc)</option>
                            <option value="lname">Affected(asec)</option>
                            <option value="hname">Affected(desc)</option>
                            <option value="lname">Vaccinated(asec)</option>
                            <option value="hname">Vaccinated(desc)</option>
                        </select>
                    </div>
              </section>


              <section class="state_container">

              </section>
      </>);
}

export default Home;
