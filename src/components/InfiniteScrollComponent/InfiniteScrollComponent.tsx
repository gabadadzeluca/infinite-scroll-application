import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = 'https://jsonplaceholder.typicode.com/photos';

export default function InfiniteScrollComponent() {
  const fetchData = async () =>{

    try{
      const res = await axios.get(API_URL);
      const data = res.data;
      console.log(data)
    }catch(error){
      console.log(error); // test
    }
  }

  useEffect(()=>{
    fetchData();
  },[])

  return (
    <div></div>
  )
}
