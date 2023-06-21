import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { DataObjectInterface } from "../../utils/DataObjectInterface";
import PostComponent from "../PostComponent/PostComponent";
import styles from "./InfiniteScrollComponent.module.css";

const ITEMS_COUNT = 5000;
const ITEMS_PER_PAGE = 20;
const LAST_PAGE_INDEX = Math.floor(ITEMS_COUNT/ITEMS_PER_PAGE) - 1;

export default function InfiniteScrollComponent() {
  const [data, setData] = useState<DataObjectInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  
  const startIndex = (currentPage-1) * ITEMS_PER_PAGE;
  const endIndex = (currentPage) * ITEMS_PER_PAGE;
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (!isLoaded) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries[0].isIntersecting)
            setCurrentPage((prevPage) => prevPage + 1);
        }
      );
      if (node) observer.current.observe(node);
    },
    [isLoaded]
  );

  const fetchData = async () => {
    const API_URL = `https://jsonplaceholder.typicode.com/photos/?_start=${startIndex}&_limit=${endIndex}`;
    console.log('Making Request')
    if (currentPage > LAST_PAGE_INDEX) {
      console.log("LIMIT REACHED");
      setLimitReached(true);
      return;
    }
    try {
      setLimitReached(false);
      const res = await axios.get(API_URL);
      setData(res.data);
      setIsLoaded(true);
    } catch (error) {
      setIsLoaded(false);
      console.log(error); // test
    }
  };

  useEffect(() => {
    setIsLoaded(false);
    fetchData();
  }, [currentPage]);

  return (
    <div className={styles.container}>
      {data.map((post, index) => {
        if (index + 1 === data.length) {
          return <PostComponent key={index} ref={lastItemRef} post={post} />;
        }
        return <PostComponent key={index} post={post} />;
      })}
      {!isLoaded && <div className={styles.loading}>Loading...</div>}
      {limitReached && <div className={styles.limitReached}>Limit Reached</div>}
    </div>
  );
}
