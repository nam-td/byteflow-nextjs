"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function Button({ i, cp }) {
  if (i === cp) {
    return <button className="current-page">{i}</button>;
  }
  return <button>{i}</button>;
}

export default function PageControllers({ totalPage }) {
  const router = useRouter();
  const currentPath = usePathname();
  const query = useSearchParams();
//   if(!query.get("page")) query.set("page", 1);
  const page = parseInt(query.get("page"));
  const [currentPage, setCurrentPage] = useState(page || 0);

  const next = (e) => {
    e.preventDefault();
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
    router.push(`/?page=${currentPage}`);
  };
  const back = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    router.push(`/?page=${currentPage}`);
  };
  return (
    <div className="page-control">
      <button onClick={(e) => back(e)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M13.28 3.97a.75.75 0 010 1.06L6.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0zm6 0a.75.75 0 010 1.06L12.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="page-indicators">
        {(currentPage <= 3 || currentPage >= totalPage - 2) && (
          <>
            {[1, 2, 3].map((index) => {
              return <Button key={index} i={index} cp={currentPage} />;
            })}
            <p>...</p>
            {[totalPage - 2, totalPage - 1, totalPage].map((index) => {
              return <Button key={index} i={index} cp={currentPage} />;
            })}
          </>
        )}
        {currentPage > 3 && currentPage < totalPage - 2 && (
          <>
            <p>...</p>
            {[currentPage - 1, currentPage, currentPage + 1].map((index) => {
              return <Button key={index} i={index} cp={currentPage} />;
            })}
            <p>...</p>
          </>
        )}
        <p>{currentPage}</p>
      </div>
      <button onClick={(e) => next(e)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M4.72 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 010-1.06zm6 0a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
