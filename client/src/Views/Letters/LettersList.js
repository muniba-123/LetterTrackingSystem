import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '../Components/Table';
import { Apis } from '../Configurations/Api_endpoints';


const columns = [
    {
      dataField: "letterId",
      text: "Id",
      sort: true,
      isKey: true,
      formatter: (cell, row, e) => {
        return (
          <Link
            className=""
            to={`/Letter/${row.letterId}`}
          >
            {row.letterId}
          </Link>
        );
      },
    },
    {
      dataField: "senderOrg",
      text: "From",
      sort: true,
      
    },
    {
      dataField: "receiverOrg",
      text: "To",
      sort: true,
    },
    {
      dataField: "updatedOn",
      text: "Date Updated",
      sort: true
    },   
    {
      dataField: "status",
      text: "Status",
      sort: true
    },
  ];

export function LettersList() {
  const [letters, setLetters] = useState([]);
  useEffect(()=>{
    getLetters();
  })
  const getLetters = () => {
    axios
      .get(`${Apis.getLetters}`, {})
      .then((res) => {
       setLetters(res.data)
      });
  }
    return(
        <Table data={ letters } columns={ columns } />
  
    )
}