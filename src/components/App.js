import ReviewList from "./ReviewList";
import { getReviews } from "../api";
import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";

const Limit = 6;

function App() {
  const [order, setOrder] = useState("createdAt");
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder("createdAt");

  const handleBestClick = () => setOrder("rating");

  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getReviews(options);
    } catch (error) {
      setLoadingError(error);
      return;
    } finally {
      setIsLoading(false);
    }
    const { paging, reviews } = result;
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((prevItems) => [...prevItems, ...reviews]);
    }
    setOffset(options.offset + reviews.length);
    setHasNext(paging.hasNext);
  };

  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: Limit });
  };

  useEffect(() => {
    handleLoad({ order, offset: 0, limit: Limit });
  }, [order]);

  return (
    <div>
      <button onClick={handleNewestClick}>최신순</button>
      <button onClick={handleBestClick}>베스트순</button>
      <ReviewForm />
      <ReviewList items={sortedItems} onDelete={handleDelete} />
      {hasNext && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더 보기
        </button>
      )}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
}

export default App;
