import { DataObjectInterface } from "../../utils/DataObjectInterface";
import {forwardRef} from 'react';
import styles from './PostComponent.module.css';

type PostComponentProps = {
  post: DataObjectInterface;
}
const PostComponent = forwardRef<HTMLDivElement|null, PostComponentProps>((props, ref) => {
  const post = props.post;
  return (
  <div ref={ref} className={styles.postDiv}>
      <p>Album ID: {post.albumId}</p>
      <p>Post ID: {post.id}</p>
      <a href={post.url} target="_blank">
        <img src={post.thumbnailUrl} />
      </a>
      <h4>{post.title}</h4>
  </div>
  )
});

export default PostComponent;