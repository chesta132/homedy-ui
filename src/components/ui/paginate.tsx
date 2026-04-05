import { useEffect, useRef } from "react";
import { Loading } from "./loading";

export type PaginateProps = React.ComponentProps<"div"> & {
  onPaginate?: () => any;
  hasNext?: boolean;
  isLoading?: boolean;
};

export const Paginate = ({ onPaginate, children, hasNext = true, isLoading, ...props }: PaginateProps) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasNext || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onPaginate?.();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasNext, isLoading, onPaginate]);

  return (
    <div {...props}>
      {children}
      {hasNext && (
        <div className="size-full flex justify-center items-center" ref={sentinelRef}>
          <Loading />
        </div>
      )}
    </div>
  );
};
