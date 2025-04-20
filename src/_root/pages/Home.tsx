import Loader from "@/components/shared/Loader";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
const Home = () => {
  const {
    data: posts,
    isPending: isPostloading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-;eft w-full">Home Feed</h2>
          {isPostloading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => {
                return <li>{post.caption}</li>;
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
