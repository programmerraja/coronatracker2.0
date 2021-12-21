import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NoResultCard from "../NoResultCard";

import "./style.css";

const PER_PAGE = 10;

function Table({ state_data, state_name, is_filter, state_dates }) {

  const [start, setStart] = useState(0);
  const [state_length, setStateLength] = useState(
    Object.keys(state_data[state_name]["dates"]).length
  );
  const [per_page, setPerPage] = useState(PER_PAGE);
  const [page_no, setPageNo] = useState(1);
  const [dates, setDates] = useState(
    Object.keys(state_data[state_name]["dates"])
  );

  //if user choose date filter we need to set per page to full length 
  //such that it will travel through all and print only one;
  useEffect(() => {
    if (!is_filter) {
      setPerPage(state_length);
    } else {
      setPerPage(PER_PAGE);
    }
  }, [is_filter]);

  //when we sort the when user click sort by if we use Object.keys it return in sort order that we don't want
  //so we don't want when user click sort by so we pass the actual sorted that we want
  useEffect(() => {
    if (state_dates.length > 0) {
      setDates(state_dates);
    } else {
      setDates(Object.keys(state_data[state_name]["dates"]));
    }
  }, [state_dates]);

  const perviousPage = () => {
    window.scrollTo(0, 0);
    let offset = start - PER_PAGE;
    if (offset >= 0) {
      setStart(offset);
      setPerPage(PER_PAGE);
      setPageNo((prevstate) => prevstate - 1);
    }
  };

  const nextPage = () => {
    window.scrollTo(0, 0);
    let offset = start + per_page;
    if (offset < state_length && offset + per_page < state_length) {
      setStart(offset);
      setPerPage(PER_PAGE);
      setPageNo((prevstate) => prevstate + 1);
    } else {
      // for displaying the remaning that not part of PER_PAGE
      let balance_offset = state_length - (start + per_page);
      if (balance_offset < per_page) {
        setStart(offset);
        setPerPage(balance_offset);
        setPageNo((prevstate) => prevstate + 1);
      }
    }
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Date</th>
            <th scope="col">Confirmed</th>
            <th scope="col">Recovered</th>
            <th scope="col">Deceased</th>
            <th scope="col">Delta</th>
            <th scope="col">Delta7</th>
          </tr>
        </thead>
        <tbody>
          {state_data &&
            Object.keys(state_data).map((state_name) => {
              let rows = [];
              //for pagination
              for (let i = start; i < start + per_page; i++) {
                //for filtering based on date
                if (!state_data[state_name]["dates"][dates[i]].isHide) {
                  rows.push(
                    <tr key={i+"key"+dates[i]}>
                      <td data-label="No">{i + 1}</td>
                      <td data-label="Date">{dates[i]}</td>
                      <td data-label="Confirmed">
                        {state_data[state_name]["dates"][dates[i]].total
                          ?.confirmed
                          ? state_data[state_name]["dates"][dates[i]].total
                              ?.confirmed
                          : "Data Not Found"}
                      </td>
                      <td data-label="Recovered">
                        {state_data[state_name]["dates"][dates[i]].total
                          ?.recovered
                          ? state_data[state_name]["dates"][dates[i]].total
                              ?.recovered
                          : "Data Not Found"}
                      </td>
                      <td data-label="Deceased">
                        {state_data[state_name]["dates"][dates[i]].total
                          ?.deceased
                          ? state_data[state_name]["dates"][dates[i]].total
                              ?.deceased
                          : "Data Not Found"}
                      </td>
                      <td data-label="Delta">
                        <p>
                          Confirmed:
                          {state_data[state_name]["dates"][dates[i]].delta
                            ?.confirmed
                            ? state_data[state_name]["dates"][dates[i]].delta
                                ?.confirmed
                            : "Data Not Found"}
                        </p>
                        <p>
                          {" "}
                          Recovered:
                          {state_data[state_name]["dates"][dates[i]].delta
                            ?.recovered
                            ? state_data[state_name]["dates"][dates[i]].delta
                                ?.recovered
                            : "Data Not Found"}
                        </p>
                        <p>
                          Deceased:
                          {state_data[state_name]["dates"][dates[i]].delta
                            ?.deceased
                            ? state_data[state_name]["dates"][dates[i]].delta
                                ?.decease
                            : "Data Not Found"}
                        </p>
                      </td>
                      <td data-label="Delta7">
                        <p>
                          Confirmed:
                          {state_data[state_name]["dates"][dates[i]].delta7
                            ?.confirmed
                            ? state_data[state_name]["dates"][dates[i]].delta7
                                ?.confired
                            : "Data Not Found"}
                        </p>
                        <p>
                          {" "}
                          Recovered:
                          {state_data[state_name]["dates"][dates[i]].delta7
                            ?.recovered
                            ? state_data[state_name]["dates"][dates[i]].delta7
                                ?.recoveed
                            : "Data Not Found"}
                        </p>
                        <p>
                          Deceased:
                          {state_data[state_name]["dates"][dates[i]].delta7
                            ?.deceased
                            ? state_data[state_name]["dates"][dates[i]].delta7
                                ?.deceased
                            : "Data Not Found"}
                        </p>
                      </td>
                    </tr>
                  );
                }
              }
              return rows;
            })}
        </tbody>
      </table>
      {is_filter && (
        <div className="pagination_buttons">
          {page_no != 1 ? (
            <input type="button" value="Previous" onClick={perviousPage} />
          ) : (
            <div></div>
          )}
          <p>
            Page:{page_no}/{Math.ceil(state_length / PER_PAGE)}
          </p>

          {page_no != Math.ceil(state_length / PER_PAGE) ? (
            <input type="button" value="Next" onClick={nextPage} />
          ) : (
            <div></div>
          )}
        </div>
      )}
    </>
  );
}

export default Table;
