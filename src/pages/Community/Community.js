import React, { useEffect } from 'react'
import { HOST, CMMA, } from '../../components/api_config'
import { LOGIN } from '../../components/api_config'
import { useState, useContext } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import dayjs from 'dayjs'
import AuthContext from '../../contexts/AuthContext'
import CommPagination from '../../components/CommPagination'
import {
    ListMotionContainer,
    ListMotionItem,
} from '../../components/ListMotion'


//引入樣式
import '../../css/members.css'
import '../../css/community.css'

function Community() {
    const location = useLocation();
    console.log("位置條件改變：", location.search);
    const usp = new URLSearchParams(location.search);
    const orderTime = usp.get("orderTime")
    // const isOrderTime = (orderTime.toLowerCase() === "false" || orderTime=== null) ? false : Boolean(orderTime);
    const [myForm, setMyForm] = useState({
        account: '',
        password: '',
    })
    const { setMyAuth } = useContext(AuthContext)
    const navigate = useNavigate()
    const [users, setUsers] = useState([]) //要保持此狀態一直是陣列！
    const [shownPassword, setHidePassword] = useState(false)
    const { myAuth, logout } = useContext(AuthContext)
    const [keyword, setKeyword] = useState('')
    const [page, setPage] = useState("");
    const [showContent, setShowContent] = useState(false);
    const [sortDate, setSortDate] = useState();
    const [sortHot, setSortHot] = useState("default");
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("");
    const [myPlaceHolder, setMyPlaceHolder] = useState('請輸入文章關鍵字');

    // 篩選詞彙querystring
    const [myQuery, setMyQuery] = useState({})

    const [cmmData, setCmmData] = useState({
        totalRows: 0,
        page: 0,
        totalPages: 0,
        CMA: [],
        queryObj: {},
    });

    console.log("Date初始值:", sortDate)

    useEffect(() => {



    })

    const getListData = async (
        page = 1,
        search,
        orderTime,
        orderHot,

    ) => {

        let response
        let myparams = {
            page,
        }

        if (search) {
            myparams = {
                ...myparams,
                search: search,
            }
        }

        if (orderTime) {
            myparams = {
                ...myparams,
                orderTime: orderTime
            }
        }

        response = await axios.get(CMMA, {
            params: myparams
        })
        setCmmData(response.data);
        console.log("送出去的東西：", myparams)
        // response.data 會依據回應的檔頭作解析, JSON

        console.log("後端送回來的部分：", response.data)
    };


    // useEffect(() => {
    //     在component mount時從API獲取數據

    //     async function fetchData() { 
    //         const response = await axios.get(`${CMMA}?search=${searchTerm}&page=${page}&orderTime=${sortDate}&orderHot=${sortHot}`);
    //         const data = await response.data;
    //         setCmmData(Array.isArray(data) ? data : []);
    //         setCmmData(data);
    //         console.log("回傳的資料：", data)

    //     }
    //     fetchData();
    // }, [location.search]);

    useEffect(() => {
        // 設定功能
        console.log("useEffect--");
        getListData(
            +usp.get("page"),
            usp.get("search"),
            usp.get("orderTime"),
        )

    }, [location.search]);

    console.log("前端選染的部分：", cmmData)

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setIsLoading(false)
            }, Math.random() * 500)
        }
    }, [isLoading])

    //用useEffect最好是基本數值


    const all_artical =
        <ListMotionContainer element="div" className="row  ">

            <div className='w-100 d-flex flex-wrap justify-content-center gap-5'>
                {cmmData.CMA.map(row => (
                    <ListMotionItem
                        element="div"
                        noShift
                        key={row.sid}
                        className="d-flex flex-wrap justify-content-center gap-5"
                    >
                        <div className='cm-artical-card mt-1'>
                            <div className='cm-artical-innerimg' >
                                <img src={`${HOST}/images/community/` + `${row.community_picture1}`}></img>
                            </div>
                            <div className='cm-member-info w-100 d-flex align-items-end ms-3'>
                                <div className='cm-member-ava'>
                                    <img src={`${HOST}/images/avatar/` + `${row.member_img}`}></img>
                                </div>
                                <div className='d-flex flex-column ms-2 w-75 '>
                                    <div className='cm-member-detail d-flex justify-content-between'>
                                        <span className='fs-6'>BY {row.member_name}</span>
                                        <span className='fs-6'>
                                            發表於:
                                            {dayjs(row.community_created_at).format("YYYY-MM-DD")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 點讚區 */}

                            <div
                                className='d-flex justify-content-around cm-like-area'>
                                <div className='cm-like-comments w-50 m-4 d-flex gap-3'>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <img src='/icons/like.png'></img>
                                        <div className='cm-like-span text-success fs-6'>{ }</div>
                                    </div>

                                    <div className='d-flex gap-2 align-items-center'>
                                        <img src='/icons/comment.png'></img>
                                        <div className='cm-like-span  fs-6'>({row.total_reply})</div>
                                    </div>
                                </div>


                                <div className='cm-like-comments w-50 m-4 d-flex align-items-center justify-content-end gap-3'>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <img src='/icons/instagram.png'></img>
                                    </div>

                                    <div className='d-flex gap-2 align-items-center'>
                                        <img src='/icons/facebook.png'></img>
                                    </div>
                                </div>
                            </div>

                            {/* 文章 */}
                            <div className='cm-arti-show d-flex justify-content-around w-100 h-100 bg-white'>
                                <div className='cm-artical-contain-area w-100 h-100 bg-white d-flex'>
                                    <div className='cm-artical ms-5 me-5 mt-4 w-100'>
                                        <h3>{row.community_header}</h3>
                                        <span className='fs-6'>{row.community_contain}</span>
                                        <span className='fs-5 text-warning'>
                                            <a className='text-success' href={`http://localhost:3000/Community/` + `${row.sid}`}>....[點我看更多]</a>
                                        </span>
                                    </div>
                                </div>
                            </div>




                        </div>
                    </ListMotionItem>
                ))}
            </div>
        </ListMotionContainer>


    // 按下查詢按鈕時，觸發查詢
    function handleSearch() {
        const newQuery = { search: keyword, orderTime: sortDate }
        setMyQuery(newQuery)
        navigate(`?${new URLSearchParams(newQuery).toString()}`)
        console.log("NewQuery", newQuery);
    }

    // 清空查詢結果
    const handleClearClick = () => {
        setKeyword("")
        setMyPlaceHolder("請填入文章關鍵字");
        setMyQuery("")
        setSortDate(false)
        // SetNewplaceholder("請填入關鍵字再搜尋喔！")
        navigate(`?${new URLSearchParams("").toString()}`)
    };

    const loader = (
        <div className="lds-ripple  cm-load-contain">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )

    return (
        <div
            className='m-session d-flex justify-content-center pb-5  cm-session'

        >
            {/* 功能列 */}
            <div className='cm-container d-flex flex-column  col-10 h-100 mt-4 cm-margin align-items-center justify-content-center position-relative'>
                <div className='w-100 d-flex justify-content-between'>
                    <div className='cm-select-bar d-flex justify-align-content-between align-items-center gap-2 mt-3 ms-2 me-2 text-center '>
                        <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
                            <a href='/AddArtical'><p className='cm-pbt'>發表新文章</p></a>
                        </div>
                        <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
                            <a href='/MyArtical'><p className='cm-pbt'>我的文章</p></a>
                        </div>
                    </div>
                    {cmmData.totalRows !== 0 ?
                        <div className='mt-4 login-span fw-bolder'>
                            <CommPagination
                                page={cmmData.page}
                                totalPages={cmmData.totalPages}
                                queryObj={cmmData.queryObj}


                            />
                        </div>
                        :
                        ""
                    }
                    <div className='cm-select-bar  d-flex justify-align-content-between align-items-center gap-2 mt- ms-2 me-2 text-center '>
                        {/* <div className='cm-select-bar-btn  d-flex justify-content-center align-items-center'>
                            <p>文章排列方式:</p>
                        </div>
                        <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
                            <p className='cm-pbt'>發文時間</p>
                        </div>
                        <div className='cm-select-bar-btn d-flex justify-content-center align-items-center'>
                            <p className='cm-pbt'>熱門迴響</p>
                        </div> */}
                        <div className="button-with-content d-flex align-items-center">
                            <div className='cm-pointer me-2 d-flex' onClick={() => setShowContent(!showContent)}>
                                {showContent ?
                                    <div className="P-page C-pagination Pagination me-2">
                                        <li className="fa-solid fa-angle-left"></li>
                                    </div>
                                    :
                                    <div className="MB-table-btn me-md-3 ms-auto ms-md-0 cm-send d-flex justify-content-center align-items-center p-2"

                                    >
                                        <i className="fa-solid fa-layer-group"></i>
                                        <i className="fa-solid fa-arrows-up-down"></i>

                                    </div>
                                }
                            </div>
                            <div className={`content ${showContent ? 'show' : ''}`}>
                                <div className='d-flex align-items-center '>
                                    <div className='MB-table-btn me-md-3 ms-auto ms-md-0 cm-send d-flex justify-content-center align-items-center p-2'
                                        onClick={() => {

                                            // { orderTime === "false" || orderTime === undefined || orderTime === null ? setSortDate(false) : setSortDate(true) }
                                            // { orderTime === "true" ? setSortDate(true) : setSortDate(false) }

                                            setSortDate(!!sortDate)
                                            setSortDate(!sortDate)
                                            // const newQuery = { page: cmmData.page, orderTime: sortDate }
                                            // setMyQuery(newQuery)
                                            // console.log("NewQuery", newQuery)
                                            // navigate(`?${new URLSearchParams(newQuery).toString()}`)
                                            console.log("變化:", sortDate)
                                            if (cmmData.queryObj.search) {

                                                const newQuery = { search: cmmData.queryObj.search, orderTime: !sortDate, page: cmmData.page, }
                                                setMyQuery(newQuery)
                                                console.log("NewQuery", newQuery)
                                                navigate(`?${new URLSearchParams(newQuery).toString()}`)
                                            } else {
                                                const newQuery = { orderTime: !sortDate, page: cmmData.page, }
                                                setMyQuery(newQuery)
                                                console.log("NewQuery", newQuery)
                                                navigate(`?${new URLSearchParams(newQuery).toString()}`)
                                            }

                                        }}>
                                        <i className="fa-solid fa-clock"></i>


                                        {sortDate === false || orderTime == "false" || orderTime === null ?

                                            <i className="fa-solid fa-arrow-down"></i>
                                            :
                                            <i className="fa-solid fa-arrow-up"></i>
                                        }

                                    </div>

                                    <div className='MB-table-btn me-md-3 ms-auto ms-md-0 cm-send d-flex justify-content-center align-items-center p-2'
                                        onClick={() => {
                                            if (sortHot === 'default') {
                                                setSortHot(true)
                                            } else {
                                                setSortHot(!sortHot)
                                            }
                                        }
                                        }
                                    >
                                        <i className="fa-solid fa-fire"></i>
                                        {
                                            sortHot === "default" ? "" :
                                                sortHot === true ?
                                                    <i className="fa-solid fa-arrow-down"></i>
                                                    :
                                                    <i className="fa-solid fa-arrow-up"></i>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='justify-content-start d-flex ms-3'>
                            <div className='P-search cm-search position-relative'>
                                <input
                                    className='cm-pbt ps-3'
                                    type="text"
                                    id='keyword'
                                    placeholder={cmmData.queryObj.search ? cmmData.queryObj.search : myPlaceHolder}
                                    value={keyword}
                                    onChange={(e) => {
                                        setKeyword(e.target.value)
                                        if (e.target.value === '' && keyword.length > 0) {
                                            setSearchTerm('')
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && keyword.length > 0) {
                                            const newQuery = { search: keyword }
                                            setMyQuery(newQuery)
                                            navigate(`?${new URLSearchParams(newQuery).toString()}`)
                                            console.log("NewQuery", newQuery)

                                        } else {
                                            setMyPlaceHolder("你沒有輸入關鍵字喔！")
                                        }

                                    }}
                                />
                                {keyword.length > 0 || myQuery.length > 0 || cmmData.queryObj.search ?
                                    <button
                                        className='cm-pbt cm-clear'
                                        onClick={handleClearClick}
                                    >
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                    :
                                    ""}

                                <button
                                    className='cm-pbt fs-6'
                                    onClick={handleSearch}
                                >
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                {/* 功能列 結束*/}

                {/* 文章卡片 */}
                {/* 擺放卡片位置的地方vvvv */}
                <div className='d-flex flex-column justify-content-center'>
                    <div className='cm-artical-session d-flex justify-content-center align-items-start  col-12 h-100 mt-4 gap-5 flex-wrap '>
                        {keyword && myQuery && cmmData.totalRows === 0 ?

                            <div className="P-main cm-nfound  d-flex justify-content-center align-items-start gap-2  cm-blur  cm-show-effect">
                                <img
                                    className="d-none d-md-block"
                                    src="./../../Images/notFound.png"
                                    width="200px"
                                    alt=""
                                />
                                <div className="mt-5 d-flex flex-column justify-content-center text-center cm-show-effect ">
                                    <h3 className="P-notfound font-M">Sorry！ 找不到任何有關</h3>
                                    <p className="P-notfound cm-hideS font-M fs-2 text-success">{myQuery.search}</p>
                                </div>
                                <img
                                    className="d-none d-md-block"
                                    src="./../../Images/notFound.png"
                                    width="200px"
                                    alt=""
                                />
                            </div>
                            :
                            all_artical
                        }
                        {/* {isLoading ?
                            loader
                            : */}





                        {/* 文章卡片 */}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Community
