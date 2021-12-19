import {React,useState} from "react";
import {Link } from "react-router-dom";

import NoResultCard from "../NoResultCard";

import "./style.css";

function Table({state_data}){
        return ( 
            <table>
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Confirmed</th>
                        <th scope="col">Recovered</th>
                        <th scope="col">Deceased</th>
                        <th scope="col">Delta</th>
                        <th scope="col">Delta7</th>
                    </tr>
                </thead>
                <tbody>
                    {state_data && Object.keys(state_data).map((state_name)=>{
                        let rows=[]
                        for(let date in state_data[state_name]["dates"]){
                            //for filtering based on date
                            if(!state_data[state_name]["dates"][date].isHide){
                                rows.push(
                                <tr>
                                    <td data-label="date">{date}</td>
                                    <td data-label="Confirmed">
                                        {
                                            state_data[state_name]["dates"][date].total?.confirmed?
                                            state_data[state_name]["dates"][date].total?.confirmed
                                            :
                                            "Data Not Found"
                                        }
                                    </td>
                                    <td data-label="Recovered">
                                        {
                                            state_data[state_name]["dates"][date].total?.recovered?
                                            state_data[state_name]["dates"][date].total?.recovered
                                            :
                                            "Data Not Found"
                                        }
                                    </td>
                                    <td data-label="Deceased">
                                        {
                                            state_data[state_name]["dates"][date].total?.deceased?
                                            state_data[state_name]["dates"][date].total?.deceased
                                            :
                                            "Data Not Found"
                                        }
                                    </td>
                                    <td data-label="Delta">
                                        <p>Confirmed: 
                                            {
                                                state_data[state_name]["dates"][date].delta?.confirmed?
                                                state_data[state_name]["dates"][date].delta?.confirmed
                                                :
                                                "Data Not Found"
                                            }
                                        </p>
                                        <p> Recovered:
                                            {
                                                state_data[state_name]["dates"][date].delta?.recovered?
                                                state_data[state_name]["dates"][date].delta?.recovered
                                                :
                                                "Data Not Found"
                                            }
                                        </p>
                                        <p>Deceased:
                                            {
                                                state_data[state_name]["dates"][date].delta?.deceased?
                                                state_data[state_name]["dates"][date].delta?.decease
                                                :
                                                "Data Not Found"
                                            }
                                        </p>
                                    </td>
                                    <td data-label="Delta7">
                                        <p>Confirmed: 
                                            {
                                                state_data[state_name]["dates"][date].delta7?.confirmed?
                                                state_data[state_name]["dates"][date].delta7?.confired
                                                :
                                                "Data Not Found"
                                            }
                                        </p>
                                        <p> Recovered:
                                            {
                                                state_data[state_name]["dates"][date].delta7?.recovered?
                                                state_data[state_name]["dates"][date].delta7?.recoveed
                                                :
                                                "Data Not Found"
                                            }
                                        </p>
                                        <p>Deceased:
                                            {
                                                state_data[state_name]["dates"][date].delta7?.deceased?
                                                state_data[state_name]["dates"][date].delta7?.deceased
                                                :
                                                "Data Not Found"
                                            }
                                        </p>
                                    </td>
                                </tr>
                                )
                            }
                        }
                        return rows;
                        })
                    }
                </tbody>
            </table>
            );
    }

export default Table;
