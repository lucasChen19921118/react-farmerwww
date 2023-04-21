import React from "react";
import { useNavigate } from "react-router-dom";


function CommPaginationOnlyPN({ queryObj, page, totalPages}) {
  const navigate = useNavigate();
  const qo = { ...queryObj }

  const qoups = new URLSearchParams(qo).toString()
  // console.log("分頁裡的queryObj：", queryObj)
  // console.log("分頁裡的queryObj字串化：", qoups)
  return (
    <div className="row d-flex flex-row justify-content-center w-100">
      <div className="col w-100">
        <nav aria-label="Page navigation example" className="Pagination d-flex justify-content-center">
          <ul className="P-page C-pagination d-flex justify-content-center gap-3 list-unstyled font-M">
            
            {`${page}` === '1' ?
              ""
              :
              <li>
                <a className="page-link" href="#/" onClick={(e) => {
                  e.preventDefault();
                  navigate(`?${qoups}&page=${page - 1}`)
                }}>
                  <li className="fa-solid fa-angle-left"></li>
                </a>
              </li>
              }
            {[...Array(5)].map((v, i) => {
              const p = page + i;
              if (p < 1 || p > totalPages) return null;
              let myClass = 'page-item';
              if (p === page) {
                myClass = 'page-item C-P-active';
              }

              return <li className={myClass} key={p} >
                <a className="page-link" href="#/" onClick={(e) => {
                  e.preventDefault();
                  !queryObj ?
                  navigate(`?page=${p}`)
                    :
                    navigate(`?${qoups}&page=${p}`)
                }}>
                  {p}
                </a>
              </li>
            })}

            {`${page}` === `${totalPages}` ? ""
              :
              <li>
                <a className="page-link" href="#/" onClick={(e) => {
                  e.preventDefault();
                  navigate(`?${qoups}&page=${page + 1}`)
                }}>
                  <li className="fa-solid fa-angle-right"></li>
                </a>
              </li>
            }
          </ul>
        </nav>
        {/* {page + ', ' + totalPages} */}
      </div>
    </div>
  );
}

export default CommPaginationOnlyPN;
