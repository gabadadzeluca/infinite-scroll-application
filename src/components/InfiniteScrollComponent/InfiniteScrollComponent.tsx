import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { DataObjectInterface } from "../../utils/DataObjectInterface";

const ITEMS_PER_PAGE = 50;

export default function InfiniteScrollComponent() {
  const [data, setData] = useState<DataObjectInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;
    const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback((node: HTMLDivElement)=>{
    if(!isLoaded) return;
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries:IntersectionObserverEntry[])=>{
      if(entries[0].isIntersecting) setCurrentPage((prevPage)=>prevPage + 1);
    });
    if(node) observer.current.observe(node);
  },[isLoaded]);

  const fetchData = async () =>{
    console.log("MAKING REQUEST")
    const API_URL = `https://jsonplaceholder.typicode.com/photos/?_start=${startIndex}&_limit=${endIndex}`;
    try{
      const res = await axios.get(API_URL);
      setData(res.data);
      setIsLoaded(true);
    }catch(error){
      console.log(error); // test
    }
  }

  useEffect(()=>{
    setIsLoaded(false);
    fetchData();
  },[currentPage])
  console.log(currentPage);
  return (
    <div>
      {data.map((post, index) => {
        if(index + 1 === data.length){
          // fetchData();
          return <div key={index} ref={lastItemRef}>{post.id}</div>
        }
        return <div key={index}>{post.id}</div>;
      })}
      {!isLoaded && <div>Loading...</div>}
    </div>
  );
}
